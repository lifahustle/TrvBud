import { Facebook, Mail, Instagram } from "lucide-react";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-400 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white text-3xl w-6 h-6">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span className="ml-2 text-xl font-bold font-poppins">South Asia Explorer</span>
            </div>
            <p className="text-neutral-200 text-sm mb-4">Your trusted partner for memorable South Asian adventures since 2020.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-200 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-neutral-200">
              <li><Link href="#" className="hover:text-white">Thailand</Link></li>
              <li><Link href="#" className="hover:text-white">Vietnam</Link></li>
              <li><Link href="#" className="hover:text-white">Cambodia</Link></li>
              <li><Link href="#" className="hover:text-white">Indonesia</Link></li>
              <li><Link href="#" className="hover:text-white">Nepal</Link></li>
              <li><Link href="#" className="hover:text-white">Singapore</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Travel Services</h4>
            <ul className="space-y-2 text-neutral-200">
              <li><Link href="#" className="hover:text-white">Flight Bookings</Link></li>
              <li><Link href="#" className="hover:text-white">Accommodations</Link></li>
              <li><Link href="#" className="hover:text-white">Transportation</Link></li>
              <li><Link href="#" className="hover:text-white">Tour Packages</Link></li>
              <li><Link href="#" className="hover:text-white">Custom Itineraries</Link></li>
              <li><Link href="#" className="hover:text-white">Travel Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-neutral-200">
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white">FAQs</Link></li>
              <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Cancellation Policy</Link></li>
              <li><Link href="#" className="hover:text-white">COVID-19 Updates</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-300/30 mt-8 pt-8 text-center text-neutral-200 text-sm">
          <p>© {new Date().getFullYear()} South Asia Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
