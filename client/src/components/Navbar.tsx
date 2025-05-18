import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Bell, User, Plane, MapPin, DollarSign } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Explore", path: "/" },
    { name: "Flights", path: "/flights" },
    { name: "Stays", path: "/stays" },
    { name: "Transport", path: "/transport" },
    { name: "Money Mgt", path: "/money-management" },
    { name: "My Trips", path: "/my-trips" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-primary rounded-md p-1">
                <Plane className="text-white w-5 h-5" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-poppins">Trv Bud</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`${
                    location === link.path
                      ? "border-primary text-primary"
                      : "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-300"
                  } border-b-2 px-1 pt-1 text-sm font-medium nav-link`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button type="button" className="p-1 rounded-full text-neutral-300 hover:text-neutral-400 focus:outline-none">
              <Bell className="h-5 w-5" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button type="button" className="flex text-sm rounded-full focus:outline-none" id="user-menu-button">
                  <User className="h-6 w-6 text-neutral-400 bg-neutral-100 rounded-full p-1" />
                </button>
              </div>
            </div>
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
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${
                  location === link.path
                    ? "bg-primary text-white"
                    : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-300"
                } block pl-3 pr-4 py-2 text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
