import React from "react";
import { Icon } from "@iconify/react";
import { Card, Avatar, Button } from "@heroui/react";
import { motion } from "framer-motion";

export const RecentActivitySection: React.FC = () => {
  const activities = [
    {
      type: "challenge",
      title: "Completed 'SQL Injection Basics'",
      time: "2 hours ago",
      icon: "lucide:flag",
      color: "primary"
    },
    {
      type: "course",
      title: "Started 'Advanced Network Penetration'",
      time: "Yesterday",
      icon: "lucide:book-open",
      color: "success"
    },
    {
      type: "achievement",
      title: "Earned 'Code Breaker' badge",
      time: "2 days ago",
      icon: "lucide:award",
      color: "warning"
    },
    {
      type: "lab",
      title: "Completed 'Linux Privilege Escalation' lab",
      time: "3 days ago",
      icon: "lucide:server",
      color: "danger"
    },
    {
      type: "forum",
      title: "Posted in 'Web Security' forum",
      time: "5 days ago",
      icon: "lucide:message-square",
      color: "secondary"
    }
  ];

  return (
    <Card className="p-4 bg-content1 border border-divider">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Button variant="light" color="primary" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`p-2 rounded-lg bg-${activity.color}/20 mt-1`}>
              <Icon icon={activity.icon} className={`text-${activity.color}`} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.title}</p>
              <p className="text-foreground/50 text-xs">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};