import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accommodation } from "@shared/schema";
import { useState } from "react";

interface AccommodationCardProps {
  accommodation: Accommodation;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row h-full">
      <div className="md:w-2/5 h-48 md:h-auto relative">
        <img 
          src={accommodation.images[0]} 
          alt={accommodation.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-0 right-0 m-4">
          <button 
            className={`${isFavorite ? 'text-accent' : 'text-white hover:text-accent'}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      <div className="md:w-3/5 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            <div className="text-accent mr-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star 
                  key={index} 
                  className={`inline-block h-4 w-4 ${index < accommodation.stars ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-neutral-400 text-sm">({accommodation.reviewCount} reviews)</span>
          </div>
          <h3 className="font-semibold text-lg">{accommodation.name}</h3>
          <p className="text-neutral-400 text-sm mb-2">{accommodation.location}</p>
          <p className="text-sm mb-4">{accommodation.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {accommodation.amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-primary font-bold text-lg">${accommodation.pricePerNight} <span className="text-neutral-400 text-sm font-normal">/night</span></div>
          <Button>View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
