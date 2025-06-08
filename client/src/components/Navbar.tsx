import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Menu, Bell, User, Plane, Crown, Star, DollarSign, LogOut, Settings, ChevronDown, Car, Calendar, FileText, Wallet, BookOpen, Languages } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is authenticated
  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/profile"],
    retry: false,
  });

  const navLinks = [
    { name: "Stays", path: "/stays" },
    { 
      name: "Trips", 
      path: "/my-trips",
      hasDropdown: true,
      dropdownItems: [
        { name: "Trip Planner", path: "/travel-planner" },
        { name: "Booking Manager", path: "/booking-manager" }
      ]
    },
    { name: "AI Bud", path: "/travel-buddy" },
    { name: "Trv Docs", path: "/travel-documents" },
    { name: "Wallet", path: "/money-management" },
    { name: "Visas", path: "/visas" },
    { name: <Languages className="w-4 h-4" />, path: "/google-translate" },
    { name: "Reviews", path: "/reviews" },
  ];

  const exploreMenuItems = [
    { name: "Latest Deals", path: "/", icon: DollarSign },
    { name: "Flights", path: "/flights", icon: Plane },
    { name: "Transport", path: "/transport", icon: Car },
  ];

  const getMembershipIcon = (tier: string) => {
    switch (tier) {
      case "premium": return Crown;
      case "adventurer": return Star;
      default: return User;
    }
  };

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case "premium": return "from-amber-500 to-amber-600";
      case "adventurer": return "from-purple-500 to-purple-600";
      default: return "from-blue-500 to-blue-600";
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <div className="bg-primary rounded-md p-1">
                <Plane className="text-white w-5 h-5" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-poppins">Trv Bud</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Let's Go Dropdown - First Item */}
              <DropdownMenu>
                <DropdownMenuTrigger className={`${
                  exploreMenuItems.some(item => location === item.path)
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-300"
                } border-b-2 px-1 pt-1 text-sm font-medium nav-link flex items-center`}>
                  Travel
                  <ChevronDown className="w-3 h-3 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {exploreMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link href={item.path} className="flex items-center w-full">
                          <IconComponent className="w-4 h-4 mr-2" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <DropdownMenu key={link.path}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={`${
                          location === link.path || link.dropdownItems?.some(item => location === item.path)
                            ? "border-primary text-primary"
                            : "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-300"
                        } border-b-2 px-1 pt-1 pb-1 text-sm font-medium nav-link flex items-center h-auto`}
                      >
                        {link.name} <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {link.dropdownItems?.map((item) => (
                        <DropdownMenuItem key={item.path}>
                          <Link href={item.path} className="w-full">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={`${
                      location === link.path
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-300"
                    } border-b-2 px-1 pt-1 text-sm font-medium nav-link flex items-center`}
                  >
                    {link.name === "Trv Docs" ? (
                      <>
                        Trv <FileText className="w-4 h-4 ml-1" />
                      </>
                    ) : link.name === "Wallet" ? (
                      <Wallet className="w-4 h-4" />
                    ) : link.name === "Visas" ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      link.name
                    )}
                  </Link>
                )
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {userProfile ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/membership" className="mr-2">
                    <Badge 
                      variant="secondary" 
                      className={`bg-gradient-to-r ${getMembershipColor(userProfile.membershipTier || 'explorer')} text-white`}
                    >
                      {(() => {
                        const IconComponent = getMembershipIcon(userProfile.membershipTier || 'explorer');
                        return <IconComponent className="w-3 h-3 mr-1" />;
                      })()}
                      {(userProfile.membershipTier || 'explorer').charAt(0).toUpperCase() + (userProfile.membershipTier || 'explorer').slice(1)}
                    </Badge>
                  </Link>
                </Button>
                <button 
                  type="button" 
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-300 focus:outline-none mr-3"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile.profileImage || ''} alt={userProfile.username || ''} />
                        <AvatarFallback>
                          {(userProfile.firstName || 'U')[0]}{(userProfile.lastName || 'U')[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{userProfile.firstName} {userProfile.lastName}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userProfile.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userProfile.pointsBalance || 0} points
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/membership" className="cursor-pointer">
                        <Crown className="mr-2 h-4 w-4" />
                        Membership
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/booking-manager" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                          window.location.href = '/';
                        });
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild>
                  <Link href="/membership">My TrvBUD</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-300 hover:bg-neutral-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {/* Travel section in mobile - First */}
            <div className="border-b border-neutral-200 pb-2 mb-2">
              <div className="px-3 pb-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Travel</p>
              </div>
              {exploreMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${
                      location === item.path
                        ? "bg-primary text-white"
                        : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-300"
                    } flex items-center pl-6 pr-4 py-2 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.path} className="space-y-1">
                  <div className="pl-3 pr-4 py-2 text-base font-medium text-neutral-600 flex items-center">
                    {link.name}
                  </div>
                  {link.dropdownItems?.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`${
                        location === item.path
                          ? "bg-primary text-white"
                          : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-300"
                      } block pl-6 pr-4 py-2 text-sm font-medium flex items-center`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`${
                    location === link.path
                      ? "bg-primary text-white"
                      : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-300"
                  } block pl-3 pr-4 py-2 text-base font-medium flex items-center`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name === "Trv Docs" ? (
                    <>
                      Trv <FileText className="w-4 h-4 ml-1" />
                    </>
                  ) : link.name === "Wallet" ? (
                    <Wallet className="w-4 h-4" />
                  ) : link.name === "Visas" ? (
                    <BookOpen className="w-4 h-4" />
                  ) : (
                    link.name
                  )}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
