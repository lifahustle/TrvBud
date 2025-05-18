import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plane, 
  Hotel, 
  Car, 
  User, 
  Star, 
  Search,
  PlaneTakeoff,
  PlaneLanding,
  Calendar
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

const SearchSection = () => {
  const [searchType, setSearchType] = useState<'flights' | 'stays' | 'transport'>('flights');
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  
  return (
    <div id="search-section" className="bg-white shadow-md rounded-lg -mt-16 mx-4 lg:mx-auto max-w-6xl relative z-10">
      <div className="p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <div className="flex items-center space-x-4">
              <Button 
                type="button" 
                variant={searchType === 'flights' ? 'default' : 'ghost'}
                className={`flex items-center rounded-full ${searchType === 'flights' ? '' : 'text-neutral-400 hover:text-primary'}`}
                onClick={() => setSearchType('flights')}
              >
                <Plane className="mr-2 h-4 w-4" />
                <span className="font-medium">Flights</span>
              </Button>
              <Button 
                type="button" 
                variant={searchType === 'stays' ? 'default' : 'ghost'}
                className={`flex items-center rounded-full ${searchType === 'stays' ? '' : 'text-neutral-400 hover:text-primary'}`}
                onClick={() => setSearchType('stays')}
              >
                <Hotel className="mr-2 h-4 w-4" />
                <span className="font-medium">Stays</span>
              </Button>
              <Button 
                type="button" 
                variant={searchType === 'transport' ? 'default' : 'ghost'}
                className={`flex items-center rounded-full ${searchType === 'transport' ? '' : 'text-neutral-400 hover:text-primary'}`}
                onClick={() => setSearchType('transport')}
              >
                <Car className="mr-2 h-4 w-4" />
                <span className="font-medium">Transport</span>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                className="border border-neutral-200 rounded-full px-4 py-2 text-sm font-medium flex items-center space-x-2 hover:border-primary"
              >
                <User className="h-4 w-4" />
                <span>2 Adults</span>
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="border border-neutral-200 rounded-full px-4 py-2 text-sm font-medium flex items-center space-x-2 hover:border-primary"
              >
                <Star className="h-4 w-4" />
                <span>Economy</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
          <div className="md:col-span-4">
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-400 mb-1">From</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <PlaneTakeoff className="h-4 w-4 text-neutral-300" />
                </span>
                <Input 
                  type="text" 
                  placeholder="City or Airport" 
                  value={origin} 
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-400 mb-1">To</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <PlaneLanding className="h-4 w-4 text-neutral-300" />
                </span>
                <Input 
                  type="text" 
                  placeholder="City or Airport" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-400 mb-1">Travel Dates</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-neutral-300" />
                </span>
                <DatePicker
                  date={departDate}
                  onDateChange={setDepartDate}
                  placeholder="Select dates"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="h-full flex items-end">
              <Button type="button" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
