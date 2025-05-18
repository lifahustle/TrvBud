import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, Star, ExternalLink } from "lucide-react";
import { Destination } from "@shared/schema";
import DestinationCard from "./DestinationCard";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const PopularDestinations = () => {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations']
  });

  // Top 10 Southeast Asian destinations with 5-star ratings
  const topEastAsianDestinations = [
    {
      id: 1,
      name: "Siem Reap",
      country: "Cambodia",
      rating: 4.9,
      description: "Explore the magnificent temples of Angkor Wat and experience authentic Khmer culture",
      discountAirline: "Cambodia Angkor Air - 25% OFF",
      discountHotel: "Raffles Grand Hotel d'Angkor - 30% OFF",
      discountVehicle: "Cambodia Luxury Transport - 15% OFF"
    },
    {
      id: 2, 
      name: "Kuala Lumpur",
      country: "Malaysia",
      rating: 4.8,
      description: "Vibrant city with stunning architecture, diverse cuisine, and luxury shopping",
      discountAirline: "Malaysia Airlines - 20% OFF",
      discountHotel: "Mandarin Oriental Kuala Lumpur - 25% OFF",
      discountVehicle: "Malaysia Premium Car Rental - 10% OFF"
    },
    {
      id: 3,
      name: "Singapore",
      country: "Singapore",
      rating: 4.9,
      description: "Immerse yourself in a multicultural city-state with futuristic attractions and pristine streets",
      discountAirline: "Singapore Airlines - 15% OFF",
      discountHotel: "Marina Bay Sands - 20% OFF",
      discountVehicle: "Singapore Luxury Limousine - 15% OFF"
    }
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Top 5★ Destinations in East Asia</h2>
        <Link href="/stays" className="text-primary flex items-center hover:underline">
          <span>View all offers</span>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {topEastAsianDestinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-xl">{destination.name}, {destination.country}</h3>
                <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  {destination.rating}
                </div>
              </div>
              
              <p className="text-neutral-600 text-sm mb-4">{destination.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center text-primary border-primary">
                    <span className="font-semibold">Flight Discount</span>
                  </Badge>
                  <span className="text-sm font-medium">{destination.discountAirline}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center text-secondary border-secondary">
                    <span className="font-semibold">Hotel Discount</span>
                  </Badge>
                  <span className="text-sm font-medium">{destination.discountHotel}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center text-accent border-accent">
                    <span className="font-semibold">Vehicle Discount</span>
                  </Badge>
                  <span className="text-sm font-medium">{destination.discountVehicle}</span>
                </div>
              </div>
              
              <Link href={`/stays?location=${destination.name}`}>
                <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center">
                  View Offers <ExternalLink className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="text-xl font-semibold mb-6">More Destinations to Explore</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : destinations && destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 3).map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-400">No additional destinations available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default PopularDestinations;
