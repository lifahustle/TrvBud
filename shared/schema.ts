import { pgTable, text, serial, integer, boolean, date, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table with Membership
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth"),
  nationality: text("nationality"),
  profileImage: text("profile_image"),
  membershipTier: text("membership_tier").notNull().default("explorer"),
  membershipStartDate: timestamp("membership_start_date").defaultNow(),
  membershipExpiryDate: timestamp("membership_expiry_date"),
  pointsBalance: integer("points_balance").default(0),
  totalTrips: integer("total_trips").default(0),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  dateOfBirth: true,
  nationality: true,
  profileImage: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Membership Tiers Enum
export enum MembershipTier {
  EXPLORER = "explorer",
  ADVENTURER = "adventurer", 
  PREMIUM = "premium"
}

// User Sessions Table
export const userSessions = pgTable("user_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserSession = typeof userSessions.$inferSelect;

// Destinations Table
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  tags: text("tags").array().notNull(),
  featured: boolean("featured").default(false),
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  country: true,
  description: true,
  image: true,
  rating: true,
  reviewCount: true,
  pricePerNight: true,
  tags: true,
  featured: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

// Accommodations Table
export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  images: text("images").array().notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  discountPercentage: integer("discount_percentage").default(0),
  stars: integer("stars").notNull(),
  reviewCount: integer("review_count").notNull(),
  amenities: text("amenities").array().notNull(),
  hasFreeWifi: boolean("has_free_wifi").default(true),
  hasBreakfast: boolean("has_breakfast").default(false),
  hasRestaurant: boolean("has_restaurant").default(false),
});

export const insertAccommodationSchema = createInsertSchema(accommodations).pick({
  name: true,
  location: true,
  description: true,
  images: true,
  pricePerNight: true,
  discountPercentage: true,
  stars: true,
  reviewCount: true,
  amenities: true,
  hasFreeWifi: true,
  hasBreakfast: true,
  hasRestaurant: true,
});

export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;

// Transport Vehicles Table
export const transport = pgTable("transport", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  pricePerDay: integer("price_per_day").notNull(),
  seats: integer("seats").notNull(),
  hasAC: boolean("has_ac").default(false),
  hasGPS: boolean("has_gps").default(false),
  hasWifi: boolean("has_wifi").default(false),
  pickupLocations: text("pickup_locations").array().notNull(),
});

export const insertTransportSchema = createInsertSchema(transport).pick({
  name: true,
  type: true,
  description: true,
  image: true,
  pricePerDay: true,
  seats: true,
  hasAC: true,
  hasGPS: true,
  hasWifi: true,
  pickupLocations: true,
});

export type InsertTransport = z.infer<typeof insertTransportSchema>;
export type Transport = typeof transport.$inferSelect;

// Flights Table
export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: integer("price").notNull(),
  stops: integer("stops").default(0),
  stopLocations: text("stop_locations").array(),
  flightClass: text("flight_class").notNull(),
});

export const insertFlightSchema = createInsertSchema(flights).pick({
  airline: true,
  flightNumber: true,
  origin: true,
  destination: true,
  departureTime: true,
  arrivalTime: true,
  duration: true,
  price: true,
  stops: true,
  stopLocations: true,
  flightClass: true,
});

export enum FlightClass {
  ECONOMY = "economy",
  PREMIUM_ECONOMY = "premium_economy",
  BUSINESS = "business",
  FIRST = "first",
}

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;

// Special Offers Table
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  badgeText: text("badge_text").notNull(),
  badgeColor: text("badge_color").notNull(),
  expiresInDays: integer("expires_in_days"),
  discountPercentage: integer("discount_percentage"),
  originalPrice: integer("original_price"),
  discountedPrice: integer("discounted_price"),
  featured: boolean("featured").default(false),
});

export const insertOfferSchema = createInsertSchema(offers).pick({
  title: true,
  description: true,
  badgeText: true,
  badgeColor: true,
  expiresInDays: true,
  discountPercentage: true,
  originalPrice: true,
  discountedPrice: true,
  featured: true,
});

export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offers.$inferSelect;

// Testimonials Table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tripDetails: text("trip_details").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: text("date").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  tripDetails: true,
  rating: true,
  comment: true,
  date: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Bookings Table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  destinations: text("destinations").array().notNull(),
  itinerary: jsonb("itinerary").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  name: true,
  startDate: true,
  endDate: true,
  destinations: true,
  itinerary: true,
  totalPrice: true,
  status: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Newsletter Subscribers Table
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Membership Benefits Table
export const membershipBenefits = pgTable("membership_benefits", {
  id: serial("id").primaryKey(),
  tier: text("tier").notNull(),
  benefitType: text("benefit_type").notNull(),
  description: text("description").notNull(),
  value: text("value"),
  isActive: boolean("is_active").default(true),
});

export type MembershipBenefit = typeof membershipBenefits.$inferSelect;

// User Points History Table
export const pointsHistory = pgTable("points_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").notNull(),
  action: text("action").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PointsHistory = typeof pointsHistory.$inferSelect;
