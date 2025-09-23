import React from "react";
import { Icon } from "@iconify/react";
import { Card, Progress, Badge } from "@heroui/react";
import { motion } from "framer-motion";

export const AchievementsSection: React.FC = () => {
  const achievements = [
    {
      title: "First Blood",
      description: "Complete your first challenge",
      icon: "lucide:flag",
      color: "primary",
      earned: true,
      date: "Jan 15, 2023"
    },
    {
      title: "Code Breaker",
      description: "Solve 5 cryptography challenges",
      icon: "lucide:key",
      color: "success",
      earned: true,
      date: "Feb 3, 2023"
    },
    {
      title: "Web Warrior",
      description: "Complete all web security labs",
      icon: "lucide:globe",
      color: "warning",
      earned: true,
      date: "Mar 22, 2023"
    },
    {
      title: "Network Ninja",
      description: "Complete 10 network security challenges",
      icon: "lucide:network",
      color: "danger",
      earned: false,
      progress: 70
    },
    {
      title: "Binary Boss",
      description: "Solve 3 reverse engineering challenges",
      icon: "lucide:binary",
      color: "secondary",
      earned: false,
      progress: 33
    },
    {
      title: "Persistence Pro",
      description: "Log in for 30 consecutive days",
      icon: "lucide:calendar",
      color: "primary",
      earned: false,
      progress: 40
    },
    {
      title: "Team Player",
      description: "Participate in a team CTF event",
      icon: "lucide:users",
      color: "success",
      earned: false,
      progress: 0
    },
    {
      title: "Bug Hunter",
      description: "Report 5 valid vulnerabilities",
      icon: "lucide:bug",
      color: "warning",
      earned: false,
      progress: 20
    },
    {
      title: "Master Hacker",
      description: "Complete all advanced challenges",
      icon: "lucide:award",
      color: "danger",
      earned: false,
      progress: 5
    }
  ];

  const stats = {
    totalAchievements: achievements.length,
    earned: achievements.filter(a => a.earned).length,
    points: 2450,
    rank: "Silver"
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Achievements & Badges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 bg-content1 border border-divider">
            <h3 className="text-foreground/70 text-sm mb-1">Total Achievements</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{stats.earned}</span>
              <span className="text-foreground/70 ml-1">/ {stats.totalAchievements}</span>
            </div>
            <Progress 
              aria-label="Achievement progress" 
              value={(stats.earned / stats.totalAchievements) * 100} 
              className="mt-2"
              color="primary"
            />
          </Card>
          
          <Card className="p-4 bg-content1 border border-divider">
            <h3 className="text-foreground/70 text-sm mb-1">Achievement Points</h3>
            <div className="text-2xl font-bold">{stats.points}</div>
            <p className="text-foreground/70 text-xs mt-2">+150 this month</p>
          </Card>
          
          <Card className="p-4 bg-content1 border border-divider">
            <h3 className="text-foreground/70 text-sm mb-1">Current Rank</h3>
            <div className="text-2xl font-bold">{stats.rank}</div>
            <p className="text-foreground/70 text-xs mt-2">250 points to Gold</p>
          </Card>
          
          <Card className="p-4 bg-content1 border border-divider">
            <h3 className="text-foreground/70 text-sm mb-1">Leaderboard Position</h3>
            <div className="text-2xl font-bold">#42</div>
            <p className="text-foreground/70 text-xs mt-2">Top 15%</p>
          </Card>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`p-4 bg-content1 border ${achievement.earned ? 'border-primary/50' : 'border-divider'}`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-${achievement.color}/20 flex items-center justify-center mb-3 ${!achievement.earned && 'opacity-50'}`}>
                    <Icon icon={achievement.icon} className={`text-${achievement.color} text-2xl`} />
                  </div>
                  
                  <h4 className="font-semibold mb-1">{achievement.title}</h4>
                  <p className="text-xs text-foreground/70 mb-3">{achievement.description}</p>
                  
                  {achievement.earned ? (
                    <Badge color={achievement.color as any} variant="flat">
                      Earned on {achievement.date}
                    </Badge>
                  ) : (
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress 
                        aria-label="Achievement progress" 
                        value={achievement.progress} 
                        color={achievement.color as any}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};