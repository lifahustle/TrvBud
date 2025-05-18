import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Flight, FlightClass } from "@shared/schema";
import { Plane, Loader2, Filter } from "lucide-react";

const Flights = () => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState<string>("2");
  const [flightClass, setFlightClass] = useState<FlightClass>(FlightClass.ECONOMY);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);
  
  const { data: flights, isLoading } = useQuery<Flight[]>({
    queryKey: ['/api/flights']
  });

  const filteredFlights = flights?.filter(flight => {
    if (origin && flight.origin.toLowerCase() !== origin.toLowerCase()) return false;
    if (destination && flight.destination.toLowerCase() !== destination.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Flights - South Asia Explorer</title>
        <meta name="description" content="Find and book flights to South Asian destinations including Thailand, Vietnam, Cambodia, and more." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">Find Your Flight</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-12 flex flex-wrap gap-4 mb-4">
              <Button 
                variant={isRoundTrip ? "default" : "outline"} 
                onClick={() => setIsRoundTrip(true)}
                className="rounded-full"
              >
                Round Trip
              </Button>
              <Button 
                variant={!isRoundTrip ? "default" : "outline"} 
                onClick={() => setIsRoundTrip(false)}
                className="rounded-full"
              >
                One Way
              </Button>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-neutral-400 mb-1">From</label>
              <Input 
                placeholder="City or Airport" 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)} 
              />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-neutral-400 mb-1">To</label>
              <Input 
                placeholder="City or Airport" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Depart</label>
              <DatePicker date={departDate} onDateChange={setDepartDate} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Return</label>
              <DatePicker 
                date={returnDate} 
                onDateChange={setReturnDate} 
                disabled={!isRoundTrip}
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Travelers</label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Travelers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">4 Adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Class</label>
              <Select 
                value={flightClass} 
                onValueChange={(value) => setFlightClass(value as FlightClass)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FlightClass.ECONOMY}>Economy</SelectItem>
                  <SelectItem value={FlightClass.PREMIUM_ECONOMY}>Premium Economy</SelectItem>
                  <SelectItem value={FlightClass.BUSINESS}>Business</SelectItem>
                  <SelectItem value={FlightClass.FIRST}>First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button className="w-full md:w-auto">
              Search Flights
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Flights</h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredFlights && filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-4 md:mb-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <Plane className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div>
                      <div className="text-xl font-semibold">
                        {flight.departureTime} - {flight.arrivalTime}
                      </div>
                      <div className="text-neutral-400">
                        {flight.airline} · {flight.flightNumber}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold">{flight.duration}</div>
                      <div className="text-neutral-400 text-sm">
                        {flight.origin} to {flight.destination}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
                      {flight.stops > 0 && <div className="text-neutral-400 text-sm">{flight.stopLocations.join(', ')}</div>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold text-primary">${flight.price}</div>
                    <div className="text-neutral-400 text-sm">per person</div>
                    <Button className="mt-2">Select</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-lg text-neutral-400">No flights found matching your criteria.</div>
              <div className="mt-2">Try adjusting your search parameters.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Flights;
