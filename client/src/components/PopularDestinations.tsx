import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { Destination } from "@shared/schema";
import DestinationCard from "./DestinationCard";
import { Link } from "wouter";

const PopularDestinations = () => {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations']
  });

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-poppins">Popular Destinations in South Asia</h2>
        <Link href="/destinations" className="text-primary flex items-center hover:underline">
          <span>View all</span>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
      
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
          <p className="text-neutral-400">No destinations available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default PopularDestinations;
