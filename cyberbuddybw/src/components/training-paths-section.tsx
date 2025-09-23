import React from "react";
import { Icon } from "@iconify/react";
import { Card, Button, Progress } from "@heroui/react";
import { motion } from "framer-motion";

export const TrainingPathsSection: React.FC = () => {
  const trainingPaths = [
    {
      title: "Web Application Security",
      icon: "lucide:globe",
      level: "Beginner to Advanced",
      modules: 12,
      hours: 40,
      progress: 65,
      color: "primary",
      description: "Learn to identify and exploit common web vulnerabilities like XSS, SQLi, and CSRF."
    },
    {
      title: "Network Penetration Testing",
      icon: "lucide:network",
      level: "Intermediate",
      modules: 10,
      hours: 35,
      progress: 45,
      color: "danger",
      description: "Master the techniques to compromise and secure network infrastructure."
    },
    {
      title: "Malware Analysis",
      icon: "lucide:bug",
      level: "Advanced",
      modules: 8,
      hours: 30,
      progress: 25,
      color: "warning",
      description: "Reverse engineer malicious software to understand attack vectors and defense mechanisms."
    }
  ];

  return (
    <section className="py-20 bg-content2" id="training-paths">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Structured <span className="text-primary text-glow">Learning Paths</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Follow our carefully designed learning paths to build your skills progressively from fundamentals to advanced techniques.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {trainingPaths.map((path, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-content1 border border-divider hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full bg-${path.color}/20 flex items-center justify-center mr-3`}>
                    <Icon icon={path.icon} className={`text-${path.color} text-xl`} />
                  </div>
                  <h3 className="text-xl font-semibold">{path.title}</h3>
                </div>
                
                <p className="text-foreground/70 mb-4">{path.description}</p>
                
                <div className="flex justify-between text-sm text-foreground/70 mb-2">
                  <span>{path.level}</span>
                  <span>{path.modules} Modules</span>
                </div>
                
                <Progress 
                  value={path.progress} 
                  color={path.color as any}
                  className="mb-4"
                  aria-label={`${path.progress}% complete`}
                />
                
                <div className="flex justify-between mb-6">
                  <div className="flex items-center text-sm">
                    <Icon icon="lucide:clock" className="mr-1 text-foreground/70" />
                    <span className="text-foreground/70">{path.hours} hours</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Icon icon="lucide:users" className="mr-1 text-foreground/70" />
                    <span className="text-foreground/70">2.4k enrolled</span>
                  </div>
                </div>
                
                <Button 
                  color="primary" 
                  variant="flat" 
                  className="w-full"
                >
                  Explore Path
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            color="default" 
            variant="bordered"
            className="font-medium"
            endContent={<Icon icon="lucide:arrow-right" />}
          >
            View All Learning Paths
          </Button>
        </div>
      </div>
    </section>
  );
};