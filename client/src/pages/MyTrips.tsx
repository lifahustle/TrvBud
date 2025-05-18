import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  Plane, 
  Hotel, 
  Car,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Booking } from "@shared/schema";
import { format } from "date-fns";

const MyTrips = () => {
  const [expandedTrip, setExpandedTrip] = useState<number | null>(null);
  
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings']
  });

  const upcomingTrips = bookings?.filter(booking => new Date(booking.startDate) > new Date()) || [];
  const pastTrips = bookings?.filter(booking => new Date(booking.endDate) < new Date()) || [];
  
  const toggleExpandTrip = (id: number) => {
    if (expandedTrip === id) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>My Trips - South Asia Explorer</title>
        <meta name="description" content="Manage your upcoming and past trips across South Asia destinations." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button>Plan New Trip</Button>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : upcomingTrips.length > 0 ? (
            <div className="space-y-6">
              {upcomingTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{trip.name}</CardTitle>
                        <div className="flex items-center text-neutral-400 mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => toggleExpandTrip(trip.id)}>
                        {expandedTrip === trip.id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedTrip === trip.id && (
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {trip.itinerary.map((day, index) => (
                          <div key={index} className="border border-neutral-100 rounded-lg p-4">
                            <div className="flex items-center">
                              <span className="text-sm font-semibold bg-primary text-white px-2 py-1 rounded-full">Day {index + 1}</span>
                              <span className="ml-3 font-medium">{format(new Date(day.date), 'MMM d, yyyy')}</span>
                            </div>
                            
                            <div className="mt-3 space-y-3">
                              {day.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex items-start">
                                  {activity.type === 'flight' && <Plane className="text-secondary h-5 w-5 mr-2" />}
                                  {activity.type === 'accommodation' && <Hotel className="text-secondary h-5 w-5 mr-2" />}
                                  {activity.type === 'transport' && <Car className="text-secondary h-5 w-5 mr-2" />}
                                  {activity.type === 'activity' && <MapPin className="text-secondary h-5 w-5 mr-2" />}
                                  
                                  <div>
                                    <p className="font-medium">{activity.title}</p>
                                    <p className="text-sm text-neutral-400">{activity.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                  
                  <CardFooter className="flex justify-between bg-white border-t p-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-neutral-400 mr-1" />
                      <span className="text-neutral-400 text-sm">{trip.destinations.join(', ')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Modify</Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mb-4">
                  <Calendar className="h-12 w-12 text-neutral-300 mx-auto" />
                </div>
                <div className="text-lg font-medium">No upcoming trips</div>
                <div className="text-neutral-400 mt-2">Your future adventures will appear here.</div>
                <Button className="mt-6">Plan Your First Trip</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pastTrips.length > 0 ? (
            <div className="space-y-6">
              {pastTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                  <CardHeader className="bg-neutral-100 pb-4">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{trip.name}</CardTitle>
                        <div className="flex items-center text-neutral-400 mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => toggleExpandTrip(trip.id)}>
                        {expandedTrip === trip.id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedTrip === trip.id && (
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {trip.itinerary.map((day, index) => (
                          <div key={index} className="border border-neutral-100 rounded-lg p-4">
                            <div className="flex items-center">
                              <span className="text-sm font-semibold bg-neutral-200 text-neutral-500 px-2 py-1 rounded-full">Day {index + 1}</span>
                              <span className="ml-3 font-medium">{format(new Date(day.date), 'MMM d, yyyy')}</span>
                            </div>
                            
                            <div className="mt-3 space-y-3">
                              {day.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex items-start">
                                  {activity.type === 'flight' && <Plane className="text-neutral-400 h-5 w-5 mr-2" />}
                                  {activity.type === 'accommodation' && <Hotel className="text-neutral-400 h-5 w-5 mr-2" />}
                                  {activity.type === 'transport' && <Car className="text-neutral-400 h-5 w-5 mr-2" />}
                                  {activity.type === 'activity' && <MapPin className="text-neutral-400 h-5 w-5 mr-2" />}
                                  
                                  <div>
                                    <p className="font-medium">{activity.title}</p>
                                    <p className="text-sm text-neutral-400">{activity.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                  
                  <CardFooter className="flex justify-between bg-white border-t p-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-neutral-400 mr-1" />
                      <span className="text-neutral-400 text-sm">{trip.destinations.join(', ')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Book Again</Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mb-4">
                  <Calendar className="h-12 w-12 text-neutral-300 mx-auto" />
                </div>
                <div className="text-lg font-medium">No past trips</div>
                <div className="text-neutral-400 mt-2">Your travel history will appear here.</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTrips;
