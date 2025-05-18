import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, Clock, ArrowRight, Plane, Building, Car, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Offer } from "@shared/schema";
import { Link } from "wouter";

const SpecialOffers = () => {
  const { data: offers, isLoading } = useQuery<Offer[]>({
    queryKey: ['/api/offers']
  });

  // Curated list of special deals for East Asian travel with 5-star ratings
  const curatedOffers = [
    {
      id: 1,
      title: "Hong Kong Luxury Escape",
      description: "5-star stay at The Peninsula Hong Kong with business class flights on Cathay Pacific and Mercedes-Benz rental",
      tags: ["5★ Hotel", "Business Class", "Premium Vehicle"],
      type: "complete",
      originalPrice: 3400,
      discountedPrice: 2550,
      discountPercentage: 25,
      rating: 4.9,
      reviewCount: 142,
      icon: Building
    },
    {
      id: 2,
      title: "ANA 5-Star Business Class",
      description: "Round-trip business class flights to Tokyo, Osaka, or Sapporo with All Nippon Airways - Skytrax 5-Star airline",
      tags: ["Business Class", "Direct Flights", "Premium Service"],
      type: "flight",
      originalPrice: 2200,
      discountedPrice: 1760,
      discountPercentage: 20,
      rating: 4.8,
      reviewCount: 217,
      icon: Plane
    },
    {
      id: 3,
      title: "Premium Vehicle Rentals in Japan",
      description: "Luxury Lexus, Toyota Century, or Mercedes-Benz vehicles with English GPS navigation and comprehensive insurance",
      tags: ["Premium Cars", "Full Insurance", "No Hidden Fees"],
      type: "vehicle",
      originalPrice: 180,
      discountedPrice: 135,
      discountPercentage: 25,
      rating: 4.9,
      reviewCount: 86,
      icon: Car
    }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Exclusive East Asia 5★ Offers for 2025</h2>
          <Link href="/flights" className="text-primary flex items-center hover:underline">
            <span>View all deals</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {curatedOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-neutral-100">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-full ${
                    offer.type === 'flight' ? 'bg-primary/10 text-primary' : 
                    offer.type === 'vehicle' ? 'bg-accent/10 text-accent' : 
                    'bg-secondary/10 text-secondary'
                  }`}>
                    <offer.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl ml-3">{offer.title}</h3>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(offer.rating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'}`} />
                  ))}
                  <span className="ml-2 text-sm text-neutral-500">{offer.rating} ({offer.reviewCount} reviews)</span>
                </div>
                
                <p className="text-neutral-600 text-sm mb-4">{offer.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {offer.tags.map((tag, index) => (
                    <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-neutral-400 line-through">${offer.originalPrice}</div>
                    <div className="text-xl font-bold text-primary">${offer.discountedPrice}</div>
                  </div>
                  <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center">
                    <span>{offer.discountPercentage}% off</span>
                  </div>
                </div>
                
                <Link href={`/${offer.type === 'flight' ? 'flights' : offer.type === 'vehicle' ? 'transport' : 'stays'}`}>
                  <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                    View Deal <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <h3 className="text-xl font-semibold mb-6">More Special Offers</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.slice(0, 3).map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-neutral-100">
                <div className="p-6">
                  <div className={`text-${offer.badgeColor} font-semibold text-sm mb-2`}>{offer.badgeText}</div>
                  <h3 className="font-bold text-xl mb-2">{offer.title}</h3>
                  <p className="text-neutral-400 mb-4">{offer.description}</p>
                  <div className="flex justify-between items-center">
                    {offer.expiresInDays ? (
                      <div className="bg-error/10 text-error px-3 py-1 rounded-full text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Ends in {offer.expiresInDays} days
                      </div>
                    ) : offer.discountPercentage ? (
                      <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                        {offer.discountPercentage}% off
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {offer.originalPrice && (
                          <div className="text-neutral-400 line-through mr-2">${offer.originalPrice}</div>
                        )}
                        {offer.discountedPrice && (
                          <div className="text-xl font-bold text-primary">${offer.discountedPrice}</div>
                        )}
                      </div>
                    )}
                    <Button variant="link" className="text-primary font-medium hover:underline">
                      View Details <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-400">No additional special offers available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffers;
