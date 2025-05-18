import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Loader2, User } from "lucide-react";

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials']
  });

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-2xl font-bold font-poppins mb-2">What Our Travelers Say</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">Hear from adventurers who have experienced the magic of South Asia through our platform.</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                  <User className="text-neutral-400 h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-400">{testimonial.tripDetails}</p>
                </div>
              </div>
              <div className="text-accent mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-sm mb-4">"{testimonial.comment}"</p>
              <p className="text-xs text-neutral-300">{testimonial.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-400">No testimonials available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
