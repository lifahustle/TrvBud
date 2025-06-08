import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Plus,
  Trash2,
  Star,
  Camera,
  Utensils,
  Bed,
  Car,
  Map,
  CheckCircle2,
  Edit3,
  Route
} from "lucide-react";

interface Activity {
  id: string;
  name: string;
  type: 'sightseeing' | 'dining' | 'shopping' | 'transport' | 'accommodation' | 'entertainment' | 'cultural' | 'adventure';
  location: string;
  time: string;
  duration?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  price?: number;
  completed: boolean;
}

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

interface TripPlan {
  destination: string;
  travelers: number;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  days: TravelDay[];
  notes?: string;
}

const TravelPlanner = () => {
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

  const toggleActivityComplete = (dayId: string, activityId: string) => {
    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map(day => 
        day.id === dayId 
          ? { 
              ...day, 
              activities: day.activities.map(a => 
                a.id === activityId ? { ...a, completed: !a.completed } : a
              )
            }
          : day
      )
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.value === type);
    const IconComponent = activityType?.icon || Star;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>Trip Planner - Southeast Asia Explorer</title>
        <meta name="description" content="Plan your perfect Southeast Asian adventure with our comprehensive trip planning tool." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Trip Planner</h1>
      </div>
      
      {/* Trip Planning Interface */}
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
                <Input
                  type="date"
                  value={tripPlan.startDate ? tripPlan.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, startDate: e.target.value ? new Date(e.target.value) : undefined }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={tripPlan.endDate ? tripPlan.endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value) : undefined }))}
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
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Textarea
                placeholder="Special preferences, dietary restrictions, etc."
                value={tripPlan.notes || ''}
                onChange={(e) => setTripPlan(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            
            <Button onClick={generateDays} className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Generate Daily Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        {tripPlan.days.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Daily Itinerary</h2>
            {tripPlan.days.map((day, index) => (
              <Card key={day.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Day {index + 1} - {day.date.toLocaleDateString()}
                      </CardTitle>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentEditDay(currentEditDay === day.id ? null : day.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Activities */}
                  <div className="space-y-3">
                    {day.activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActivityComplete(day.id, activity.id)}
                            className={activity.completed ? 'text-green-600' : 'text-gray-400'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          
                          <div className="flex items-center space-x-2">
                            {getActivityIcon(activity.type)}
                            <span className={activity.completed ? 'line-through text-gray-500' : ''}>
                              {activity.name}
                            </span>
                          </div>
                          
                          <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                            {activity.priority}
                          </Badge>
                          
                          {activity.time && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.time}
                            </div>
                          )}
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {activity.location}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivity(day.id, activity.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Activity Form */}
                  {currentEditDay === day.id && (
                    <div className="mt-4 p-4 border-t space-y-3">
                      <h4 className="font-medium">Add New Activity</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Activity name"
                          value={newActivity.name || ''}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                        />
                        
                        <Select
                          value={newActivity.type}
                          onValueChange={(value) => setNewActivity(prev => ({ ...prev, type: value as Activity['type'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {activityTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          placeholder="Location"
                          value={newActivity.location || ''}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                        />
                        
                        <Input
                          type="time"
                          value={newActivity.time || ''}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                        />
                        
                        <Input
                          placeholder="Duration (e.g., 2 hours)"
                          value={newActivity.duration || ''}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, duration: e.target.value }))}
                        />
                        
                        <Select
                          value={newActivity.priority}
                          onValueChange={(value) => setNewActivity(prev => ({ ...prev, priority: value as Activity['priority'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Textarea
                        placeholder="Notes (optional)"
                        value={newActivity.notes || ''}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                        rows={2}
                      />
                      
                      <div className="flex space-x-2">
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
    </div>
  );
};

export default TravelPlanner;