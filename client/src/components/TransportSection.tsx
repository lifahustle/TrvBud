import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, AirVent, Users, MapPin, Wifi, Car, PercentCircle, Star } from "lucide-react";
import { Transport } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const TransportSection = () => {
  const { data: transports, isLoading } = useQuery<Transport[]>({
    queryKey: ['/api/transport']
  });

  // Premium vehicles with special discounts in East Asia
  const premiumVehicles = [
    {
      id: 1,
      name: "Lexus ES Luxury Sedan",
      type: "car",
      location: "Tokyo, Japan",
      description: "Premium luxury sedan with leather seats, GPS navigation in English, and complimentary airport pickup",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      originalPrice: 120,
      discountPrice: 90,
      discountPercent: 25,
      rating: 4.9,
      reviewCount: 164,
      seats: 4,
      hasAC: true,
      hasGPS: true,
      hasWifi: true
    },
    {
      id: 2,
      name: "Mercedes-Benz V-Class",
      type: "van",
      location: "Seoul, South Korea",
      description: "Spacious luxury van ideal for groups or families with premium amenities and professional driver option",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      originalPrice: 180,
      discountPrice: 144,
      discountPercent: 20,
      rating: 4.8,
      reviewCount: 122,
      seats: 7,
      hasAC: true,
      hasGPS: true,
      hasWifi: true
    }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Premium Vehicle Rentals in East Asia</h2>
          <Link href="/transport" className="text-primary flex items-center hover:underline">
            <span>View all premium vehicles</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {premiumVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row">
              <div className="sm:w-2/5 h-48 sm:h-auto relative">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 bg-error text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <PercentCircle className="h-4 w-4 mr-1" />
                  <span>{vehicle.discountPercent}% OFF</span>
                </div>
              </div>
              <div className="sm:w-3/5 p-5">
                <div className="flex items-center mb-2">
                  <div className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium flex items-center mr-2">
                    <Car className="h-3 w-3 mr-1" />
                    <span>Premium {vehicle.type === 'van' ? 'Van' : 'Sedan'}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-neutral-700 text-sm ml-1">{vehicle.rating}</span>
                    <span className="text-neutral-400 text-sm ml-1">({vehicle.reviewCount})</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg">{vehicle.name}</h3>
                <p className="text-neutral-500 text-sm mb-2">{vehicle.location}</p>
                <p className="text-sm text-neutral-600 mb-3">{vehicle.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="flex items-center text-xs bg-primary/5">
                    <Users className="h-3 w-3 mr-1" /> {vehicle.seats} Seats
                  </Badge>
                  
                  {vehicle.hasAC && (
                    <Badge variant="outline" className="flex items-center text-xs bg-primary/5">
                      <AirVent className="h-3 w-3 mr-1" /> Premium A/C
                    </Badge>
                  )}
                  
                  {vehicle.hasGPS && (
                    <Badge variant="outline" className="flex items-center text-xs bg-primary/5">
                      <MapPin className="h-3 w-3 mr-1" /> GPS Navigation
                    </Badge>
                  )}
                  
                  {vehicle.hasWifi && (
                    <Badge variant="outline" className="flex items-center text-xs bg-primary/5">
                      <Wifi className="h-3 w-3 mr-1" /> WiFi Hotspot
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline">
                    <span className="text-neutral-400 line-through mr-2">${vehicle.originalPrice}</span>
                    <span className="text-xl font-bold text-primary">${vehicle.discountPrice}</span>
                    <span className="text-neutral-500 text-sm ml-1">/day</span>
                  </div>
                  <Link href="/transport">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <h3 className="text-xl font-semibold mb-6">Other Transportation Options</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transports && transports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transports.slice(0, 4).map((transport) => (
              <div key={transport.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-40 relative">
                  <img 
                    src={transport.image} 
                    alt={transport.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{transport.name}</h3>
                  <p className="text-neutral-400 text-sm mb-3">{transport.description}</p>
                  <div className="flex items-center mb-3">
                    {transport.hasAC && (
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full mr-2 flex items-center">
                        <AirVent className="h-3 w-3 mr-1" /> A/C
                      </span>
                    )}
                    <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full mr-2 flex items-center">
                      <Users className="h-3 w-3 mr-1" /> {transport.seats} Seats
                    </span>
                    {transport.hasGPS && (
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> GPS
                      </span>
                    )}
                    {transport.hasWifi && (
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full ml-2 flex items-center">
                        <Wifi className="h-3 w-3 mr-1" /> WiFi
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-primary font-bold">${transport.pricePerDay} <span className="text-neutral-400 text-sm font-normal">/day</span></div>
                    <Button variant="secondary" size="sm">Book Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-400">No additional transportation options available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransportSection;
