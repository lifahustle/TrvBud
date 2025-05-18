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
import { 
  Car, 
  Loader2, 
  Filter, 
  AirVent, 
  Users, 
  MapPin,
  Wifi
} from "lucide-react";
import { Transport } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransportPage = () => {
  const [location, setLocation] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [vehicleType, setVehicleType] = useState<string>("all");
  
  const { data: transportOptions, isLoading } = useQuery<Transport[]>({
    queryKey: ['/api/transport']
  });

  const filteredTransport = transportOptions?.filter(option => {
    if (location && !option.pickupLocations.some(loc => loc.toLowerCase().includes(location.toLowerCase()))) return false;
    if (vehicleType !== "all" && option.type !== vehicleType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Transportation - South Asia Explorer</title>
        <meta name="description" content="Book cars, vans, motorcycles, and other transportation options for your South Asia trip." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">Find Transportation</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Pickup Location</label>
              <Input 
                placeholder="City or specific location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Pickup Date</label>
              <DatePicker date={pickupDate} onDateChange={setPickupDate} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Return Date</label>
              <DatePicker date={returnDate} onDateChange={setReturnDate} />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Vehicle Type</label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="tuk-tuk">Tuk-Tuk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button className="w-full md:w-auto">
              Search Vehicles
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Vehicles</h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTransport && filteredTransport.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransport.map((transport) => (
              <Card key={transport.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 relative">
                  <img 
                    src={transport.image} 
                    alt={transport.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-lg text-neutral-400">No vehicles found matching your criteria.</div>
              <div className="mt-2">Try adjusting your search parameters.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransportPage;
