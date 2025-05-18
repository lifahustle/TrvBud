import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar, User, Plane, DollarSign, MoveVertical, Hotel, Utensils, MapPin, Plus } from "lucide-react";
import { useState } from "react";

const ItineraryBuilder = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  
  const { data: itineraryDays } = useQuery({
    queryKey: ['/api/itinerary-template']
  });

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-bold font-poppins mb-4">Build Your Perfect Itinerary</h2>
          <p className="text-neutral-400 mb-6">Plan your ideal South Asian adventure with our interactive itinerary builder. Drag and drop destinations, accommodations, and activities to create your perfect journey.</p>
          
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h3 className="font-semibold mb-2">Your Trip Summary</h3>
            <div className="flex items-center mb-3">
              <Calendar className="text-primary mr-2 h-5 w-5" />
              <span>Feb 6 - Feb 13, 2025 (7 nights)</span>
            </div>
            <div className="flex items-center mb-3">
              <User className="text-primary mr-2 h-5 w-5" />
              <span>2 Travelers</span>
            </div>
            <div className="flex items-center mb-3">
              <Plane className="text-primary mr-2 h-5 w-5" />
              <span>3 Destinations</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="text-primary mr-2 h-5 w-5" />
              <span>Estimated Budget: $2,450</span>
            </div>
          </div>
          
          <Button className="w-full mb-4">Save Itinerary</Button>
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">Share with Friends</Button>
        </div>
        
        <div className="md:w-2/3 bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex items-center mb-6">
            <h3 className="font-semibold">Your 7-Day Itinerary</h3>
            <div className="ml-auto flex space-x-2">
              <Button variant="outline" size="sm" className="p-2 h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className={`border rounded-lg p-4 ${selectedDay === 1 ? 'bg-primary/5 border-primary/20' : 'border-neutral-100'}`}>
              <div className="flex items-center">
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  selectedDay === 1 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'
                }`}>
                  Day 1
                </span>
                <span className="ml-3 font-medium">Feb 6, 2025</span>
                <button className="ml-auto text-neutral-400" onClick={() => setSelectedDay(1)}>
                  <MoveVertical className="h-5 w-5" />
                </button>
              </div>
              {selectedDay === 1 && (
                <div className="mt-3">
                  <div className="flex items-start mb-3">
                    <Plane className="text-secondary mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Arrive in Bangkok</p>
                      <p className="text-sm text-neutral-400">Thai Airways Flight TG315 arrives at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-3">
                    <Hotel className="text-secondary mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Check-in: Four Seasons Bangkok</p>
                      <p className="text-sm text-neutral-400">Riverside Suite</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Utensils className="text-secondary mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Dinner cruise on the Chao Phraya River</p>
                      <p className="text-sm text-neutral-400">Traditional Thai cuisine with city lights view</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`border rounded-lg p-4 ${selectedDay === 2 ? 'bg-primary/5 border-primary/20' : 'border-neutral-100'}`}>
              <div className="flex items-center">
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  selectedDay === 2 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'
                }`}>
                  Day 2
                </span>
                <span className="ml-3 font-medium">Feb 7, 2025</span>
                <button className="ml-auto text-neutral-400" onClick={() => setSelectedDay(2)}>
                  <MoveVertical className="h-5 w-5" />
                </button>
              </div>
              {selectedDay === 2 && (
                <div className="mt-3">
                  <div className="flex items-start mb-3">
                    <MapPin className="text-secondary mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Bangkok Temple Tour</p>
                      <p className="text-sm text-neutral-400">Grand Palace, Wat Pho, Wat Arun</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-secondary mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Evening at Chatuchak Market</p>
                      <p className="text-sm text-neutral-400">Local shopping and street food experience</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`border rounded-lg p-4 ${selectedDay === 3 ? 'bg-primary/5 border-primary/20' : 'border-neutral-100'}`}>
              <div className="flex items-center">
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  selectedDay === 3 ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'
                }`}>
                  Day 3
                </span>
                <span className="ml-3 font-medium">Feb 8, 2025</span>
                <button className="ml-auto text-neutral-400" onClick={() => setSelectedDay(3)}>
                  <MoveVertical className="h-5 w-5" />
                </button>
              </div>
              {selectedDay === 3 && (
                <div className="mt-3">
                  <div className="flex items-start mb-3">
                    <Plane className="text-secondary mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Fly to Siem Reap</p>
                      <p className="text-sm text-neutral-400">Bangkok Airways PG903 departs at 9:45 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Hotel className="text-secondary mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Check-in: Angkor Heritage Lodge</p>
                      <p className="text-sm text-neutral-400">Deluxe Room with Temple View</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button className="text-neutral-400 hover:text-primary text-sm flex items-center justify-center w-full py-2 border border-dashed border-neutral-200 rounded-lg mt-4">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add more days</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryBuilder;
