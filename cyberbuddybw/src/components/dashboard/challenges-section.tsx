import React from "react";
import { Icon } from "@iconify/react";
import { Card, Button, Badge } from "@heroui/react";
import { motion } from "framer-motion";

export const ChallengesSection: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const challenges = [
    {
      title: "Cross-Site Scripting Challenge",
      difficulty: "Medium",
      points: 250,
      category: "Web"
    },
    {
      title: "Reverse Engineering Binary",
      difficulty: "Hard",
      points: 500,
      category: "Binary"
    },
    {
      title: "Network Traffic Analysis",
      difficulty: "Easy",
      points: 100,
      category: "Network"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "success";
      case "Medium": return "warning";
      case "Hard": return "danger";
      default: return "default";
    }
  };

  return (
    <Card className="p-4 bg-content1 border border-divider h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Challenges</h2>
        <Button 
          variant="light" 
          color="primary" 
          size="sm"
          onPress={() => onNavigate && onNavigate("challenge")}
        >
          Browse All
        </Button>
      </div>
      
      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-3 border border-divider rounded-lg hover:bg-content2 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{challenge.title}</h3>
              <Badge color={getDifficultyColor(challenge.difficulty) as any} variant="flat">
                {challenge.difficulty}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/70">{challenge.category}</span>
              <span className="text-xs font-medium">{challenge.points} pts</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 p-3 border border-dashed border-primary/50 rounded-lg bg-primary/5 text-center">
        <p className="text-sm mb-2">Daily Challenge</p>
        <p className="text-xs text-foreground/70 mb-3">Complete today's challenge for bonus points</p>
        <Button 
          size="sm" 
          color="primary" 
          variant="flat" 
          className="w-full"
          onPress={() => onNavigate && onNavigate("challenge")}
        >
          Start Challenge
        </Button>
      </div>
    </Card>
  );
};