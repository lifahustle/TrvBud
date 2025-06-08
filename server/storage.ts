import { 
  users, 
  type User, 
  type InsertUser,
  type UserSession,
  type MembershipBenefit,
  type PointsHistory,
  type Destination, 
  type Accommodation, 
  type Transport, 
  type Flight, 
  type Offer, 
  type Testimonial, 
  type Booking,
  type InsertNewsletterSubscriber,
  type NewsletterSubscriber,
  FlightClass,
  MembershipTier
} from "@shared/schema";

// Modify the interface with all CRUD methods needed for our application
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  verifyPassword(username: string, password: string): Promise<User | null>;

  // Session operations
  createSession(userId: number): Promise<UserSession>;
  getSession(sessionId: string): Promise<UserSession | undefined>;
  deleteSession(sessionId: string): Promise<void>;

  // Membership operations
  getMembershipBenefits(tier: string): Promise<MembershipBenefit[]>;
  updateMembershipTier(userId: number, tier: string): Promise<User>;
  addPoints(userId: number, points: number, action: string, description?: string): Promise<void>;
  getPointsHistory(userId: number): Promise<PointsHistory[]>;

  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getDestinationById(id: number): Promise<Destination | undefined>;

  // Accommodation operations
  getAccommodations(): Promise<Accommodation[]>;
  getAccommodationById(id: number): Promise<Accommodation | undefined>;

  // Transport operations
  getTransportOptions(): Promise<Transport[]>;
  getTransportById(id: number): Promise<Transport | undefined>;

  // Flight operations
  getFlights(): Promise<Flight[]>;
  getFlightById(id: number): Promise<Flight | undefined>;

  // Offer operations
  getOffers(): Promise<Offer[]>;
  getOfferById(id: number): Promise<Offer | undefined>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;

  // Booking operations
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  createBooking(booking: any): Promise<Booking>;

  // Newsletter operations
  subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;

  // Itinerary template for the builder
  getItineraryTemplate(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Destination[];
  private accommodations: Accommodation[];
  private transportOptions: Transport[];
  private flights: Flight[];
  private offers: Offer[];
  private testimonials: Testimonial[];
  private bookings: Booking[];
  private newsletterSubscribers: Map<string, NewsletterSubscriber>;
  private itineraryTemplate: any[];
  
  currentId: number;
  private subscriberId: number;

  constructor() {
    // Initialize empty data structures
    this.users = new Map();
    this.destinations = [];
    this.accommodations = [];
    this.transportOptions = [];
    this.flights = [];
    this.offers = [];
    this.testimonials = [];
    this.bookings = [];
    this.newsletterSubscribers = new Map();
    this.itineraryTemplate = [];
    
    this.currentId = 1;
    this.subscriberId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return this.destinations;
  }

  async getDestinationById(id: number): Promise<Destination | undefined> {
    return this.destinations.find(destination => destination.id === id);
  }

  // Accommodation operations
  async getAccommodations(): Promise<Accommodation[]> {
    return this.accommodations;
  }

  async getAccommodationById(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.find(accommodation => accommodation.id === id);
  }

  // Transport operations
  async getTransportOptions(): Promise<Transport[]> {
    return this.transportOptions;
  }

  async getTransportById(id: number): Promise<Transport | undefined> {
    return this.transportOptions.find(transport => transport.id === id);
  }

  // Flight operations
  async getFlights(): Promise<Flight[]> {
    return this.flights;
  }

  async getFlightById(id: number): Promise<Flight | undefined> {
    return this.flights.find(flight => flight.id === id);
  }

  // Offer operations
  async getOffers(): Promise<Offer[]> {
    return this.offers;
  }

  async getOfferById(id: number): Promise<Offer | undefined> {
    return this.offers.find(offer => offer.id === id);
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return this.testimonials;
  }

  // Booking operations
  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  async createBooking(booking: any): Promise<Booking> {
    const id = this.currentId++;
    const newBooking = { ...booking, id };
    this.bookings.push(newBooking);
    return newBooking;
  }

  // Newsletter operations
  async subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.subscriberId++;
    const newSubscriber: NewsletterSubscriber = { 
      ...subscriber, 
      id,
      createdAt: new Date()
    };
    this.newsletterSubscribers.set(subscriber.email, newSubscriber);
    return newSubscriber;
  }

  // Itinerary template
  async getItineraryTemplate(): Promise<any> {
    return this.itineraryTemplate;
  }

  // Initialize mock data for the application
  private initializeMockData() {
    // Sample destinations
    this.destinations = [
      {
        id: 1,
        name: "Banaue",
        country: "Philippines",
        description: "Ancient Rice Terraces",
        image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        rating: 4.8,
        reviewCount: 120,
        pricePerNight: 45,
        tags: ["Trending"],
        featured: true
      },
      {
        id: 2,
        name: "Hoi An",
        country: "Vietnam",
        description: "Ancient Town",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        rating: 4.9,
        reviewCount: 205,
        pricePerNight: 38,
        tags: [],
        featured: true
      },
      {
        id: 3,
        name: "Siem Reap",
        country: "Cambodia",
        description: "Angkor Temples",
        image: "https://pixabay.com/get/g380d81bc4ef92dcc4d695dd7c588bfaec3306714f549dfe2fcc7697b69591352be11b76c7a34594c289aa65329608688e2aab76b5c14f4f9dd5904173fb0eb74_1280.jpg",
        rating: 4.7,
        reviewCount: 312,
        pricePerNight: 42,
        tags: ["Popular"],
        featured: true
      },
      {
        id: 4,
        name: "Bangkok",
        country: "Thailand",
        description: "Vibrant City Life",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        rating: 4.6,
        reviewCount: 430,
        pricePerNight: 55,
        tags: ["Popular"],
        featured: true
      },
      {
        id: 5,
        name: "Ubud",
        country: "Indonesia",
        description: "Cultural Heart of Bali",
        image: "https://images.unsplash.com/photo-1531089073319-17596b946d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        rating: 4.9,
        reviewCount: 280,
        pricePerNight: 60,
        tags: ["Trending"],
        featured: true
      },
      {
        id: 6,
        name: "Kathmandu",
        country: "Nepal",
        description: "Himalayan Gateway",
        image: "https://images.unsplash.com/photo-1580181361041-7f0ce1904eff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        rating: 4.5,
        reviewCount: 186,
        pricePerNight: 35,
        tags: ["Adventure"],
        featured: true
      }
    ];

    // Sample accommodations
    this.accommodations = [
      {
        id: 1,
        name: "Four Seasons Resort",
        location: "Koh Samui, Thailand",
        description: "Luxurious beachfront villa with private pool, stunning ocean views, and world-class amenities.",
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
        ],
        pricePerNight: 320,
        discountPercentage: 0,
        stars: 5,
        reviewCount: 48,
        amenities: ["Beachfront", "Spa", "Free Breakfast", "WiFi"],
        hasFreeWifi: true,
        hasBreakfast: true,
        hasRestaurant: true
      },
      {
        id: 2,
        name: "Ubud Jungle Villa",
        location: "Ubud, Bali, Indonesia",
        description: "Traditional Balinese-style villa nestled in the rice terraces with private infinity pool and authentic local experience.",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
        ],
        pricePerNight: 185,
        discountPercentage: 0,
        stars: 4,
        reviewCount: 36,
        amenities: ["Private Pool", "Jungle View", "Breakfast", "Free Shuttle"],
        hasFreeWifi: true,
        hasBreakfast: true,
        hasRestaurant: false
      },
      {
        id: 3,
        name: "Angkor Heritage Lodge",
        location: "Siem Reap, Cambodia",
        description: "Elegant boutique hotel with traditional Khmer design, located minutes from the ancient temples of Angkor.",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
        ],
        pricePerNight: 145,
        discountPercentage: 0,
        stars: 4,
        reviewCount: 29,
        amenities: ["Temple View", "Cultural Tours", "Breakfast", "Pool"],
        hasFreeWifi: true,
        hasBreakfast: true,
        hasRestaurant: true
      },
      {
        id: 4,
        name: "Marina Bay Prestige",
        location: "Singapore",
        description: "Ultra-modern luxury hotel with breathtaking city views, infinity rooftop pool, and award-winning restaurants.",
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
        ],
        pricePerNight: 280,
        discountPercentage: 0,
        stars: 5,
        reviewCount: 54,
        amenities: ["City View", "Rooftop Pool", "Fine Dining", "Spa"],
        hasFreeWifi: true,
        hasBreakfast: true,
        hasRestaurant: true
      },
      {
        id: 5,
        name: "Hanoi Old Quarter Hotel",
        location: "Hanoi, Vietnam",
        description: "Charming boutique hotel in Hanoi's historic Old Quarter, featuring traditional Vietnamese decor and modern amenities.",
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
        ],
        pricePerNight: 95,
        discountPercentage: 15,
        stars: 4,
        reviewCount: 42,
        amenities: ["Central Location", "Airport Transfer", "Walking Tours", "Breakfast"],
        hasFreeWifi: true,
        hasBreakfast: true,
        hasRestaurant: false
      },
      {
        id: 6,
        name: "Himalayan Mountain Retreat",
        location: "Pokhara, Nepal",
        description: "Stunning mountain lodge with panoramic views of the Annapurna range, offering a peaceful retreat with adventure activities.",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
        ],
        pricePerNight: 125,
        discountPercentage: 0,
        stars: 4,
        reviewCount: 31,
        amenities: ["Mountain View", "Yoga Classes", "Trekking Tours", "Organic Food"],
        hasFreeWifi: true,
        hasBreakfast: true,
        hasRestaurant: true
      }
    ];

    // Sample transportation options
    this.transportOptions = [
      {
        id: 1,
        name: "Sedan Car Rental",
        type: "car",
        description: "Comfortable sedan cars for city exploration and short trips.",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        pricePerDay: 35,
        seats: 4,
        hasAC: true,
        hasGPS: true,
        hasWifi: false,
        pickupLocations: ["Bangkok", "Phuket", "Chiang Mai", "Koh Samui"]
      },
      {
        id: 2,
        name: "Tuk-Tuk Experience",
        type: "tuk-tuk",
        description: "Authentic local transportation for city sightseeing and short distances.",
        image: "https://pixabay.com/get/ga7f14ae97a81f8f4958bcc4c3b6c1e9b7d51558d4dd46e732c08923da9fc0ab643fa8876b0fa2d2943ed3109641a00d406d5658dc0a5604067b2151ee0c024f2_1280.jpg",
        pricePerDay: 15,
        seats: 3,
        hasAC: false,
        hasGPS: false,
        hasWifi: false,
        pickupLocations: ["Bangkok", "Chiang Mai", "Ayutthaya"]
      },
      {
        id: 3,
        name: "SUV with Driver",
        type: "suv",
        description: "Spacious vehicles for group travel and countryside exploration.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        pricePerDay: 75,
        seats: 7,
        hasAC: true,
        hasGPS: true,
        hasWifi: true,
        pickupLocations: ["Bangkok", "Phuket", "Chiang Mai", "Krabi", "Pattaya"]
      },
      {
        id: 4,
        name: "Scooter Rental",
        type: "motorcycle",
        description: "Flexible and affordable way to explore islands and small towns.",
        image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        pricePerDay: 12,
        seats: 2,
        hasAC: false,
        hasGPS: false,
        hasWifi: false,
        pickupLocations: ["Bali", "Phuket", "Koh Samui", "Koh Phangan", "Phi Phi Islands"]
      },
      {
        id: 5,
        name: "Luxury Van Service",
        type: "van",
        description: "Premium van service with professional driver for group travel and airport transfers.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        pricePerDay: 90,
        seats: 10,
        hasAC: true,
        hasGPS: true,
        hasWifi: true,
        pickupLocations: ["Bangkok", "Singapore", "Kuala Lumpur", "Ho Chi Minh City", "Jakarta"]
      },
      {
        id: 6,
        name: "Electric Scooter",
        type: "motorcycle",
        description: "Eco-friendly electric scooters for urban exploration with zero emissions.",
        image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        pricePerDay: 15,
        seats: 1,
        hasAC: false,
        hasGPS: false,
        hasWifi: false,
        pickupLocations: ["Singapore", "Bangkok", "Kuala Lumpur"]
      }
    ];

    // Sample flights
    this.flights = [
      {
        id: 1,
        airline: "Singapore Airlines",
        flightNumber: "SQ619",
        origin: "Bangkok",
        destination: "Singapore",
        departureTime: "08:45",
        arrivalTime: "12:15",
        duration: "2h 30m",
        price: 320,
        stops: 0,
        stopLocations: [],
        flightClass: FlightClass.ECONOMY
      },
      {
        id: 2,
        airline: "Thai Airways",
        flightNumber: "TG401",
        origin: "Bangkok",
        destination: "Hanoi",
        departureTime: "10:30",
        arrivalTime: "12:20",
        duration: "1h 50m",
        price: 245,
        stops: 0,
        stopLocations: [],
        flightClass: FlightClass.ECONOMY
      },
      {
        id: 3,
        airline: "Vietnam Airlines",
        flightNumber: "VN706",
        origin: "Hanoi",
        destination: "Siem Reap",
        departureTime: "14:15",
        arrivalTime: "16:00",
        duration: "1h 45m",
        price: 190,
        stops: 0,
        stopLocations: [],
        flightClass: FlightClass.ECONOMY
      },
      {
        id: 4,
        airline: "Malaysian Airlines",
        flightNumber: "MH785",
        origin: "Singapore",
        destination: "Bali",
        departureTime: "09:20",
        arrivalTime: "12:10",
        duration: "2h 50m",
        price: 280,
        stops: 0,
        stopLocations: [],
        flightClass: FlightClass.ECONOMY
      },
      {
        id: 5,
        airline: "Cathay Pacific",
        flightNumber: "CX717",
        origin: "Bangkok",
        destination: "Kathmandu",
        departureTime: "11:30",
        arrivalTime: "15:45",
        duration: "4h 15m",
        price: 420,
        stops: 1,
        stopLocations: ["Delhi"],
        flightClass: FlightClass.ECONOMY
      },
      {
        id: 6,
        airline: "AirAsia",
        flightNumber: "AK123",
        origin: "Kuala Lumpur",
        destination: "Bangkok",
        departureTime: "07:15",
        arrivalTime: "08:20",
        duration: "2h 05m",
        price: 120,
        stops: 0,
        stopLocations: [],
        flightClass: FlightClass.ECONOMY
      },
      {
        id: 7,
        airline: "Bangkok Airways",
        flightNumber: "PG903",
        origin: "Bangkok",
        destination: "Siem Reap",
        departureTime: "09:45",
        arrivalTime: "10:55",
        duration: "1h 10m",
        price: 210,
        stops: 0,
        stopLocations: [],
        flightClass: FlightClass.ECONOMY
      }
    ];

    // Sample special offers
    this.offers = [
      {
        id: 1,
        title: "Early Bird Flight Discount",
        description: "Save up to 20% on all flights to Thailand, Vietnam, and Cambodia when booking 6 months in advance.",
        badgeText: "Limited Time",
        badgeColor: "error",
        expiresInDays: 14,
        discountPercentage: 20,
        originalPrice: null,
        discountedPrice: null,
        featured: true
      },
      {
        id: 2,
        title: "Bali Beach Getaway",
        description: "5 nights luxury accommodation with private pool, airport transfers, and daily breakfast included.",
        badgeText: "Package Deal",
        badgeColor: "secondary",
        expiresInDays: null,
        discountPercentage: null,
        originalPrice: 1299,
        discountedPrice: 899,
        featured: true
      },
      {
        id: 3,
        title: "Nepal Trekking Adventure",
        description: "10-day guided trek through the Annapurna region with experienced local guides and porters.",
        badgeText: "Exclusive",
        badgeColor: "accent",
        expiresInDays: null,
        discountPercentage: 25,
        originalPrice: null,
        discountedPrice: null,
        featured: true
      },
      {
        id: 4,
        title: "Thailand Island Hopping",
        description: "7-day island-hopping adventure including Phuket, Phi Phi, and Krabi with all transfers and activities.",
        badgeText: "Summer Special",
        badgeColor: "secondary",
        expiresInDays: 30,
        discountPercentage: 15,
        originalPrice: 850,
        discountedPrice: 720,
        featured: false
      },
      {
        id: 5,
        title: "Luxury Vietnam Tour",
        description: "10-day journey through Vietnam staying at 5-star accommodations with private tours and transfers.",
        badgeText: "Premium",
        badgeColor: "primary",
        expiresInDays: null,
        discountPercentage: null,
        originalPrice: 2200,
        discountedPrice: 1850,
        featured: false
      }
    ];

    // Sample testimonials
    this.testimonials = [
      {
        id: 1,
        name: "Sarah Johnson",
        tripDetails: "Bali & Thailand Trip",
        rating: 5,
        comment: "The itinerary builder made planning our multi-destination trip so easy. The accommodations were exactly as pictured, and the local transport options saved us time and money. Would highly recommend!",
        date: "March 2024"
      },
      {
        id: 2,
        name: "David Chen",
        tripDetails: "Vietnam & Cambodia Trip",
        rating: 5,
        comment: "Our trip through Vietnam and Cambodia was perfect thanks to this platform. The suggested accommodations were excellent, and having a private driver pre-arranged made the experience so much smoother.",
        date: "January 2024"
      },
      {
        id: 3,
        name: "Jessica Miller",
        tripDetails: "Nepal Trekking Trip",
        rating: 4,
        comment: "The Nepal trekking package exceeded my expectations. The guides were knowledgeable, the accommodations comfortable, and the sights breathtaking. My only suggestion would be more vegetarian food options.",
        date: "December 2023"
      },
      {
        id: 4,
        name: "Michael Thompson",
        tripDetails: "Singapore & Malaysia Tour",
        rating: 5,
        comment: "Everything was brilliantly organized from start to finish. The hotels were excellent and the included tours gave us a deep appreciation of the local culture. We'll definitely book again for our next Asian adventure.",
        date: "February 2024"
      }
    ];

    // Sample bookings/trips
    this.bookings = [
      {
        id: 1,
        userId: 1,
        name: "Thailand Adventure 2025",
        startDate: new Date("2025-02-06"),
        endDate: new Date("2025-02-13"),
        destinations: ["Bangkok", "Chiang Mai", "Phuket"],
        itinerary: [
          {
            date: "2025-02-06",
            activities: [
              {
                type: "flight",
                title: "Arrive in Bangkok",
                description: "Thai Airways Flight TG315 arrives at 10:30 AM"
              },
              {
                type: "accommodation",
                title: "Check-in: Four Seasons Bangkok",
                description: "Riverside Suite"
              },
              {
                type: "activity",
                title: "Dinner cruise on the Chao Phraya River",
                description: "Traditional Thai cuisine with city lights view"
              }
            ]
          },
          {
            date: "2025-02-07",
            activities: [
              {
                type: "activity",
                title: "Bangkok Temple Tour",
                description: "Grand Palace, Wat Pho, Wat Arun"
              },
              {
                type: "activity",
                title: "Evening at Chatuchak Market",
                description: "Local shopping and street food experience"
              }
            ]
          },
          {
            date: "2025-02-08",
            activities: [
              {
                type: "flight",
                title: "Fly to Siem Reap",
                description: "Bangkok Airways PG903 departs at 9:45 AM"
              },
              {
                type: "accommodation",
                title: "Check-in: Angkor Heritage Lodge",
                description: "Deluxe Room with Temple View"
              }
            ]
          }
        ],
        totalPrice: 2450,
        status: "confirmed"
      },
      {
        id: 2,
        userId: 1,
        name: "Bali Retreat",
        startDate: new Date("2024-09-15"),
        endDate: new Date("2024-09-22"),
        destinations: ["Ubud", "Seminyak", "Nusa Dua"],
        itinerary: [
          {
            date: "2024-09-15",
            activities: [
              {
                type: "flight",
                title: "Arrive in Denpasar",
                description: "Singapore Airlines SQ942 arrives at 2:15 PM"
              },
              {
                type: "transport",
                title: "Private transfer to Ubud",
                description: "90-minute scenic drive"
              },
              {
                type: "accommodation",
                title: "Check-in: Ubud Jungle Villa",
                description: "Private Pool Villa"
              }
            ]
          }
        ],
        totalPrice: 1850,
        status: "confirmed"
      },
      {
        id: 3,
        userId: 1,
        name: "Vietnam Explorer",
        startDate: new Date("2023-11-10"),
        endDate: new Date("2023-11-20"),
        destinations: ["Hanoi", "Ha Long Bay", "Hoi An", "Ho Chi Minh City"],
        itinerary: [
          {
            date: "2023-11-10",
            activities: [
              {
                type: "flight",
                title: "Arrive in Hanoi",
                description: "Vietnam Airlines VN456 arrives at 9:40 AM"
              },
              {
                type: "accommodation",
                title: "Check-in: Hanoi Old Quarter Hotel",
                description: "Deluxe Room"
              }
            ]
          }
        ],
        totalPrice: 2100,
        status: "completed"
      }
    ];

    // Sample itinerary template
    this.itineraryTemplate = [
      {
        day: 1,
        date: "2025-02-06",
        activities: [
          {
            type: "flight",
            title: "Arrive in Bangkok",
            description: "Thai Airways Flight TG315 arrives at 10:30 AM"
          },
          {
            type: "accommodation",
            title: "Check-in: Four Seasons Bangkok",
            description: "Riverside Suite"
          },
          {
            type: "activity",
            title: "Dinner cruise on the Chao Phraya River",
            description: "Traditional Thai cuisine with city lights view"
          }
        ]
      },
      {
        day: 2,
        date: "2025-02-07",
        activities: [
          {
            type: "activity",
            title: "Bangkok Temple Tour",
            description: "Grand Palace, Wat Pho, Wat Arun"
          },
          {
            type: "activity",
            title: "Evening at Chatuchak Market",
            description: "Local shopping and street food experience"
          }
        ]
      },
      {
        day: 3,
        date: "2025-02-08",
        activities: [
          {
            type: "flight",
            title: "Fly to Siem Reap",
            description: "Bangkok Airways PG903 departs at 9:45 AM"
          },
          {
            type: "accommodation",
            title: "Check-in: Angkor Heritage Lodge",
            description: "Deluxe Room with Temple View"
          }
        ]
      }
    ];

    // Add a demo user
    const demoUser: User = {
      id: 1,
      username: "demo_user",
      password: "password123", // In a real app, this would be hashed
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      createdAt: new Date()
    };
    this.users.set(1, demoUser);
  }
}

export const storage = new MemStorage();
