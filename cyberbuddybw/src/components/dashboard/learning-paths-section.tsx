import React from "react";
import { Icon } from "@iconify/react";
import { Card, Progress, Button } from "@heroui/react";
import { motion } from "framer-motion";

export const LearningPathsSection: React.FC<{ fullView?: boolean, onNavigate?: (page: string) => void }> = ({ 
  fullView = false,
  onNavigate
}) => {
  const paths = [
    {
      title: "Web Application Security",
      progress: 65,
      modules: 12,
      completed: 8,
      icon: "lucide:globe",
      color: "primary"
    },
    {
      title: "Network Penetration Testing",
      progress: 45,
      modules: 10,
      completed: 4,
      icon: "lucide:network",
      color: "danger"
    },
    {
      title: "Malware Analysis",
      progress: 25,
      modules: 8,
      completed: 2,
      icon: "lucide:bug",
      color: "warning"
    },
    {
      title: "Cloud Security",
      progress: 10,
      modules: 14,
      completed: 1,
      icon: "lucide:cloud",
      color: "success"
    }
  ];

  // Add more paths for the full view
  const additionalPaths = fullView ? [
    {
      title: "Mobile Application Security",
      progress: 5,
      modules: 10,
      completed: 0,
      icon: "lucide:smartphone",
      color: "secondary"
    },
    {
      title: "IoT Security",
      progress: 0,
      modules: 8,
      completed: 0,
      icon: "lucide:cpu",
      color: "default"
    },
    {
      title: "Blockchain Security",
      progress: 0,
      modules: 6,
      completed: 0,
      icon: "lucide:link",
      color: "primary"
    },
    {
      title: "Incident Response",
      progress: 0,
      modules: 12,
      completed: 0,
      icon: "lucide:siren",
      color: "danger"
    }
  ] : [];

  const allPaths = [...paths, ...additionalPaths];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Learning Paths</h2>
        {!fullView && (
          <Button variant="light" color="primary" size="sm">
            View All Paths
          </Button>
        )}
      </div>
      
      {fullView && (
        <div className="mb-6 p-4 bg-content2 rounded-lg">
          <h3 className="text-lg font-medium mb-2">About Learning Paths</h3>
          <p className="text-foreground/70 mb-4">
            Our structured learning paths are designed to take you from beginner to expert in specific cybersecurity domains.
            Each path contains hands-on labs, video lessons, and practical challenges to build your skills progressively.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge color="primary" variant="flat">Beginner Friendly</Badge>
            <Badge color="warning" variant="flat">Intermediate</Badge>
            <Badge color="danger" variant="flat">Advanced</Badge>
            <Badge color="success" variant="flat">Certification Prep</Badge>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allPaths.map((path, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4 bg-content1 border border-divider">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg bg-${path.color}/20 mr-3`}>
                  <Icon icon={path.icon} className={`text-${path.color}`} />
                </div>
                <h3 className="font-medium">{path.title}</h3>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground/70">Progress</span>
                  <span>{path.progress}%</span>
                </div>
                <Progress 
                  aria-label="Progress" 
                  size="sm" 
                  value={path.progress} 
                  color={path.color as any}
                />
              </div>
              
              <div className="flex justify-between text-xs text-foreground/70 mb-4">
                <span>{path.completed}/{path.modules} modules</span>
                <span>Est. 40 hours</span>
              </div>
              
              <Button 
                size="sm" 
                color={path.color as any} 
                variant="flat" 
                className="w-full"
                onPress={() => onNavigate && onNavigate("learning-path-detail")}
              >
                Continue
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {fullView && (
        <div className="mt-8 text-center">
          <Button 
            color="primary"
            variant="flat"
            className="px-8"
            endContent={<Icon icon="lucide:plus" />}
          >
            Request New Learning Path
          </Button>
        </div>
      )}
    </div>
  );
};