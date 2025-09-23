import React from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const CtaSection = () => {
  const [email, setEmail] = React.useState("");

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid-bg opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-content1/70 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to <span className="text-primary cyber-glow">Level Up</span> Your Cybersecurity Skills?
              </h2>
              <p className="text-foreground-300 text-lg">
                Join thousands of security professionals and start your training journey today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onValueChange={setEmail}
                startContent={<Icon icon="lucide:mail" className="text-foreground-400" />}
                className="flex-grow"
              />
              <Button 
                color="primary"
                className="font-medium"
              >
                Get Started Free
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-foreground-400 text-sm">
                No credit card required. 7-day free trial on all plans.
              </p>
            </div>
            
            <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield-check" className="text-primary" />
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar" className="text-primary" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:refresh-ccw" className="text-primary" />
                <span>Weekly Content Updates</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};