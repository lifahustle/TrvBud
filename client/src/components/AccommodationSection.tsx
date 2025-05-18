import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { Accommodation } from "@shared/schema";
import AccommodationCard from "./AccommodationCard";
import { Link } from "wouter";

const AccommodationSection = () => {
  const { data: accommodations, isLoading } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations']
  });

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-poppins">Featured Accommodations</h2>
        <Link href="/stays" className="text-primary flex items-center hover:underline">
          <span>View all</span>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : accommodations && accommodations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accommodations.slice(0, 4).map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-400">No accommodations available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default AccommodationSection;
