import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Hero = () => {
  return (
    <div 
      className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold font-poppins max-w-3xl leading-tight mb-6">
          Your South Asian Adventure Awaits in 2025
        </h1>
        <p className="text-white text-lg md:text-xl mb-8 max-w-2xl">
          Discover ancient temples, pristine beaches, and vibrant cultures across South Asia's most breathtaking destinations.
        </p>
        <Link href="#search-section">
          <Button size="lg" className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
            Start Planning
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
