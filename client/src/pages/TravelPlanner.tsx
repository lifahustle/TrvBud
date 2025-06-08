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
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Route,
  Plus,
  Trash2,
  Star,
  Camera,
  Utensils,
  Bed,
  Car,
  Plane,
  Map,
  CheckCircle2,
  Edit3,
  Share2,
  Loader2,
  Hotel,
  ChevronDown,
  ChevronUp,
  PlaneTakeoff,
  PlusCircle
} from "lucide-react";
import { Booking } from "@shared/schema";
import { format } from "date-fns";

interface TravelDay {
  id: string;
  date: Date;
  activities: Activity[];
  accommodation?: {
    name: string;
    location: string;
    checkIn: string;
    checkOut: string;
  };
}

interface Activity {
  id: string;
  name: string;
  type: 'sightseeing' | 'dining' | 'shopping' | 'transport' | 'accommodation' | 'entertainment' | 'cultural' | 'adventure';
  location: string;
  time: string;
  duration?: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  price?: number;
  completed?: boolean;
}

interface TripPlan {
  destination: string;
  startDate?: Date;
  endDate?: Date;
  travelers: number;
  budget?: number;
  days: TravelDay[];
  notes?: string;
}

const MyTrips = () => {
  const [expandedTrip, setExpandedTrip] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("existing");
  
  // Trip Planning State
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    destination: '',
    travelers: 1,
    days: []
  });
  const [currentEditDay, setCurrentEditDay] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: '',
    type: 'sightseeing',
    location: '',
    time: '',
    duration: '',
    priority: 'medium',
    notes: ''
  });

  // Fetch existing bookings
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings']
  });

  const upcomingTrips = bookings?.filter(booking => new Date(booking.startDate) > new Date()) || [];
  const pastTrips = bookings?.filter(booking => new Date(booking.endDate) < new Date()) || [];
  
  const toggleExpandTrip = (id: number) => {
    setExpandedTrip(expandedTrip === id ? null : id);
  };

  const activityTypes = [
    { value: 'sightseeing', label: 'Sightseeing', icon: Camera },
    { value: 'dining', label: 'Dining', icon: Utensils },
    { value: 'shopping', label: 'Shopping', icon: Star },
    { value: 'transport', label: 'Transport', icon: Car },
    { value: 'accommodation', label: 'Accommodation', icon: Bed },
    { value: 'entertainment', label: 'Entertainment', icon: Star },
    { value: 'cultural', label: 'Cultural', icon: Map },
    { value: 'adventure', label: 'Adventure', icon: Route },
  ];

  const generateDays = () => {
    if (!tripPlan.startDate || !tripPlan.endDate) return;
    
    const start = new Date(tripPlan.startDate);
    const end = new Date(tripPlan.endDate);
    const days: TravelDay[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        id: `day-${days.length + 1}`,
        date: new Date(d),
        activities: []
      });
    }
    
    setTripPlan(prev => ({ ...prev, days }));
  };

  const addActivity = (dayId: string) => {
    if (!newActivity.name || !newActivity.location) return;
    
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      name: newActivity.name,
      type: newActivity.type as Activity['type'],
      location: newActivity.location,
      time: newActivity.time || '',
      duration: newActivity.duration,
      priority: newActivity.priority as Activity['priority'],
      notes: newActivity.notes,
      price: newActivity.price,
      completed: false
    };
    
    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map(day => 
        day.id === dayId 
          ? { ...day, activities: [...day.activities, activity] }
          : day
      )
    }));
    
    setNewActivity({
      name: '',
      type: 'sightseeing',
      location: '',
      time: '',
      duration: '',
      priority: 'medium',
      notes: ''
    });
    setCurrentEditDay(null);
  };

  const removeActivity = (dayId: string, activityId: string) => {
    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map(day => 
        day.id === dayId 
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      )
    }));
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.value === type);
    return activityType?.icon || Camera;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>My Trips - Southeast Asia Explorer</title>
        <meta name="description" content="Plan new trips and manage your existing travel bookings across Southeast Asia destinations." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button onClick={() => setActiveTab("planner")}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Plan New Trip
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="existing" className="flex-1 md:flex-initial">My Bookings</TabsTrigger>
          <TabsTrigger value="planner" className="flex-1 md:flex-initial">Trip Planner</TabsTrigger>
        </TabsList>
        
        {/* Existing Trips */}
        <TabsContent value="existing">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : upcomingTrips.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTrips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{trip.name}</CardTitle>
                            <div className="flex items-center text-neutral-600 mt-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center text-neutral-600 mt-1">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{trip.destination}</span>
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
                            {trip.itinerary?.map((day: any, index: number) => (
                              <div key={index} className="border border-neutral-100 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <span className="text-sm font-semibold bg-primary text-white px-2 py-1 rounded-full">
                                      Day {index + 1}
                                    </span>
                                    <span className="ml-3 font-medium">
                                      {format(new Date(day.date), 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {day.activities?.map((activity: any, actIndex: number) => (
                                    <div key={actIndex} className="flex items-center text-sm text-neutral-600">
                                      <Clock className="w-3 h-3 mr-2" />
                                      <span className="font-medium mr-2">{activity.time}</span>
                                      <span>{activity.name}</span>
                                      {activity.location && (
                                        <span className="text-neutral-500 ml-2">at {activity.location}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <PlaneTakeoff className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h3 className="text-lg font-medium mb-2">No upcoming trips</h3>
                    <p className="text-neutral-600 mb-4">Start planning your next Southeast Asian adventure!</p>
                    <Button onClick={() => setActiveTab("planner")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Plan Your First Trip
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {pastTrips.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
                <div className="space-y-4">
                  {pastTrips.map((trip) => (
                    <Card key={trip.id} className="opacity-75">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{trip.name}</CardTitle>
                            <div className="flex items-center text-neutral-600 mt-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Trip Planner */}
        <TabsContent value="planner">
          <div className="space-y-6">
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Plan your perfect Southeast Asian adventure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination</label>
                    <Input
                      placeholder="Bangkok, Thailand"
                      value={tripPlan.destination}
                      onChange={(e) => setTripPlan(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Travelers</label>
                    <Select 
                      value={tripPlan.travelers.toString()} 
                      onValueChange={(value) => setTripPlan(prev => ({ ...prev, travelers: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Traveler' : 'Travelers'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <DatePicker
                      selected={tripPlan.startDate}
                      onSelect={(date) => setTripPlan(prev => ({ ...prev, startDate: date }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <DatePicker
                      selected={tripPlan.endDate}
                      onSelect={(date) => setTripPlan(prev => ({ ...prev, endDate: date }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget (USD)</label>
                    <Input
                      type="number"
                      placeholder="1500"
                      value={tripPlan.budget || ''}
                      onChange={(e) => setTripPlan(prev => ({ ...prev, budget: parseInt(e.target.value) || undefined }))}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Button onClick={generateDays} disabled={!tripPlan.startDate || !tripPlan.endDate}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Generate Itinerary Days
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Trip Notes</label>
                  <Textarea
                    placeholder="Special preferences, dietary restrictions, mobility needs..."
                    value={tripPlan.notes || ''}
                    onChange={(e) => setTripPlan(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Daily Itinerary */}
            {tripPlan.days.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Daily Itinerary</h2>
                {tripPlan.days.map((day, index) => (
                  <Card key={day.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">
                            Day {index + 1} - {format(day.date, 'EEEE, MMM d, yyyy')}
                          </CardTitle>
                          <CardDescription>
                            {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'} planned
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentEditDay(currentEditDay === day.id ? null : day.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {day.activities.map((activity) => {
                          const ActivityIcon = getActivityIcon(activity.type);
                          return (
                            <div key={activity.id} className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg">
                              <div className="flex items-start space-x-3">
                                <ActivityIcon className="w-5 h-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{activity.name}</h4>
                                    <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                                      {activity.priority}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center text-sm text-neutral-600 mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span>{activity.location}</span>
                                    {activity.time && (
                                      <>
                                        <Clock className="w-3 h-3 ml-3 mr-1" />
                                        <span>{activity.time}</span>
                                      </>
                                    )}
                                    {activity.duration && (
                                      <span className="ml-2">({activity.duration})</span>
                                    )}
                                    {activity.price && (
                                      <span className="font-medium text-primary ml-2">
                                        ${activity.price}
                                      </span>
                                    )}
                                  </div>
                                  {activity.notes && (
                                    <p className="text-sm text-neutral-600 mt-1">{activity.notes}</p>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeActivity(day.id, activity.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          );
                        })}
                        
                        {day.activities.length === 0 && (
                          <div className="text-center py-8 text-neutral-500">
                            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p>No activities planned for this day</p>
                            <p className="text-sm">Click "Add Activity" to get started</p>
                          </div>
                        )}
                      </div>

                      {/* Add Activity Form */}
                      {currentEditDay === day.id && (
                        <div className="mt-6 p-4 bg-white border rounded-lg">
                          <h4 className="font-medium mb-4">Add New Activity</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Activity Name</label>
                              <Input
                                placeholder="Visit Temple, Lunch at..."
                                value={newActivity.name}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Type</label>
                              <Select 
                                value={newActivity.type} 
                                onValueChange={(value) => setNewActivity(prev => ({ ...prev, type: value as Activity['type'] }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {activityTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Location</label>
                              <Input
                                placeholder="Grand Palace, Chatuchak Market..."
                                value={newActivity.location}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Time</label>
                              <Input
                                type="time"
                                value={newActivity.time}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Duration</label>
                              <Input
                                placeholder="2 hours, Half day..."
                                value={newActivity.duration}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, duration: e.target.value }))}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Priority</label>
                              <Select 
                                value={newActivity.priority} 
                                onValueChange={(value) => setNewActivity(prev => ({ ...prev, priority: value as Activity['priority'] }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High Priority</SelectItem>
                                  <SelectItem value="medium">Medium Priority</SelectItem>
                                  <SelectItem value="low">Low Priority</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Estimated Cost (USD)</label>
                              <Input
                                type="number"
                                placeholder="25"
                                value={newActivity.price || ''}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, price: parseInt(e.target.value) || undefined }))}
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Notes</label>
                              <Textarea
                                placeholder="Additional details, booking info, tips..."
                                value={newActivity.notes}
                                onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                              />
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              onClick={() => addActivity(day.id)}
                              disabled={!newActivity.name || !newActivity.location}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Activity
                            </Button>
                            <Button variant="outline" onClick={() => setCurrentEditDay(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTrips;