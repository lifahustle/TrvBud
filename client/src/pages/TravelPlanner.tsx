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
  Share2
} from "lucide-react";

interface TravelDay {
  id: string;
  date: Date;
  activities: Activity[];
  accommodation?: {
    name: string;
    location: string;
    checkIn: string;
    checkOut: string;
    price: number;
  };
  transport?: {
    type: string;
    from: string;
    to: string;
    time: string;
    price: number;
  };
}

interface Activity {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'shopping' | 'cultural' | 'adventure' | 'relaxation';
  location: string;
  time: string;
  duration: string;
  price?: number;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

const TravelPlanner = () => {
  const [tripName, setTripName] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState<number>(2);
  const [budget, setBudget] = useState<string>("");
  const [travelDays, setTravelDays] = useState<TravelDay[]>([]);
  const [currentEditDay, setCurrentEditDay] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: "",
    type: "attraction",
    location: "",
    time: "",
    duration: "",
    priority: "medium"
  });

  // Southeast Asian destinations
  const destinations = [
    { code: "BKK", name: "Bangkok, Thailand", country: "Thailand" },
    { code: "SGN", name: "Ho Chi Minh City, Vietnam", country: "Vietnam" },
    { code: "KUL", name: "Kuala Lumpur, Malaysia", country: "Malaysia" },
    { code: "SIN", name: "Singapore", country: "Singapore" },
    { code: "DPS", name: "Bali, Indonesia", country: "Indonesia" },
    { code: "MNL", name: "Manila, Philippines", country: "Philippines" },
    { code: "PNH", name: "Phnom Penh, Cambodia", country: "Cambodia" },
    { code: "VTE", name: "Vientiane, Laos", country: "Laos" },
    { code: "RGN", name: "Yangon, Myanmar", country: "Myanmar" },
    { code: "BWN", name: "Bandar Seri Begawan, Brunei", country: "Brunei" }
  ];

  const activityTypes = [
    { value: "attraction", label: "Attraction", icon: MapPin },
    { value: "restaurant", label: "Restaurant", icon: Utensils },
    { value: "shopping", label: "Shopping", icon: Star },
    { value: "cultural", label: "Cultural", icon: Camera },
    { value: "adventure", label: "Adventure", icon: Route },
    { value: "relaxation", label: "Relaxation", icon: Bed }
  ];

  // Generate travel days when dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      const days: TravelDay[] = [];
      const current = new Date(startDate);
      let dayId = 1;
      
      while (current <= endDate) {
        days.push({
          id: `day-${dayId}`,
          date: new Date(current),
          activities: []
        });
        current.setDate(current.getDate() + 1);
        dayId++;
      }
      setTravelDays(days);
    }
  }, [startDate, endDate]);

  const addActivity = (dayId: string) => {
    if (!newActivity.name || !newActivity.location) return;
    
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      name: newActivity.name || "",
      type: newActivity.type as Activity['type'] || "attraction",
      location: newActivity.location || "",
      time: newActivity.time || "",
      duration: newActivity.duration || "",
      priority: newActivity.priority as Activity['priority'] || "medium",
      notes: newActivity.notes
    };

    setTravelDays(prev => prev.map(day => 
      day.id === dayId 
        ? { ...day, activities: [...day.activities, activity] }
        : day
    ));

    // Reset form
    setNewActivity({
      name: "",
      type: "attraction",
      location: "",
      time: "",
      duration: "",
      priority: "medium"
    });
    setCurrentEditDay(null);
  };

  const removeActivity = (dayId: string, activityId: string) => {
    setTravelDays(prev => prev.map(day => 
      day.id === dayId 
        ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
        : day
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    const iconType = activityTypes.find(t => t.value === type);
    const Icon = iconType?.icon || MapPin;
    return <Icon className="h-4 w-4" />;
  };

  const calculateTotalBudget = () => {
    return travelDays.reduce((total, day) => {
      const dayTotal = day.activities.reduce((daySum, activity) => {
        return daySum + (activity.price || 0);
      }, 0);
      return total + dayTotal + (day.accommodation?.price || 0) + (day.transport?.price || 0);
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Travel Planner - TrvBUD V2</title>
        <meta name="description" content="Plan your perfect Southeast Asian adventure with our comprehensive itinerary builder." />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Travel Planner
        </h1>
        <p className="text-neutral-500">Create detailed itineraries for your Southeast Asian adventure</p>
      </div>

      {/* Trip Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="h-5 w-5 mr-2 text-primary" />
            Trip Overview
          </CardTitle>
          <CardDescription>Set up the basic details for your trip</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Trip Name</label>
              <Input
                placeholder="My Southeast Asia Adventure"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.code} value={dest.code}>
                      {dest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Travelers</label>
              <Select value={travelers.toString()} onValueChange={(v) => setTravelers(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Traveler' : 'Travelers'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
                placeholder="Select start date"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <DatePicker
                date={endDate}
                onDateChange={setEndDate}
                placeholder="Select end date"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget (USD)</label>
              <Input
                placeholder="$2,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          {travelDays.length > 0 && (
            <div className="mt-6 flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">{travelDays.length} days</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">{travelers} travelers</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Estimated Total: ${calculateTotalBudget().toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Trip
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      {travelDays.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Daily Itinerary</h2>
          
          {travelDays.map((day, index) => (
            <Card key={day.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Day {index + 1} - {day.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                    <CardDescription>
                      {day.activities.length} activities planned
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentEditDay(day.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Activities */}
                <div className="space-y-4">
                  {day.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{activity.name}</h4>
                            <Badge className={getPriorityColor(activity.priority)}>
                              {activity.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {activity.location}
                            </span>
                            {activity.time && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.time}
                              </span>
                            )}
                            {activity.duration && (
                              <span>{activity.duration}</span>
                            )}
                            {activity.price && (
                              <span className="font-medium text-primary">
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
                  ))}
                  
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
                  <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
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
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                      <Textarea
                        placeholder="Special instructions, booking requirements..."
                        value={newActivity.notes}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={() => addActivity(day.id)}>
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
  );
};

export default TravelPlanner;