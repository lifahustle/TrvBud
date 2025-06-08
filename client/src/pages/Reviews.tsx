import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Camera, 
  Calendar, 
  MapPin, 
  Building, 
  Car, 
  Plane,
  Filter,
  Search,
  Plus,
  MoreHorizontal
} from "lucide-react";

interface Review {
  id: number;
  userId: number;
  itemType: string;
  itemId: number;
  rating: number;
  title: string;
  content: string;
  photos: string[];
  isVerified: boolean;
  helpfulCount: number;
  reportCount: number;
  response?: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    membershipTier: string;
  };
  item?: {
    name: string;
    location?: string;
    type: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: number[];
}

export default function Reviews() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews", selectedFilter, searchQuery],
    retry: false,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/profile"],
    retry: false,
  });

  const { data: accommodations = [] } = useQuery({
    queryKey: ["/api/accommodations"],
    retry: false,
  });

  const { data: transport = [] } = useQuery({
    queryKey: ["/api/transport"],
    retry: false,
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      await apiRequest("/api/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setShowWriteReview(false);
      toast({
        title: "Review submitted",
        description: "Your review has been posted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const helpfulMutation = useMutation({
    mutationFn: async ({ reviewId, isHelpful }: { reviewId: number; isHelpful: boolean }) => {
      await apiRequest(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        body: JSON.stringify({ isHelpful }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`${size} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'accommodation': return Building;
      case 'transport': return Car;
      case 'flight': return Plane;
      default: return Building;
    }
  };

  const WriteReviewForm = () => {
    const [formData, setFormData] = useState({
      itemType: "",
      itemId: 0,
      rating: 5,
      title: "",
      content: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.itemType || !formData.itemId || !formData.title || !formData.content) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      createReviewMutation.mutate(formData);
    };

    const getItemOptions = () => {
      if (formData.itemType === "accommodation") return accommodations;
      if (formData.itemType === "transport") return transport;
      return [];
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Service Type</label>
          <Select value={formData.itemType} onValueChange={(value) => setFormData({ ...formData, itemType: value, itemId: 0 })}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accommodation">Accommodation</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.itemType && (
          <div>
            <label className="block text-sm font-medium mb-2">Select Service</label>
            <Select value={formData.itemId.toString()} onValueChange={(value) => setFormData({ ...formData, itemId: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {getItemOptions().map((item: any) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} {item.location && `- ${item.location}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, rating: i + 1 })}
                className="p-1"
              >
                <Star 
                  className={`w-6 h-6 ${i < formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {formData.rating} star{formData.rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Review Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Summarize your experience"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Share details about your experience..."
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setShowWriteReview(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createReviewMutation.isPending}>
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    );
  };

  const ReviewCard = ({ review }: { review: Review }) => {
    const ItemIcon = getItemTypeIcon(review.itemType);
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={review.user?.profileImage} />
                <AvatarFallback>
                  {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{review.user?.firstName} {review.user?.lastName}</h4>
                  <Badge variant="outline" className="text-xs">
                    {review.user?.membershipTier || 'Explorer'}
                  </Badge>
                  {review.isVerified && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      Verified Stay
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ItemIcon className="w-4 h-4" />
              <span>{review.itemType}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <h5 className="font-medium mb-1">{review.title}</h5>
            {review.item && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span>{review.item.name}</span>
                {review.item.location && <span>• {review.item.location}</span>}
              </div>
            )}
          </div>
          
          <p className="text-sm leading-relaxed mb-4">{review.content}</p>

          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mb-4">
              {review.photos.slice(0, 3).map((photo, index) => (
                <div key={index} className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ))}
              {review.photos.length > 3 && (
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{review.photos.length - 3}</span>
                </div>
              )}
            </div>
          )}

          {review.response && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Business Response</Badge>
                <span className="text-xs text-muted-foreground">
                  {review.responseDate && new Date(review.responseDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{review.response}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="flex items-center gap-4">
              <button
                onClick={() => helpfulMutation.mutate({ reviewId: review.id, isHelpful: true })}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-green-600"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpfulCount})</span>
              </button>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600">
                <ThumbsDown className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reviews & Ratings</h1>
            <p className="text-muted-foreground">
              Share your experiences and read reviews from other travelers
            </p>
          </div>
          {userProfile && (
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience to help other travelers make informed decisions
                  </DialogDescription>
                </DialogHeader>
                <WriteReviewForm />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviews</SelectItem>
                    <SelectItem value="accommodation">Accommodations</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review: Review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share your travel experience!
                </p>
                {userProfile && (
                  <Button onClick={() => setShowWriteReview(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Write First Review
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}