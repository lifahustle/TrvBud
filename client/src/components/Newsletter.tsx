import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
          backgroundImage: "url('https://images.unsplash.com/photo-1531089073319-17596b946d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')", 
          opacity: 0.2 
        }}
      ></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4">Stay Updated on Special 2025 Offers</h2>
        <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">Join our newsletter and be the first to know about exclusive deals, new destinations, and travel tips for your South Asian adventure.</p>
        
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
            className="whitespace-nowrap bg-primary hover:bg-blue-700 text-white font-bold transition-colors duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
          </Button>
        </form>
        
        <p className="text-xs text-neutral-300 mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.</p>
      </div>
    </section>
  );
};

export default Newsletter;
