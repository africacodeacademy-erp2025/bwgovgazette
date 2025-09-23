import React from "react";
import { Icon } from "@iconify/react";
import { Card, Button, Badge, Tabs, Tab } from "@heroui/react";
import { motion } from "framer-motion";

export const LabsSection: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  
  const labs = [
    {
      title: "SQL Injection Attack Lab",
      category: "web",
      difficulty: "Beginner",
      duration: "45 min",
      points: 100,
      status: "completed"
    },
    {
      title: "Network Traffic Analysis",
      category: "network",
      difficulty: "Intermediate",
      duration: "60 min",
      points: 150,
      status: "in-progress"
    },
    {
      title: "Linux Privilege Escalation",
      category: "system",
      difficulty: "Advanced",
      duration: "90 min",
      points: 250,
      status: "not-started"
    },
    {
      title: "Cross-Site Scripting (XSS)",
      category: "web",
      difficulty: "Beginner",
      duration: "30 min",
      points: 100,
      status: "completed"
    },
    {
      title: "Reverse Engineering Malware",
      category: "malware",
      difficulty: "Advanced",
      duration: "120 min",
      points: 300,
      status: "not-started"
    },
    {
      title: "Password Cracking Techniques",
      category: "crypto",
      difficulty: "Intermediate",
      duration: "60 min",
      points: 200,
      status: "not-started"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "danger";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <Icon icon="lucide:check-circle" className="text-success" />;
      case "in-progress": return <Icon icon="lucide:clock" className="text-warning" />;
      case "not-started": return <Icon icon="lucide:circle" className="text-foreground/50" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "in-progress": return "In Progress";
      case "not-started": return "Not Started";
      default: return "";
    }
  };

  const filteredLabs = selectedCategory === "all" 
    ? labs 
    : labs.filter(lab => lab.category === selectedCategory);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Hands-on Labs</h2>
          <p className="text-foreground/70">Practice your skills in realistic environments</p>
        </div>
      </div>
      
      <Tabs 
        aria-label="Lab categories" 
        selectedKey={selectedCategory}
        onSelectionChange={setSelectedCategory as any}
        className="mb-6"
        classNames={{
          tabList: "bg-content1 p-1 rounded-lg",
          cursor: "bg-content3",
          tab: "data-[selected=true]:text-primary"
        }}
      >
        <Tab key="all" title="All Labs" />
        <Tab key="web" title="Web Security" />
        <Tab key="network" title="Network" />
        <Tab key="system" title="System" />
        <Tab key="crypto" title="Cryptography" />
        <Tab key="malware" title="Malware" />
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4 bg-content1 border border-divider">
              <div className="flex justify-between items-start mb-3">
                <Badge color={getDifficultyColor(lab.difficulty) as any} variant="flat">
                  {lab.difficulty}
                </Badge>
                {getStatusIcon(lab.status)}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{lab.title}</h3>
              
              <div className="flex justify-between text-sm text-foreground/70 mb-4">
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:clock" />
                  <span>{lab.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:award" />
                  <span>{lab.points} pts</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">{getStatusText(lab.status)}</span>
                <Button 
                  size="sm" 
                  color={lab.status === "in-progress" ? "primary" : "default"}
                  variant={lab.status === "in-progress" ? "solid" : "flat"}
                  onPress={() => onNavigate && onNavigate("lab-detail")}
                >
                  {lab.status === "completed" ? "View Report" : lab.status === "in-progress" ? "Continue" : "Start Lab"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-content2 rounded-lg border border-divider">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold">Lab Environment</h3>
            <p className="text-foreground/70">Your virtual machines and environments</p>
          </div>
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:plus" />}
            onPress={() => onNavigate && onNavigate("environment")}
          >
            Launch New Environment
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-content1 border border-divider">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <h4 className="font-medium">Kali Linux VM</h4>
                </div>
                <p className="text-sm text-foreground/70 mb-3">Running - 2 hours 15 minutes</p>
              </div>
              <Badge color="success" variant="flat">Active</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="flat" color="default">
                Connect
              </Button>
              <Button size="sm" variant="light" color="danger">
                Stop
              </Button>
            </div>
          </Card>
          
          <Card className="p-4 bg-content1 border border-divider">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-foreground/30"></div>
                  <h4 className="font-medium">Windows Server VM</h4>
                </div>
                <p className="text-sm text-foreground/70 mb-3">Stopped</p>
              </div>
              <Badge color="default" variant="flat">Inactive</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="flat" color="primary">
                Start
              </Button>
              <Button size="sm" variant="light" color="default">
                Configure
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};