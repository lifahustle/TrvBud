import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, Star, Percent, Ticket } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/newsletter", { email });
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1536195892759-c8a3c8e1945e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')", 
          opacity: 0.1
        }}
      ></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Get Exclusive East Asia Travel Deals</h2>
        <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">Subscribe to receive premium offers on 5-star accommodations, discounted flights, and luxury vehicle rentals across East Asia's top destinations.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Star className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">5★ Hotel Discounts</h3>
            <p className="text-sm text-neutral-500">Exclusive rates at luxury hotels in Tokyo, Seoul, Hong Kong and more</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="bg-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Percent className="text-secondary h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Flight Deals</h3>
            <p className="text-sm text-neutral-500">Up to 30% off on premium airlines to East Asian destinations</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="bg-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Ticket className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Exclusive Packages</h3>
            <p className="text-sm text-neutral-500">Members-only vacation packages with VIP benefits</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg" 
          />
          <Button 
            type="submit" 
            className="whitespace-nowrap bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold transition-opacity duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Get Deals Now'}
          </Button>
        </form>
        
        <div className="flex items-center justify-center mt-6 text-sm text-neutral-500">
          <Check className="text-primary h-4 w-4 mr-2" />
          <span>No spam, only the best deals delivered to your inbox</span>
        </div>
        
        <p className="text-xs text-neutral-400 mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates from Trv Bud.</p>
      </div>
    </section>
  );
};

export default Newsletter;
