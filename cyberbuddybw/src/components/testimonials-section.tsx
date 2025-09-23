import React from "react";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "Security Engineer at TechCorp",
      image: "avatar",
      content: "CyberTrainerX completely transformed my approach to security testing. The hands-on labs gave me practical experience that I couldn't get from theoretical courses.",
      rating: 5
    },
    {
      name: "Jane Doe",
      role: "Penetration Tester",
      image: "avatar",
      content: "The CTF challenges are incredibly realistic and engaging. I've learned more in 3 months here than in a year of traditional training.",
      rating: 5
    },
    {
      name: "John Doe Jr.",
      role: "SOC Analyst",
      image: "avatar",
      content: "As someone transitioning into cybersecurity, the structured learning paths made it easy to build skills progressively without feeling overwhelmed.",
      rating: 4
    }
  ];

  return (
    <section className="py-20 bg-background" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-primary text-glow">Members Say</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Join thousands of security professionals who have accelerated their careers through our platform.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-content1 border border-divider">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={`https://img.heroui.chat/image/${testimonial.image}?w=100&h=100&u=${index}`}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-foreground/70">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Icon 
                      key={i}
                      icon="lucide:star" 
                      className={i < testimonial.rating ? "text-primary" : "text-foreground/30"}
                    />
                  ))}
                </div>
                
                <p className="text-foreground/80 italic">"{testimonial.content}"</p>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-wrap justify-center gap-8 items-center">
          <p className="text-foreground/70 font-medium">Trusted by security teams at:</p>
          {["Google", "Microsoft", "Amazon", "IBM", "Cisco"].map((company, index) => (
            <div key={index} className="text-foreground/50 font-bold text-xl">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};