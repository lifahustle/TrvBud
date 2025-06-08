import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Crown, 
  Star, 
  Compass, 
  Gift, 
  Plane, 
  Shield, 
  Zap, 
  Heart,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface MembershipTier {
  id: string;
  name: string;
  icon: any;
  price: string;
  period: string;
  color: string;
  features: string[];
  benefits: {
    discounts: string;
    points: string;
    support: string;
    extras: string[];
  };
  popular?: boolean;
}

const membershipTiers: MembershipTier[] = [
  {
    id: "explorer",
    name: "Explorer",
    icon: Compass,
    price: "Free",
    period: "Forever",
    color: "from-blue-500 to-blue-600",
    features: [
      "Basic trip planning tools",
      "Access to destination guides",
      "Community travel tips",
      "Standard booking support",
      "Mobile app access"
    ],
    benefits: {
      discounts: "Up to 5% off bookings",
      points: "1 point per $1 spent",
      support: "Community support",
      extras: ["Travel blog access", "Basic weather updates"]
    }
  },
  {
    id: "adventurer",
    name: "Adventurer", 
    icon: Star,
    price: "$9.99",
    period: "per month",
    color: "from-purple-500 to-purple-600",
    popular: true,
    features: [
      "Advanced itinerary builder",
      "Exclusive destination content",
      "Priority booking assistance",
      "Travel buddy matching",
      "Offline maps access",
      "Currency converter tools"
    ],
    benefits: {
      discounts: "Up to 15% off bookings",
      points: "2 points per $1 spent",
      support: "Priority email support",
      extras: [
        "Early access to deals",
        "Detailed weather forecasts", 
        "Travel insurance discounts",
        "Local guide recommendations"
      ]
    }
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    price: "$19.99", 
    period: "per month",
    color: "from-amber-500 to-amber-600",
    features: [
      "Personal travel concierge",
      "VIP booking privileges",
      "Unlimited itinerary changes",
      "Premium travel buddy network",
      "24/7 emergency assistance",
      "Exclusive luxury deals",
      "Private group features"
    ],
    benefits: {
      discounts: "Up to 25% off bookings",
      points: "3 points per $1 spent", 
      support: "24/7 phone & chat support",
      extras: [
        "Complimentary travel insurance",
        "Airport lounge access passes",
        "Personalized recommendations",
        "Priority customer service",
        "Exclusive member events",
        "Premium travel documents"
      ]
    }
  }
];

export default function Membership() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user membership info
  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/profile"],
    retry: false,
  });

  const upgradeMutation = useMutation({
    mutationFn: async (tierData: { tier: string }) => {
      await apiRequest("/api/membership/upgrade", {
        method: "POST", 
        body: JSON.stringify(tierData),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/profile"] });
      toast({
        title: "Membership upgraded!",
        description: "Your new benefits are now active.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const currentTier = userProfile?.membershipTier || "explorer";
  const pointsBalance = userProfile?.pointsBalance || 0;
  const progressToNext = Math.min((pointsBalance / 1000) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TrvBUD Membership
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock exclusive benefits and enhance your Southeast Asian travel experience with our membership tiers
          </p>
        </div>

        {/* Current Status */}
        {userProfile && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Your Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Member
                    </Badge>
                    <span className="text-2xl font-bold text-primary">{pointsBalance} points</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Progress to next reward</p>
                    <Progress value={progressToNext} className="w-48 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Membership Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {membershipTiers.map((tier) => {
            const Icon = tier.icon;
            const isCurrentTier = currentTier === tier.id;
            const isUpgrade = membershipTiers.findIndex(t => t.id === currentTier) < membershipTiers.findIndex(t => t.id === tier.id);
            
            return (
              <Card 
                key={tier.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isCurrentTier ? 'ring-2 ring-primary' : ''
                } ${tier.popular ? 'scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={`bg-gradient-to-r ${tier.color} text-white ${tier.popular ? 'pt-12' : ''}`}>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Icon className="w-6 h-6" />
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-lg">/{tier.period}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Core Features
                      </h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-purple-500" />
                        Member Benefits
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-green-500" />
                          {tier.benefits.discounts}
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {tier.benefits.points}
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          {tier.benefits.support}
                        </div>
                        {tier.benefits.extras.slice(0, 2).map((extra, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            {extra}
                          </div>
                        ))}
                        {tier.benefits.extras.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{tier.benefits.extras.length - 2} more benefits
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {isCurrentTier ? (
                        <Button disabled className="w-full">
                          Current Plan
                        </Button>
                      ) : tier.id === "explorer" ? (
                        <Button variant="outline" className="w-full" disabled>
                          Free Forever
                        </Button>
                      ) : isUpgrade ? (
                        <Button 
                          className="w-full"
                          onClick={() => upgradeMutation.mutate({ tier: tier.id })}
                          disabled={upgradeMutation.isPending}
                        >
                          {upgradeMutation.isPending ? "Upgrading..." : `Upgrade to ${tier.name}`}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Downgrade Not Available
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Points & Rewards Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Earn Points & Rewards
            </CardTitle>
            <CardDescription>
              Collect points with every booking and unlock exclusive rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Book & Earn</h3>
                <p className="text-sm text-muted-foreground">Earn points on every flight, hotel, and transport booking</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Explore</h3>
                <p className="text-sm text-muted-foreground">Get bonus points for visiting new destinations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Review</h3>
                <p className="text-sm text-muted-foreground">Share your experiences and earn points for reviews</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">Redeem</h3>
                <p className="text-sm text-muted-foreground">Use points for discounts, upgrades, and exclusive experiences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}