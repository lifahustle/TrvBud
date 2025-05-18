import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Bell, User } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Explore", path: "/" },
    { name: "Flights", path: "/flights" },
    { name: "Stays", path: "/stays" },
    { name: "Transport", path: "/transport" },
    { name: "My Trips", path: "/my-trips" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-3xl w-6 h-6">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-primary font-poppins">South Asia Explorer</span>
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
