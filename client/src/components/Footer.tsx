import { Facebook, Mail, Instagram, Plane } from "lucide-react";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-400 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white rounded-md p-1">
                <Plane className="text-primary w-5 h-5" />
              </div>
              <span className="ml-2 text-xl font-bold text-white font-poppins">Trv Bud</span>
            </div>
            <p className="text-neutral-200 text-sm mb-4">Your trusted partner for memorable East Asian adventures since 2020.</p>
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
            <h4 className="font-semibold mb-4">Popular Destinations</h4>
            <ul className="space-y-2 text-neutral-200">
              <li><Link href="/stays" className="hover:text-white">Tokyo, Japan</Link></li>
              <li><Link href="/stays" className="hover:text-white">Seoul, South Korea</Link></li>
              <li><Link href="/stays" className="hover:text-white">Bangkok, Thailand</Link></li>
              <li><Link href="/stays" className="hover:text-white">Bali, Indonesia</Link></li>
              <li><Link href="/stays" className="hover:text-white">Ho Chi Minh City, Vietnam</Link></li>
              <li><Link href="/stays" className="hover:text-white">Singapore</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Travel Services</h4>
            <ul className="space-y-2 text-neutral-200">
              <li><Link href="/flights" className="hover:text-white">Discount Flights</Link></li>
              <li><Link href="/stays" className="hover:text-white">5★ Accommodations</Link></li>
              <li><Link href="/transport" className="hover:text-white">Vehicle Rentals</Link></li>
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
              <li><Link href="#" className="hover:text-white">Travel Advisories</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-300/30 mt-8 pt-8 text-center text-neutral-200 text-sm">
          <p>© {new Date().getFullYear()} Trv Bud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
