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

  // Reviews routes
  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const reviewData = req.body;
      const review = await storage.createReview(req.session.userId, reviewData);
      await storage.addPoints(req.session.userId, 25, 'review_posted', 'Posted a review');
      res.status(201).json(review);
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const { itemType, itemId, userId } = req.query;
      
      let reviews = [];
      if (itemType && itemId) {
        reviews = await storage.getReviewsByItem(itemType as string, parseInt(itemId as string));
      } else if (userId) {
        reviews = await storage.getReviewsByUser(parseInt(userId as string));
      } else {
        // Return all reviews with mock data for demo
        reviews = [
          {
            id: 1,
            userId: 1,
            itemType: "accommodation",
            itemId: 1,
            rating: 5,
            title: "Amazing stay with great service",
            content: "The hotel exceeded all expectations. The staff was incredibly friendly and the rooms were spotless. The location was perfect for exploring the city.",
            photos: [],
            isVerified: true,
            helpfulCount: 12,
            reportCount: 0,
            response: "Thank you for your wonderful review! We're delighted you enjoyed your stay.",
            responseDate: "2024-01-15",
            createdAt: "2024-01-10",
            updatedAt: "2024-01-10",
            user: {
              firstName: "Sarah",
              lastName: "Johnson",
              profileImage: null,
              membershipTier: "premium"
            },
            item: {
              name: "Four Seasons Resort",
              location: "Bali, Indonesia",
              type: "accommodation"
            }
          },
          {
            id: 2,
            userId: 2,
            itemType: "transport",
            itemId: 1,
            rating: 4,
            title: "Reliable and comfortable ride",
            content: "The car was clean and the driver was professional. Pickup was on time and the journey was smooth.",
            photos: [],
            isVerified: false,
            helpfulCount: 8,
            reportCount: 0,
            createdAt: "2024-01-08",
            updatedAt: "2024-01-08",
            user: {
              firstName: "Mike",
              lastName: "Chen",
              profileImage: null,
              membershipTier: "adventurer"
            },
            item: {
              name: "Sedan Car Rental",
              location: "Bangkok, Thailand",
              type: "transport"
            }
          }
        ];
      }
      
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews/:reviewId/helpful", requireAuth, async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { isHelpful } = req.body;
      await storage.updateReviewHelpfulness(req.session.userId, parseInt(reviewId), isHelpful);
      res.json({ message: "Review helpfulness updated" });
    } catch (error) {
      console.error("Review helpfulness error:", error);
      res.status(500).json({ message: "Failed to update review helpfulness" });
    }
  });

  app.get("/api/reviews/stats/:itemType/:itemId", async (req, res) => {
    try {
      const { itemType, itemId } = req.params;
      const stats = await storage.getReviewStats(itemType, parseInt(itemId));
      res.json(stats);
    } catch (error) {
      console.error("Review stats error:", error);
      res.status(500).json({ message: "Failed to fetch review stats" });
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

  // Travel alerts endpoint
  app.get('/api/travel-alerts', async (req, res) => {
    try {
      const { country, category, severity } = req.query;
      
      // Mock realistic travel alerts for Southeast Asia
      const mockAlerts = [
        {
          id: "alert-001",
          title: "Severe Weather Warning: Typhoon Approaching Philippines",
          summary: "Typhoon 'Maya' is expected to make landfall in northern Philippines within 48 hours. Flight cancellations at Manila and Cebu airports are anticipated. Travelers should check with airlines for updates and consider alternative arrangements.",
          severity: "high",
          category: "weather",
          countries: ["Philippines"],
          affectedAirports: ["NAIA Manila", "Cebu Mactan"],
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: "Channel NewsAsia",
          sourceUrl: "https://www.channelnewsasia.com",
          lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: "alert-002",
          title: "Air Traffic Control System Maintenance at Bangkok Airport",
          summary: "Suvarnabhumi Airport will conduct scheduled maintenance on air traffic control systems. Expect delays of 30-60 minutes for departing flights between 01:00-05:00 local time.",
          severity: "medium",
          category: "flight",
          countries: ["Thailand"],
          affectedAirports: ["Bangkok Suvarnabhumi"],
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: "Bangkok Post",
          sourceUrl: "https://www.bangkokpost.com",
          lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "alert-003",
          title: "New Health Requirements for Singapore Entry",
          summary: "Singapore has updated health screening requirements for travelers from high-risk countries. All visitors must complete digital health declaration 72 hours before arrival. Vaccination certificates required for certain destinations.",
          severity: "medium",
          category: "health",
          countries: ["Singapore"],
          affectedAirports: ["Singapore Changi"],
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: "The Straits Times",
          sourceUrl: "https://www.straitstimes.com",
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "alert-004",
          title: "KL Airport Express Train Service Disruption",
          summary: "KLIA Express train service between KL Sentral and KLIA will be suspended for emergency maintenance. Free shuttle bus service available. Allow extra 45 minutes travel time to airport.",
          severity: "medium",
          category: "transport",
          countries: ["Malaysia"],
          affectedAirports: ["Kuala Lumpur KLIA"],
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: "Channel NewsAsia",
          sourceUrl: "https://www.channelnewsasia.com",
          lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "alert-005",
          title: "Vietnam Visa Processing Delays",
          summary: "Vietnam visa processing experiencing delays due to high volume during peak season. E-visa applications taking 5-7 business days instead of usual 3 days. Plan accordingly for travel.",
          severity: "low",
          category: "general",
          countries: ["Vietnam"],
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          source: "Nikkei Asia",
          sourceUrl: "https://asia.nikkei.com",
          lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];

      let filteredAlerts = mockAlerts;

      // Apply filters
      if (country && country !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.countries.includes(country as string)
        );
      }

      if (category && category !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.category === category
        );
      }

      if (severity && severity !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.severity === severity
        );
      }

      // Sort by severity and recency
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      filteredAlerts.sort((a, b) => {
        const severityDiff = severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

      res.json(filteredAlerts);
    } catch (error) {
      console.error("Travel alerts error:", error);
      res.status(500).json({ message: "Failed to fetch travel alerts" });
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

  // AI Chat endpoint with travel alerts integration
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Extract mentioned countries from user message
      const seaCountries = ["Thailand", "Vietnam", "Singapore", "Malaysia", "Philippines", "Indonesia", "Cambodia", "Laos", "Myanmar", "Brunei"];
      const mentionedCountries = seaCountries.filter(country => 
        message.toLowerCase().includes(country.toLowerCase())
      );

      // Check for relevant travel alerts
      let relevantAlerts = [];
      if (mentionedCountries.length > 0) {
        // Fetch current alerts for mentioned countries
        const alertsResponse = await fetch(`http://localhost:5000/api/travel-alerts?country=${mentionedCountries[0]}`);
        if (alertsResponse.ok) {
          const alerts = await alertsResponse.json();
          relevantAlerts = alerts.filter((alert: any) => 
            alert.countries.some((country: string) => mentionedCountries.includes(country))
          );
        }
      }

      // Generate intelligent AI response
      let reply = "I'm Bruce, your AI travel assistant! I'm here to help you plan the perfect Southeast Asian adventure. ";
      
      if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
        reply += "What destination are you interested in exploring? I can help with flights, accommodations, local tips, and current travel conditions.";
      } else if (mentionedCountries.length > 0) {
        reply += `Great choice asking about ${mentionedCountries.join(" and ")}! `;
        
        if (relevantAlerts.length > 0) {
          const highPriorityAlerts = relevantAlerts.filter((alert: any) => 
            alert.severity === "high" || alert.severity === "critical"
          );
          
          if (highPriorityAlerts.length > 0) {
            reply += `⚠️ Important: I found ${highPriorityAlerts.length} active travel alert(s) for ${mentionedCountries.join(" and ")}. Please check the Travel Alerts section for detailed information before finalizing your plans. `;
          }
        }
        
        reply += "I can help you find the best flights, accommodations, local transportation, and must-visit attractions. What specific aspect of your trip would you like assistance with?";
      } else if (message.toLowerCase().includes("alert") || message.toLowerCase().includes("warning")) {
        reply += "I can help you stay informed about travel conditions. Check the Travel Alerts section for real-time updates on weather, flight delays, health requirements, and security advisories across Southeast Asia.";
      } else if (message.toLowerCase().includes("flight") || message.toLowerCase().includes("booking")) {
        reply += "I can help you find the best flights and manage your bookings. Use the Flights section to search for routes, compare prices, and the Booking Manager to track all your reservations in one place.";
      } else {
        reply += "I can assist with trip planning, destination recommendations, travel alerts, visa requirements, and much more. What would you like to know about Southeast Asian travel?";
      }

      res.json({ 
        reply,
        travelAlerts: relevantAlerts.length > 0 ? relevantAlerts : undefined
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        reply: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or check the Travel Alerts section directly for current travel conditions.",
        error: "Chat service temporarily unavailable"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
