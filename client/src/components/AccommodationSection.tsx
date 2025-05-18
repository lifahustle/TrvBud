import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, Star, Zap, PercentCircle } from "lucide-react";
import { Accommodation } from "@shared/schema";
import AccommodationCard from "./AccommodationCard";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const AccommodationSection = () => {
  const { data: accommodations, isLoading } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations']
  });

  // Featured 5-star accommodations in East Asia with special discounts
  const featuredLuxuryAccommodations = [
    {
      id: 1,
      name: "The Peninsula Tokyo",
      location: "Tokyo, Japan",
      description: "Luxurious 5-star hotel with stunning views of the Imperial Palace Gardens and Hibiya Park",
      originalPrice: 550,
      discountPrice: 385,
      discountPercent: 30,
      rating: 4.9,
      reviewCount: 312,
      tags: ["Imperial View", "Spa", "Fine Dining"],
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
    },
    {
      id: 2,
      name: "Mandarin Oriental Hong Kong",
      location: "Hong Kong",
      description: "Iconic luxury hotel in the heart of Hong Kong with Victoria Harbour views and world-class service",
      originalPrice: 490,
      discountPrice: 367,
      discountPercent: 25,
      rating: 4.8,
      reviewCount: 286,
      tags: ["Harbour View", "Michelin Star Restaurant", "Club Access"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80"
    }
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">5★ East Asia Luxury Accommodations</h2>
        <Link href="/stays" className="text-primary flex items-center hover:underline">
          <span>View all luxury stays</span>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {featuredLuxuryAccommodations.map((accommodation) => (
          <div key={accommodation.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row h-full">
            <div className="md:w-2/5 h-64 md:h-auto relative">
              <img 
                src={accommodation.image} 
                alt={accommodation.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3 bg-error text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <PercentCircle className="h-4 w-4 mr-1" />
                <span>{accommodation.discountPercent}% OFF</span>
              </div>
            </div>
            <div className="md:w-3/5 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium flex items-center mr-2">
                    <Star className="h-3 w-3 fill-amber-500 stroke-amber-500 mr-1" />
                    <span>5★ Luxury</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-neutral-700 text-sm">{accommodation.rating}</span>
                    <span className="text-neutral-400 text-sm ml-1">({accommodation.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg">{accommodation.name}</h3>
                <p className="text-neutral-500 text-sm mb-3">{accommodation.location}</p>
                <p className="text-sm mb-3">{accommodation.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {accommodation.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-neutral-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline">
                    <span className="text-neutral-400 line-through mr-2">${accommodation.originalPrice}</span>
                    <span className="text-xl font-bold text-primary">${accommodation.discountPrice}</span>
                    <span className="text-neutral-500 text-sm ml-1">/night</span>
                  </div>
                  <Badge className="bg-secondary/10 text-secondary border-0">Limited Time Offer</Badge>
                </div>
                
                <Link href="/stays">
                  <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-2 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Zap className="h-4 w-4 mr-2" />
                    Book With Discount
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="text-xl font-semibold mb-6">More Accommodations</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : accommodations && accommodations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accommodations.slice(0, 2).map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-400">No additional accommodations available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default AccommodationSection;
