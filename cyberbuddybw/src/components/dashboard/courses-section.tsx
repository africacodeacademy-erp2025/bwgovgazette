import React from "react";
import { Icon } from "@iconify/react";
import { Card, Button, Badge, Input } from "@heroui/react";
import { motion } from "framer-motion";

export const CoursesSection: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const courses = [
    {
      title: "Web Application Security Fundamentals",
      instructor: "John Doe",
      level: "Beginner",
      duration: "10 hours",
      enrolled: 1245,
      rating: 4.8,
      progress: 65,
      image: "dashboard"
    },
    {
      title: "Advanced Network Penetration Testing",
      instructor: "Jane Doe",
      level: "Advanced",
      duration: "15 hours",
      enrolled: 892,
      rating: 4.9,
      progress: 30,
      image: "dashboard"
    },
    {
      title: "Secure Coding Practices",
      instructor: "John Doe Jr.",
      level: "Intermediate",
      duration: "12 hours",
      enrolled: 1056,
      rating: 4.7,
      progress: 10,
      image: "dashboard"
    },
    {
      title: "Malware Analysis Techniques",
      instructor: "Jane Doe Sr.",
      level: "Advanced",
      duration: "18 hours",
      enrolled: 745,
      rating: 4.9,
      progress: 0,
      image: "dashboard"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "danger";
      default: return "default";
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">My Courses</h2>
          <p className="text-foreground/70">Continue learning where you left off</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            classNames={{
              input: "text-foreground",
              inputWrapper: "text-foreground"
            }}
            startContent={<Icon icon="lucide:search" className="text-foreground/50" />}
            className="w-full md:w-64"
          />
          <Button color="primary" variant="flat">
            <Icon icon="lucide:filter" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="h-40 bg-content2 relative">
                <img 
                  src={`https://img.heroui.chat/image/${course.image}?w=400&h=200&u=${index+20}`}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <Badge color={getLevelColor(course.level) as any} variant="flat">
                    {course.level}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-foreground/70 mb-3">Instructor: {course.instructor}</p>
                
                <div className="flex justify-between text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:clock" className="text-foreground/70" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:users" className="text-foreground/70" />
                    <span>{course.enrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:star" className="text-warning" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                {course.progress > 0 ? (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-content2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="h-8"></div>
                )}
                
                <Button 
                  color="primary" 
                  className="w-full"
                  variant={course.progress > 0 ? "solid" : "flat"}
                  onPress={() => onNavigate && onNavigate("course-detail")}
                >
                  {course.progress > 0 ? "Continue" : "Start Course"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recommended Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Cloud Security Essentials", "Mobile App Penetration Testing", "Threat Hunting Techniques"].map((title, i) => (
            <Card key={i} className="p-4 bg-content1 border border-divider">
              <h4 className="font-medium mb-1">{title}</h4>
              <p className="text-sm text-foreground/70 mb-3">Instructor: John Doe {i+1}</p>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-foreground/70">Beginner</span>
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:star" className="text-warning" />
                  <span>4.7</span>
                </div>
              </div>
              <Button size="sm" variant="flat" color="primary" className="w-full">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};