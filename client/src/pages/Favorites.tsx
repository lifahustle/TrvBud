import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Share2, 
  Trash2, 
  Eye, 
  Edit, 
  Plus,
  Building,
  Car,
  Plane,
  Search,
  Filter,
  Star
} from "lucide-react";

interface FavoriteItem {
  id: number;
  userId: number;
  itemType: string;
  itemId: number;
  itemData?: any;
  tags: string[];
  notes?: string;
  isPublic: boolean;
  createdAt: string;
  item?: {
    name: string;
    location?: string;
    image?: string;
    rating?: number;
    price?: number;
  };
}

interface SavedItinerary {
  id: number;
  userId: number;
  name: string;
  description?: string;
  destination: string;
  duration: number;
  budget?: number;
  activities: any[];
  accommodations?: any;
  transport?: any;
  isTemplate: boolean;
  isPublic: boolean;
  tags: string[];
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("favorites");
  const [showCreateItinerary, setShowCreateItinerary] = useState(false);
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/profile"],
    retry: false,
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/favorites"],
    retry: false,
  });

  const { data: savedItineraries = [], isLoading: itinerariesLoading } = useQuery({
    queryKey: ["/api/itineraries/saved"],
    retry: false,
  });

  const { data: publicItineraries = [] } = useQuery({
    queryKey: ["/api/itineraries/public"],
    retry: false,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: number }) => {
      await apiRequest(`/api/favorites/${itemType}/${itemId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites list.",
      });
    },
  });

  const deleteItineraryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/itineraries/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/itineraries/saved"] });
      toast({
        title: "Itinerary deleted",
        description: "Your itinerary has been deleted successfully.",
      });
    },
  });

  const likeItineraryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/itineraries/${id}/like`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/itineraries/public"] });
    },
  });

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'accommodation': return Building;
      case 'transport': return Car;
      case 'flight': return Plane;
      case 'destination': return MapPin;
      default: return Heart;
    }
  };

  const FavoriteCard = ({ favorite }: { favorite: FavoriteItem }) => {
    const ItemIcon = getItemTypeIcon(favorite.itemType);
    
    return (
      <Card className="group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <ItemIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{favorite.item?.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {favorite.item?.location}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFavoriteMutation.mutate({ itemType: favorite.itemType, itemId: favorite.itemId })}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {favorite.item?.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{favorite.item.rating}</span>
                </div>
              )}
              <Badge variant="outline" className="text-xs">
                {favorite.itemType}
              </Badge>
            </div>
            {favorite.item?.price && (
              <span className="text-sm font-semibold text-green-600">
                ${favorite.item.price}/night
              </span>
            )}
          </div>

          {favorite.notes && (
            <p className="text-sm text-muted-foreground mb-3">{favorite.notes}</p>
          )}

          {favorite.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {favorite.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Added {new Date(favorite.createdAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ItineraryCard = ({ itinerary, isPublic = false }: { itinerary: SavedItinerary; isPublic?: boolean }) => {
    return (
      <Card className="group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-1">{itinerary.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {itinerary.destination}
              </p>
            </div>
            {!isPublic && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteItineraryMutation.mutate(itinerary.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {itinerary.description && (
            <p className="text-sm text-muted-foreground mb-3">{itinerary.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{itinerary.duration} days</span>
            </div>
            {itinerary.budget && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>${itinerary.budget}</span>
              </div>
            )}
          </div>

          {itinerary.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {itinerary.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {isPublic && (
                <>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {itinerary.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {itinerary.views}
                  </span>
                </>
              )}
              <span>
                {isPublic ? 'Created' : 'Modified'} {new Date(isPublic ? itinerary.createdAt : itinerary.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isPublic && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeItineraryMutation.mutate(itinerary.id)}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>You need to be logged in to view your favorites</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Travel Collection</h1>
            <p className="text-muted-foreground">
              Manage your saved trips, favorites, and custom itineraries
            </p>
          </div>
          <Button onClick={() => setShowCreateItinerary(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Itinerary
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="itineraries">My Itineraries ({savedItineraries.length})</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="mt-6">
            {favoritesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading favorites...</p>
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites
                  .filter((fav: FavoriteItem) => 
                    searchQuery === "" || 
                    fav.item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fav.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((favorite: FavoriteItem) => (
                    <FavoriteCard key={favorite.id} favorite={favorite} />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                  <p className="text-muted-foreground">
                    Start exploring and save your favorite destinations and accommodations
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="itineraries" className="mt-6">
            {itinerariesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading itineraries...</p>
              </div>
            ) : savedItineraries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItineraries
                  .filter((itinerary: SavedItinerary) => 
                    searchQuery === "" || 
                    itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    itinerary.destination.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((itinerary: SavedItinerary) => (
                    <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Saved Itineraries</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first custom itinerary to start planning your dream trip
                  </p>
                  <Button onClick={() => setShowCreateItinerary(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Itinerary
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicItineraries.map((itinerary: SavedItinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} isPublic />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}