import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, AirVent, Users, MapPin, Wifi } from "lucide-react";
import { Transport } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const TransportSection = () => {
  const { data: transports, isLoading } = useQuery<Transport[]>({
    queryKey: ['/api/transport']
  });

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-poppins">Transportation Options</h2>
          <Link href="/transport" className="text-primary flex items-center hover:underline">
            <span>View all</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transports && transports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transports.slice(0, 4).map((transport) => (
              <div key={transport.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-40 relative">
                  <img 
                    src={transport.image} 
                    alt={transport.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{transport.name}</h3>
                  <p className="text-neutral-400 text-sm mb-3">{transport.description}</p>
                  <div className="flex items-center mb-3">
                    {transport.hasAC && (
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full mr-2 flex items-center">
                        <AirVent className="h-3 w-3 mr-1" /> A/C
                      </span>
                    )}
                    <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full mr-2 flex items-center">
                      <Users className="h-3 w-3 mr-1" /> {transport.seats} Seats
                    </span>
                    {transport.hasGPS && (
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> GPS
                      </span>
                    )}
                    {transport.hasWifi && (
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full ml-2 flex items-center">
                        <Wifi className="h-3 w-3 mr-1" /> WiFi
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-primary font-bold">${transport.pricePerDay} <span className="text-neutral-400 text-sm font-normal">/day</span></div>
                    <Button variant="secondary" size="sm">Book Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-400">No transportation options available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransportSection;
