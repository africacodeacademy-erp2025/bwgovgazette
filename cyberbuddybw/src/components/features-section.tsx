import React from "react";
import { Icon } from "@iconify/react";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "lucide:server",
      title: "Realistic Lab Environments",
      description: "Practice in environments that mimic real-world systems and networks with varying difficulty levels."
    },
    {
      icon: "lucide:target",
      title: "Guided Learning Paths",
      description: "Structured learning paths for beginners to advanced professionals with clear progression metrics."
    },
    {
      icon: "lucide:flag",
      title: "CTF Challenges",
      description: "Weekly updated capture-the-flag challenges to test your skills in a competitive environment."
    },
    {
      icon: "lucide:shield",
      title: "Defensive Training",
      description: "Learn to build secure systems and detect intrusions with blue team focused exercises."
    },
    {
      icon: "lucide:code",
      title: "Exploit Development",
      description: "Master the art of finding and exploiting vulnerabilities in various systems and applications."
    },
    {
      icon: "lucide:users",
      title: "Community Collaboration",
      description: "Connect with fellow security enthusiasts to share knowledge and solve challenges together."
    }
  ];

  return (
    <section className="py-20 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Train Like <span className="text-primary text-glow">Real Hackers</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our platform provides everything you need to master offensive and defensive security techniques through practical, hands-on experience.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {index < 3 ? (
                <Card className="h-full border border-divider hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <div 
                    className="relative h-full"
                    style={{
                      backgroundImage: `url(https://img.heroui.chat/image/${feature.bgImage}?w=600&h=300&u=${feature.bgImageId})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black/70"></div>
                    <div className="relative z-10 p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
                        <Icon icon={feature.icon} className="text-primary text-xl" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-foreground/80">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 h-full bg-content1 border border-divider hover:border-primary/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-content2 border border-divider flex items-center justify-center mb-4">
                    <Icon icon={feature.icon} className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};