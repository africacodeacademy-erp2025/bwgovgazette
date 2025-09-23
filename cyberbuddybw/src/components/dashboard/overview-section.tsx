import React from "react";
import { Icon } from "@iconify/react";
import { Card, Progress } from "@heroui/react";
import { motion } from "framer-motion";

export const OverviewSection: React.FC = () => {
  const stats = [
    {
      title: "Completed Challenges",
      value: "24",
      icon: "lucide:flag",
      change: "+3 this week",
      color: "primary"
    },
    {
      title: "Current Rank",
      value: "Silver",
      icon: "lucide:award",
      change: "Top 15%",
      color: "default"
    },
    {
      title: "Points Earned",
      value: "4,280",
      icon: "lucide:star",
      change: "+350 this month",
      color: "warning"
    },
    {
      title: "Streak",
      value: "12",
      icon: "lucide:flame",
      change: "days",
      color: "danger"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4 bg-content1 border border-divider">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-foreground/70 text-sm">{stat.title}</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span className="ml-2 text-xs text-foreground/50">{stat.change}</span>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                <Icon icon={stat.icon} className={`text-${stat.color} text-xl`} />
              </div>
            </div>
            
            <div className="mt-4">
              <Progress 
                aria-label="Progress" 
                size="sm" 
                value={70} 
                color={stat.color as any}
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};