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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  Edit3,
  Trash2,
  Filter,
  Search,
  Plus,
  Plane,
  Bed,
  Car,
  Users,
  Star,
  RefreshCw
} from "lucide-react";

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'transport' | 'activity';
  title: string;
  destination: string;
  dates: {
    start: Date;
    end?: Date;
  };
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalAmount: number;
  currency: string;
  bookingReference: string;
  provider: string;
  travelers: number;
  details: {
    [key: string]: any;
  };
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'partial';
  cancellationPolicy?: string;
  contactInfo?: {
    phone: string;
    email: string;
  };
  documents?: {
    ticket?: string;
    voucher?: string;
    confirmation?: string;
  };
}

const BookingManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Sample bookings data
  const sampleBookings: Booking[] = [
    {
      id: "FL001",
      type: "flight",
      title: "Bangkok to Singapore",
      destination: "Singapore",
      dates: {
        start: new Date(2025, 2, 15, 14, 30),
        end: new Date(2025, 2, 15, 17, 45)
      },
      status: "confirmed",
      totalAmount: 485,
      currency: "USD",
      bookingReference: "SQ8472",
      provider: "Singapore Airlines",
      travelers: 2,
      details: {
        flightNumber: "SQ 117",
        class: "Economy",
        seats: ["12A", "12B"],
        baggage: "23kg included",
        meal: "Asian Vegetarian"
      },
      paymentStatus: "paid",
      cancellationPolicy: "Free cancellation up to 24 hours before departure",
      contactInfo: {
        phone: "+65 6223 8888",
        email: "support@singaporeair.com"
      },
      documents: {
        ticket: "e-ticket.pdf",
        confirmation: "booking-confirmation.pdf"
      }
    },
    {
      id: "HT002",
      type: "hotel",
      title: "Marina Bay Sands",
      destination: "Singapore",
      dates: {
        start: new Date(2025, 2, 15),
        end: new Date(2025, 2, 18)
      },
      status: "confirmed",
      totalAmount: 1247,
      currency: "SGD",
      bookingReference: "MBS-789456",
      provider: "Marina Bay Sands",
      travelers: 2,
      details: {
        roomType: "Deluxe City View",
        roomNumber: "TBA",
        checkIn: "15:00",
        checkOut: "11:00",
        amenities: ["Pool Access", "WiFi", "Breakfast", "Gym"]
      },
      paymentStatus: "paid",
      cancellationPolicy: "Free cancellation until 6 PM on Mar 13, 2025",
      contactInfo: {
        phone: "+65 6688 8888",
        email: "reservations@marinabaysands.com"
      },
      documents: {
        voucher: "hotel-voucher.pdf",
        confirmation: "reservation-confirmation.pdf"
      }
    },
    {
      id: "TR003",
      type: "transport",
      title: "Airport Transfer",
      destination: "Singapore",
      dates: {
        start: new Date(2025, 2, 15, 18, 30)
      },
      status: "confirmed",
      totalAmount: 45,
      currency: "SGD",
      bookingReference: "GRAB-334455",
      provider: "Grab",
      travelers: 2,
      details: {
        vehicleType: "Premium Sedan",
        pickup: "Changi Airport Terminal 3",
        dropoff: "Marina Bay Sands Hotel",
        driver: "TBA",
        licensePlate: "TBA"
      },
      paymentStatus: "paid",
      contactInfo: {
        phone: "+65 6507 0808",
        email: "support@grab.com"
      }
    },
    {
      id: "AC004",
      type: "activity",
      title: "Singapore City Tour",
      destination: "Singapore",
      dates: {
        start: new Date(2025, 2, 16, 9, 0),
        end: new Date(2025, 2, 16, 17, 0)
      },
      status: "pending",
      totalAmount: 320,
      currency: "SGD",
      bookingReference: "SCT-998877",
      provider: "Singapore Tours",
      travelers: 2,
      details: {
        tourType: "Full Day City Highlights",
        meetingPoint: "Marina Bay Sands Lobby",
        inclusions: ["Transportation", "Guide", "Lunch", "Entry Fees"],
        duration: "8 hours"
      },
      paymentStatus: "pending",
      cancellationPolicy: "Free cancellation up to 24 hours before tour",
      contactInfo: {
        phone: "+65 6337 2349",
        email: "bookings@singaporetours.com"
      }
    }
  ];

  useEffect(() => {
    setBookings(sampleBookings);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'hotel': return <Bed className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'activity': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesType = activeFilter === 'all' || booking.type === activeFilter;
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => b.dates.start > new Date()).length;
  const totalSpent = bookings.reduce((sum, booking) => {
    // Convert all to USD for simplicity (in real app, use proper conversion)
    const usdAmount = booking.currency === 'SGD' ? booking.totalAmount * 0.75 : booking.totalAmount;
    return sum + usdAmount;
  }, 0);

  const showBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Booking Manager - TrvBUD V2</title>
        <meta name="description" content="Manage all your travel bookings in one place with comprehensive tracking and organization." />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Booking Manager
        </h1>
        <p className="text-neutral-500">Organize and track all your travel bookings in one place</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Bookings</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingBookings}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(0)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">This Month</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => 
                    b.dates.start.getMonth() === new Date().getMonth() &&
                    b.dates.start.getFullYear() === new Date().getFullYear()
                  ).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="flight">Flights</SelectItem>
                  <SelectItem value="hotel">Hotels</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="activity">Activities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    {getTypeIcon(booking.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{booking.title}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.destination}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {booking.dates.start.toLocaleDateString()}
                        {booking.dates.end && ` - ${booking.dates.end.toLocaleDateString()}`}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {booking.travelers} travelers
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-sm text-neutral-500">Booking Reference</p>
                        <p className="font-medium">{booking.bookingReference}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Total Amount</p>
                        <p className="text-lg font-semibold">
                          {booking.currency} {booking.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => showBookingDetails(booking)}
                  >
                    View Details
                  </Button>
                  {booking.documents && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No bookings found</h3>
              <p className="text-neutral-500">Try adjusting your search criteria or create a new booking.</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Booking
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {getTypeIcon(selectedBooking.type)}
                  <span className="ml-2">{selectedBooking.title}</span>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Booking Reference</p>
                    <p className="font-medium">{selectedBooking.bookingReference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Provider</p>
                    <p className="font-medium">{selectedBooking.provider}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Status</p>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Payment Status</p>
                    <Badge className={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Booking Details</p>
                  <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
                    {Object.entries(selectedBooking.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-medium">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedBooking.contactInfo && (
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Contact Information</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{selectedBooking.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">{selectedBooking.contactInfo.email}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedBooking.cancellationPolicy && (
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Cancellation Policy</p>
                    <p className="text-sm text-neutral-600">{selectedBooking.cancellationPolicy}</p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Provider
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modify Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingManager;