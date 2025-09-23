import React from "react";
import { Icon } from "@iconify/react";
import { Card, Button, Divider } from "@heroui/react";
import { motion } from "framer-motion";

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Basic",
      price: "29",
      description: "Perfect for beginners starting their cybersecurity journey",
      features: [
        "Access to 50+ beginner labs",
        "Basic CTF challenges",
        "Community forum access",
        "Monthly webinars",
        "Email support"
      ],
      buttonText: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "79",
      description: "Comprehensive training for security professionals",
      features: [
        "Access to 200+ labs (all levels)",
        "All CTF challenges",
        "Private Discord community",
        "Weekly live training sessions",
        "Career mentorship",
        "24/7 priority support"
      ],
      buttonText: "Get Professional",
      popular: true
    },
    {
      name: "Enterprise",
      price: "199",
      description: "Custom solutions for teams and organizations",
      features: [
        "Everything in Professional",
        "Custom training environments",
        "Team management dashboard",
        "Progress tracking & reporting",
        "Dedicated account manager",
        "Custom challenge development"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-content2" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, <span className="text-primary text-glow">Transparent</span> Pricing
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include a 7-day free trial.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex"
            >
              <Card className={`p-6 bg-content1 border ${plan.popular ? 'border-primary animated-border' : 'border-divider'} flex flex-col h-full overflow-visible`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-foreground/70">/month</span>
                </div>
                <p className="text-foreground/70 mb-6">{plan.description}</p>
                
                <Divider className="my-4" />
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Icon icon="lucide:check" className="text-primary mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  color={plan.popular ? "primary" : "default"}
                  variant={plan.popular ? "solid" : "bordered"}
                  className="w-full font-medium"
                >
                  {plan.buttonText}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-foreground/70 mb-2">Need a custom solution?</p>
          <Button 
            color="default" 
            variant="light"
            endContent={<Icon icon="lucide:arrow-right" />}
          >
            Contact our sales team
          </Button>
        </div>
      </div>
    </section>
  );
};