import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Star, 
  Crown, 
  Compass,
  Edit3,
  Gift,
  TrendingUp,
  Award
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["/api/auth/profile"],
    retry: false,
  });

  const { data: pointsHistory } = useQuery({
    queryKey: ["/api/points/history"],
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      await apiRequest("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(profileData),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    phone: userProfile?.phone || "",
    dateOfBirth: userProfile?.dateOfBirth || "",
    nationality: userProfile?.nationality || "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>You need to be logged in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getMembershipIcon = (tier: string) => {
    switch (tier) {
      case "premium": return Crown;
      case "adventurer": return Star;
      default: return Compass;
    }
  };

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case "premium": return "from-amber-500 to-amber-600";
      case "adventurer": return "from-purple-500 to-purple-600";  
      default: return "from-blue-500 to-blue-600";
    }
  };

  const MembershipIcon = getMembershipIcon(userProfile.membershipTier);
  const progressToNext = Math.min((userProfile.pointsBalance / 1000) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userProfile.profileImage} />
                  <AvatarFallback className="text-2xl">
                    {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">
                    {userProfile.firstName} {userProfile.lastName}
                  </h1>
                  <p className="text-muted-foreground">@{userProfile.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`bg-gradient-to-r ${getMembershipColor(userProfile.membershipTier)} text-white`}
                    >
                      <MembershipIcon className="w-4 h-4 mr-1" />
                      {userProfile.membershipTier.charAt(0).toUpperCase() + userProfile.membershipTier.slice(1)} Member
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateProfileMutation.mutate(formData);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="e.g., American, Canadian, etc."
                    />
                  </div>
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile.email}</span>
                  </div>
                  {userProfile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                  )}
                  {userProfile.dateOfBirth && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(userProfile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                  {userProfile.nationality && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{userProfile.nationality}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Membership & Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Membership & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Points Balance</span>
                  <span className="text-2xl font-bold text-primary">{userProfile.pointsBalance}</span>
                </div>
                <Progress value={progressToNext} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {1000 - userProfile.pointsBalance} points to next reward
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">{userProfile.totalTrips}</div>
                  <div className="text-sm text-blue-600">Total Trips</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Award className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-600">
                    {new Date().getFullYear() - new Date(userProfile.membershipStartDate).getFullYear()}
                  </div>
                  <div className="text-sm text-green-600">Years Member</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Recent Activity
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {pointsHistory?.slice(0, 3).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{activity.description}</span>
                      <span className={`font-semibold ${activity.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.points > 0 ? '+' : ''}{activity.points}
                      </span>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">Email Verified</div>
                  <div className="text-sm text-muted-foreground">Receive important updates</div>
                </div>
                <Badge variant={userProfile.isEmailVerified ? "default" : "secondary"}>
                  {userProfile.isEmailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">Phone Verified</div>
                  <div className="text-sm text-muted-foreground">Emergency contact</div>
                </div>
                <Badge variant={userProfile.isPhoneVerified ? "default" : "secondary"}>
                  {userProfile.isPhoneVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">Member Since</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(userProfile.membershipStartDate).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}