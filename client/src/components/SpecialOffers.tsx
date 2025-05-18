import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Offer } from "@shared/schema";
import { Link } from "wouter";

const SpecialOffers = () => {
  const { data: offers, isLoading } = useQuery<Offer[]>({
    queryKey: ['/api/offers']
  });

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-poppins">Special Offers for 2025</h2>
          <Link href="/offers" className="text-primary flex items-center hover:underline">
            <span>View all offers</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        
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
            <p className="text-neutral-400">No special offers available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffers;
