import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertNewsletterSubscriberSchema, insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

// Session configuration
const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(sessionConfig);

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: any) => {
    if (req.session?.userId) {
      return next();
    }
    res.status(401).json({ message: "Authentication required" });
  };

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user with default membership
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.verifyPassword(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      res.json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/profile", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.session.userId, updates);
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Membership routes
  app.post("/api/membership/upgrade", requireAuth, async (req, res) => {
    try {
      const { tier } = req.body;
      if (!['explorer', 'adventurer', 'premium'].includes(tier)) {
        return res.status(400).json({ message: "Invalid membership tier" });
      }

      const user = await storage.updateMembershipTier(req.session.userId, tier);
      await storage.addPoints(req.session.userId, 100, 'membership_upgrade', 'Membership upgrade bonus');
      
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      console.error("Membership upgrade error:", error);
      res.status(500).json({ message: "Failed to upgrade membership" });
    }
  });

  app.get("/api/points/history", requireAuth, async (req, res) => {
    try {
      const history = await storage.getPointsHistory(req.session.userId);
      res.json(history);
    } catch (error) {
      console.error("Points history error:", error);
      res.status(500).json({ message: "Failed to fetch points history" });
    }
  });

  // Destinations API
  app.get("/api/destinations", async (_req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  // Accommodations API
  app.get("/api/accommodations", async (_req, res) => {
    try {
      const accommodations = await storage.getAccommodations();
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accommodations" });
    }
  });

  // Transport API
  app.get("/api/transport", async (_req, res) => {
    try {
      const transportOptions = await storage.getTransportOptions();
      res.json(transportOptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transport options" });
    }
  });

  // Flights API
  app.get("/api/flights", async (_req, res) => {
    try {
      const flights = await storage.getFlights();
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flights" });
    }
  });

  // Special Offers API
  app.get("/api/offers", async (_req, res) => {
    try {
      const offers = await storage.getOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch special offers" });
    }
  });

  // Testimonials API
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Bookings API
  app.get("/api/bookings", async (_req, res) => {
    try {
      // In a real application, we'd get the user ID from the session
      // For now, we'll just use a dummy user ID
      const userId = 1;
      const bookings = await storage.getBookingsByUserId(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Newsletter subscription API
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      await storage.subscribeToNewsletter(validatedData);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email address" });
      } else {
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    }
  });

  // Itinerary template API (for the itinerary builder)
  app.get("/api/itinerary-template", async (_req, res) => {
    try {
      const itineraryTemplate = await storage.getItineraryTemplate();
      res.json(itineraryTemplate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch itinerary template" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
