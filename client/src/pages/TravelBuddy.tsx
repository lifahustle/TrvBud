import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MapPin, 
  Calendar, 
  MessageSquare,
  Phone,
  Mail,
  Star,
  Clock,
  Route,
  Camera,
  Heart,
  Share2,
  UserPlus,
  Search,
  Filter,
  Globe,
  Shield,
  Award,
  Briefcase,
  BookOpen,
  Coffee
} from "lucide-react";

interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar?: string;
  bio: string;
  languages: string[];
  interests: string[];
  travelStyle: string;
  destinations: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  responseTime: string;
  availability: 'available' | 'busy' | 'unavailable';
  services: {
    guide: boolean;
    translator: boolean;
    photographer: boolean;
    companion: boolean;
  };
  rates?: {
    hourly: number;
    daily: number;
    currency: string;
  };
  socialProof: {
    tripsCompleted: number;
    yearsExperience: number;
    certifications: string[];
  };
}

interface TravelRequest {
  id: string;
  title: string;
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  travelers: number;
  budget: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: Date;
  responses: number;
  status: 'open' | 'filled' | 'expired';
}

const TravelBuddy = () => {
  const [activeTab, setActiveTab] = useState<'find' | 'connect' | 'requests'>('find');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [buddies, setBuddies] = useState<TravelBuddy[]>([]);
  const [requests, setRequests] = useState<TravelRequest[]>([]);
  const [showCreateRequest, setShowCreateRequest] = useState<boolean>(false);

  // Sample travel buddies data
  const sampleBuddies: TravelBuddy[] = [
    {
      id: "1",
      name: "Ariya Nakamura",
      age: 28,
      location: "Bangkok, Thailand",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Local Bangkok guide with 5+ years experience. Love showing travelers authentic Thai culture, street food, and hidden gems.",
      languages: ["Thai", "English", "Japanese"],
      interests: ["Street Food", "Temples", "Markets", "Photography", "Culture"],
      travelStyle: "Cultural Explorer",
      destinations: ["Bangkok", "Ayutthaya", "Floating Markets", "Chinatown"],
      rating: 4.9,
      reviewCount: 127,
      verified: true,
      responseTime: "Within 2 hours",
      availability: "available",
      services: {
        guide: true,
        translator: true,
        photographer: true,
        companion: false
      },
      rates: {
        hourly: 15,
        daily: 80,
        currency: "USD"
      },
      socialProof: {
        tripsCompleted: 156,
        yearsExperience: 5,
        certifications: ["Licensed Tour Guide", "First Aid Certified"]
      }
    },
    {
      id: "2", 
      name: "Linh Nguyen",
      age: 25,
      location: "Ho Chi Minh City, Vietnam",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Photography enthusiast and adventure seeker. Perfect companion for exploring Vietnam's vibrant cities and stunning landscapes.",
      languages: ["Vietnamese", "English", "French"],
      interests: ["Photography", "Adventure", "Coffee Culture", "History", "Motorbikes"],
      travelStyle: "Adventure Seeker",
      destinations: ["Ho Chi Minh City", "Hanoi", "Ha Long Bay", "Sapa"],
      rating: 4.8,
      reviewCount: 93,
      verified: true,
      responseTime: "Within 4 hours",
      availability: "available",
      services: {
        guide: true,
        translator: true,
        photographer: true,
        companion: true
      },
      rates: {
        hourly: 12,
        daily: 65,
        currency: "USD"
      },
      socialProof: {
        tripsCompleted: 89,
        yearsExperience: 3,
        certifications: ["Photography Certificate", "Tourism License"]
      }
    },
    {
      id: "3",
      name: "Marcus Tan",
      age: 32,
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Business traveler turned local expert. Specialize in Singapore's food scene, shopping districts, and efficient city exploration.",
      languages: ["English", "Mandarin", "Malay"],
      interests: ["Food & Dining", "Shopping", "Urban Exploration", "Business Networking"],
      travelStyle: "City Explorer",
      destinations: ["Singapore", "Johor Bahru", "Batam"],
      rating: 4.7,
      reviewCount: 64,
      verified: true,
      responseTime: "Within 6 hours",
      availability: "busy",
      services: {
        guide: true,
        translator: false,
        photographer: false,
        companion: true
      },
      rates: {
        hourly: 25,
        daily: 150,
        currency: "SGD"
      },
      socialProof: {
        tripsCompleted: 45,
        yearsExperience: 2,
        certifications: ["Singapore Tourism Board Certified"]
      }
    }
  ];

  // Sample travel requests
  const sampleRequests: TravelRequest[] = [
    {
      id: "1",
      title: "Looking for Photography Guide in Bali",
      destination: "Bali, Indonesia",
      dates: {
        start: new Date(2025, 2, 15),
        end: new Date(2025, 2, 22)
      },
      travelers: 2,
      budget: "$500-800",
      description: "Couple looking for local photographer/guide to capture our honeymoon in Bali. Interested in sunrise at Mount Batur, rice terraces, and traditional ceremonies.",
      requirements: ["Photography skills", "English speaking", "Transportation included"],
      postedBy: "Sarah & Mike",
      postedDate: new Date(2025, 1, 10),
      responses: 12,
      status: "open"
    },
    {
      id: "2",
      title: "Cultural Immersion Experience in Cambodia", 
      destination: "Siem Reap, Cambodia",
      dates: {
        start: new Date(2025, 3, 5),
        end: new Date(2025, 3, 12)
      },
      travelers: 4,
      budget: "$300-500",
      description: "Family with teenagers seeking authentic cultural experiences beyond typical tourist sites. Want to learn about Khmer traditions, local crafts, and community projects.",
      requirements: ["Cultural expertise", "Family-friendly", "Educational focus"],
      postedBy: "Johnson Family",
      postedDate: new Date(2025, 1, 8),
      responses: 8,
      status: "open"
    }
  ];

  useEffect(() => {
    setBuddies(sampleBuddies);
    setRequests(sampleRequests);
  }, []);

  const destinations = [
    "Bangkok, Thailand",
    "Ho Chi Minh City, Vietnam", 
    "Singapore",
    "Kuala Lumpur, Malaysia",
    "Bali, Indonesia",
    "Manila, Philippines",
    "Siem Reap, Cambodia",
    "Vientiane, Laos",
    "Yangon, Myanmar",
    "Bandar Seri Begawan, Brunei"
  ];

  const serviceTypes = [
    { value: "guide", label: "Tour Guide", icon: MapPin },
    { value: "translator", label: "Translator", icon: Globe },
    { value: "photographer", label: "Photographer", icon: Camera },
    { value: "companion", label: "Travel Companion", icon: Users }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buddy.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buddy.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDestination = !selectedDestination || buddy.location === selectedDestination;
    
    const matchesServices = selectedServices.length === 0 || 
                           selectedServices.some(service => buddy.services[service as keyof typeof buddy.services]);
    
    return matchesSearch && matchesDestination && matchesServices;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Travel Buddy - TrvBUD V2</title>
        <meta name="description" content="Connect with local guides and travel companions across Southeast Asia." />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Travel Buddy
        </h1>
        <p className="text-neutral-500">Connect with local guides and travel companions for authentic experiences</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg mb-8 w-fit">
        <button
          onClick={() => setActiveTab('find')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'find' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Find Buddies
        </button>
        <button
          onClick={() => setActiveTab('connect')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'connect' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          My Connections
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'requests' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Travel Requests
        </button>
      </div>

      {/* Find Buddies Tab */}
      {activeTab === 'find' && (
        <div>
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Find Your Perfect Travel Buddy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <Input
                    placeholder="Search by name, location, or interests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="All destinations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All destinations</SelectItem>
                      {destinations.map((dest) => (
                        <SelectItem key={dest} value={dest}>
                          {dest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Services</label>
                  <Select value={selectedServices.join(',')} onValueChange={(value) => setSelectedServices(value ? value.split(',') : [])}>
                    <SelectTrigger>
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All services</SelectItem>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buddy Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBuddies.map((buddy) => (
              <Card key={buddy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={buddy.avatar} alt={buddy.name} />
                        <AvatarFallback>{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {buddy.verified && (
                        <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{buddy.name}</h3>
                          <p className="text-sm text-neutral-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {buddy.location} • Age {buddy.age}
                          </p>
                        </div>
                        <Badge className={getAvailabilityColor(buddy.availability)}>
                          {buddy.availability}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{buddy.rating}</span>
                          <span className="text-sm text-neutral-500">({buddy.reviewCount})</span>
                        </div>
                        <div className="flex items-center text-sm text-neutral-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {buddy.responseTime}
                        </div>
                      </div>
                      
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{buddy.bio}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-neutral-400" />
                          <div className="flex flex-wrap gap-1">
                            {buddy.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {buddy.interests.slice(0, 4).map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {buddy.interests.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{buddy.interests.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {buddy.services.guide && <Badge variant="outline">Guide</Badge>}
                          {buddy.services.translator && <Badge variant="outline">Translator</Badge>}
                          {buddy.services.photographer && <Badge variant="outline">Photo</Badge>}
                        </div>
                        
                        {buddy.rates && (
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ${buddy.rates.daily}/{buddy.rates.currency} per day
                            </p>
                            <p className="text-xs text-neutral-500">
                              ${buddy.rates.hourly}/hr
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBuddies.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No buddies found</h3>
                <p className="text-neutral-500">Try adjusting your search criteria or check back later for new buddies.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Travel Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Travel Requests</h2>
            <Button onClick={() => setShowCreateRequest(!showCreateRequest)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Post Request
            </Button>
          </div>

          {/* Create Request Form */}
          {showCreateRequest && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create Travel Request</CardTitle>
                <CardDescription>Let local buddies know what kind of experience you're looking for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Request title" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest} value={dest}>
                            {dest}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea placeholder="Describe what you're looking for..." rows={3} />
                  
                  <div className="flex space-x-2">
                    <Button>Post Request</Button>
                    <Button variant="outline" onClick={() => setShowCreateRequest(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Request List */}
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{request.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-500">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {request.destination}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {request.dates.start.toLocaleDateString()} - {request.dates.end.toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {request.travelers} travelers
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={request.status === 'open' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                      <p className="text-sm text-neutral-500 mt-1">
                        {request.responses} responses
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 mb-4">{request.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge variant="outline">Budget: {request.budget}</Badge>
                      <Badge variant="outline">Posted by {request.postedBy}</Badge>
                    </div>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Connections Tab */}
      {activeTab === 'connect' && (
        <div>
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No connections yet</h3>
              <p className="text-neutral-500 mb-4">Start connecting with travel buddies to see them here.</p>
              <Button onClick={() => setActiveTab('find')}>
                Find Buddies
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TravelBuddy;