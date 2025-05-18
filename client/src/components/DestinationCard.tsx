import { Heart } from "lucide-react";
import { Destination } from "@shared/schema";
import { useState } from "react";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={destination.image} 
          alt={`${destination.name}, ${destination.country}`} 
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
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{destination.name}, {destination.country}</h3>
            <p className="text-neutral-400 text-sm">{destination.description}</p>
          </div>
          {destination.tags.map((tag, index) => (
            <div key={index} className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium">
              {tag}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="text-accent text-sm w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="font-medium">{destination.rating}</span>
            <span className="text-neutral-400 text-sm ml-1">({destination.reviewCount} reviews)</span>
          </div>
          <div className="text-primary font-semibold">from ${destination.pricePerNight}/night</div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
