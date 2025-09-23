import React from "react";
import { Icon } from "@iconify/react";
import { Card, Button, Avatar, Input, Tabs, Tab, Divider } from "@heroui/react";
import { motion } from "framer-motion";

export const CommunitySection: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("discussions");
  
  const discussions = [
    {
      title: "How to approach OWASP Top 10 vulnerabilities?",
      author: "John Doe",
      avatar: 11,
      category: "Web Security",
      replies: 24,
      views: 156,
      lastActivity: "2 hours ago"
    },
    {
      title: "Best tools for network traffic analysis?",
      author: "Jane Doe",
      avatar: 12,
      category: "Network Security",
      replies: 18,
      views: 132,
      lastActivity: "5 hours ago"
    },
    {
      title: "Struggling with buffer overflow challenges",
      author: "John Doe Jr.",
      avatar: 13,
      category: "Binary Exploitation",
      replies: 31,
      views: 203,
      lastActivity: "Yesterday"
    },
    {
      title: "Career path: Red Team vs Blue Team",
      author: "Jane Doe Sr.",
      avatar: 14,
      category: "Career Advice",
      replies: 42,
      views: 287,
      lastActivity: "2 days ago"
    }
  ];
  
  const events = [
    {
      title: "Weekly CTF Challenge",
      date: "Every Friday",
      time: "18:00 UTC",
      participants: 78,
      status: "upcoming"
    },
    {
      title: "Web Security Workshop",
      date: "June 15, 2023",
      time: "15:00 UTC",
      participants: 45,
      status: "upcoming"
    },
    {
      title: "Incident Response Simulation",
      date: "June 22, 2023",
      time: "14:00 UTC",
      participants: 32,
      status: "upcoming"
    }
  ];
  
  const members = [
    { name: "John Doe", role: "Security Engineer", avatar: 15, points: 4250 },
    { name: "Jane Doe", role: "Penetration Tester", avatar: 16, points: 3890 },
    { name: "John Doe Jr.", role: "Security Analyst", avatar: 17, points: 3540 },
    { name: "Jane Doe Sr.", role: "Security Researcher", avatar: 18, points: 3120 },
    { name: "John Doe III", role: "Red Team Lead", avatar: 19, points: 2980 },
    { name: "Jane Doe Jr.", role: "Blue Team Specialist", avatar: 20, points: 2760 }
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Community</h2>
          <p className="text-foreground/70">Connect with fellow security professionals</p>
        </div>
        
        <div className="flex gap-2">
          <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
            New Discussion
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-content1 border border-divider overflow-hidden">
            <Tabs 
              aria-label="Community tabs" 
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab as any}
              classNames={{
                tabList: "bg-content2 p-1",
                cursor: "bg-content3",
                tab: "data-[selected=true]:text-primary"
              }}
            >
              <Tab key="discussions" title="Discussions" />
              <Tab key="events" title="Events" />
              <Tab key="resources" title="Resources" />
            </Tabs>
            
            <div className="p-4">
              {selectedTab === "discussions" && (
                <>
                  <Input
                    placeholder="Search discussions..."
                    startContent={<Icon icon="lucide:search" className="text-foreground/50" />}
                    className="mb-4"
                    classNames={{
                      input: "text-foreground",
                      inputWrapper: "text-foreground"
                    }}
                  />
                  
                  <div className="space-y-4">
                    {discussions.map((discussion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="p-3 border border-divider rounded-lg hover:bg-content2 transition-colors cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{discussion.title}</h3>
                            <span className="text-xs bg-content3 px-2 py-1 rounded-full">
                              {discussion.category}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${discussion.avatar}`}
                                size="sm"
                                name={discussion.author}
                              />
                              <span className="text-sm">{discussion.author}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-foreground/70">
                              <div className="flex items-center gap-1">
                                <Icon icon="lucide:message-circle" />
                                <span>{discussion.replies}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon icon="lucide:eye" />
                                <span>{discussion.views}</span>
                              </div>
                              <span>{discussion.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <Button variant="light" color="primary">
                      Load More
                    </Button>
                  </div>
                </>
              )}
              
              {selectedTab === "events" && (
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="p-4 bg-content2 border border-divider">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            {event.status === "upcoming" ? "Upcoming" : "Past"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-foreground/70 mb-3">
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:calendar" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:clock" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:users" />
                            <span>{event.participants} participants</span>
                          </div>
                        </div>
                        
                        <Button size="sm" color="primary" variant="flat">
                          {event.status === "upcoming" ? "Join Event" : "View Recording"}
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                  
                  <div className="p-4 border border-dashed border-primary/50 rounded-lg bg-primary/5 text-center">
                    <h3 className="font-medium mb-2">Suggest an Event</h3>
                    <p className="text-sm text-foreground/70 mb-3">
                      Have an idea for a community event or workshop?
                    </p>
                    <Button size="sm" color="primary" variant="flat">
                      Submit Suggestion
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedTab === "resources" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Web Security Cheat Sheet", downloads: 1245, type: "PDF" },
                      { title: "Network Pentesting Guide", downloads: 982, type: "PDF" },
                      { title: "Linux Command Reference", downloads: 1567, type: "PDF" },
                      { title: "OWASP Top 10 Explained", downloads: 2103, type: "Video" }
                    ].map((resource, i) => (
                      <Card key={i} className="p-3 bg-content2 border border-divider">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-xs text-foreground/70">{resource.downloads} downloads</p>
                          </div>
                          <span className="text-xs bg-content3 px-2 py-1 rounded-full">
                            {resource.type}
                          </span>
                        </div>
                        <Button size="sm" variant="light" className="mt-2" startContent={<Icon icon="lucide:download" />}>
                          Download
                        </Button>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="p-4 border border-divider rounded-lg">
                    <h3 className="font-medium mb-2">Community Contributed Resources</h3>
                    <p className="text-sm text-foreground/70 mb-3">
                      Share your knowledge with the community by contributing resources.
                    </p>
                    <Button size="sm" color="primary" variant="flat" startContent={<Icon icon="lucide:upload" />}>
                      Contribute Resource
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="bg-content1 border border-divider p-4 mb-6">
            <h3 className="font-semibold mb-4">Top Contributors</h3>
            
            <div className="space-y-4">
              {members.slice(0, 5).map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${member.avatar}`}
                      size="sm"
                      name={member.name}
                    />
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-foreground/70">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{member.points}</div>
                </div>
              ))}
            </div>
            
            <Divider className="my-4" />
            
            <Button size="sm" variant="light" color="primary" className="w-full">
              View All Members
            </Button>
          </Card>
          
          <Card className="bg-content1 border border-divider p-4">
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            
            <div className="space-y-2">
              {[
                { name: "Web Security", count: 156 },
                { name: "Network Security", count: 124 },
                { name: "Binary Exploitation", count: 98 },
                { name: "Cryptography", count: 87 },
                { name: "Career Advice", count: 76 }
              ].map((category, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-content2 rounded-md cursor-pointer">
                  <span>{category.name}</span>
                  <span className="text-xs bg-content3 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};