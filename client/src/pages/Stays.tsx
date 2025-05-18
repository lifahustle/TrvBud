import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, StarIcon, Filter, WifiIcon, Coffee, Utensils, MapPin } from "lucide-react";
import { Accommodation } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Stays = () => {
  const [location, setLocation] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<string>("2");
  
  const { data: accommodations, isLoading } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations']
  });

  const filteredAccommodations = accommodations?.filter(accommodation => {
    if (location && !accommodation.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Accommodations - South Asia Explorer</title>
        <meta name="description" content="Find and book hotels, resorts, and villas in beautiful South Asian destinations." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Stay</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Destination</label>
              <Input 
                placeholder="City, region, or property name" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Check-in</label>
              <DatePicker date={checkIn} onDateChange={setCheckIn} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Check-out</label>
              <DatePicker date={checkOut} onDateChange={setCheckOut} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Guests</label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                  <SelectItem value="5">5+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button className="w-full md:w-auto">
              Search Accommodations
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Accommodations</h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAccommodations && filteredAccommodations.length > 0 ? (
          filteredAccommodations.map((accommodation) => (
            <Card key={accommodation.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 md:h-auto relative">
                    <img 
                      src={accommodation.images[0]} 
                      alt={accommodation.name} 
                      className="w-full h-full object-cover"
                    />
                    {accommodation.discountPercentage > 0 && (
                      <div className="absolute top-4 left-4 bg-error text-white px-2 py-1 rounded-md text-sm font-semibold">
                        {accommodation.discountPercentage}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon 
                              key={index} 
                              className={`h-4 w-4 ${index < accommodation.stars ? 'text-accent fill-accent' : 'text-neutral-200'}`} 
                            />
                          ))}
                          <span className="text-neutral-400 text-sm ml-2">({accommodation.reviewCount} reviews)</span>
                        </div>
                        
                        <h3 className="text-xl font-semibold">{accommodation.name}</h3>
                        <div className="flex items-center text-neutral-400 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{accommodation.location}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${accommodation.pricePerNight}</div>
                        <div className="text-neutral-400 text-sm">per night</div>
                      </div>
                    </div>
                    
                    <p className="text-neutral-400 text-sm my-4">{accommodation.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {accommodation.amenities.map((amenity, index) => (
                        <span key={index} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-neutral-400 text-sm mb-4">
                      {accommodation.hasFreeWifi && (
                        <div className="flex items-center">
                          <WifiIcon className="h-4 w-4 mr-1" />
                          <span>Free WiFi</span>
                        </div>
                      )}
                      {accommodation.hasBreakfast && (
                        <div className="flex items-center">
                          <Coffee className="h-4 w-4 mr-1" />
                          <span>Breakfast included</span>
                        </div>
                      )}
                      {accommodation.hasRestaurant && (
                        <div className="flex items-center">
                          <Utensils className="h-4 w-4 mr-1" />
                          <span>Restaurant</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-lg text-neutral-400">No accommodations found matching your criteria.</div>
              <div className="mt-2">Try adjusting your search parameters.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Stays;
