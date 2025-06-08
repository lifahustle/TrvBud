import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Hero = () => {
  return (
    <div 
      className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold font-poppins max-w-3xl leading-tight mb-6">
          Discover Southeast Asia's Hidden Gems in 2025
        </h1>
        <p className="text-white text-lg md:text-xl mb-8 max-w-2xl">
          Experience Thailand's beaches, Vietnam's culture, Philippines' islands, and Cambodia's temples with exclusive deals and AI-powered travel planning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/flights">
            <Button size="lg" className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
              Discount Flights
            </Button>
          </Link>
          <Link href="/stays">
            <Button size="lg" className="bg-secondary hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
              5★ Hotels
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
