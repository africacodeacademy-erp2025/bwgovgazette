import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Badge, Progress, Tabs, Tab, Divider } from "@heroui/react";
    import { motion } from "framer-motion";

    interface LearningPathDetailPageProps {
      onNavigate?: (page: string) => void;
    }

    export const LearningPathDetailPage: React.FC<LearningPathDetailPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("overview");
      
      const pathData = {
        title: "Web Application Security",
        description: "Master web application security concepts and techniques to identify, exploit, and mitigate vulnerabilities in web applications.",
        progress: 65,
        modules: 12,
        completed: 8,
        estimatedTime: "40 hours",
        level: "Intermediate",
        instructor: "John Doe",
        category: "Security Testing",
        skills: ["SQL Injection", "XSS", "CSRF", "Authentication Bypass", "Session Management", "Input Validation"],
        modules: [
          {
            title: "Introduction to Web Security",
            description: "Learn the fundamentals of web application security and common vulnerabilities.",
            duration: "2 hours",
            status: "completed"
          },
          {
            title: "Understanding the OWASP Top 10",
            description: "Explore the most critical web application security risks according to OWASP.",
            duration: "4 hours",
            status: "completed"
          },
          {
            title: "Client-Side Attacks",
            description: "Learn about XSS, CSRF, and other client-side vulnerabilities.",
            duration: "6 hours",
            status: "completed"
          },
          {
            title: "Server-Side Vulnerabilities",
            description: "Explore SQL injection, command injection, and other server-side attacks.",
            duration: "8 hours",
            status: "completed"
          },
          {
            title: "Authentication and Session Management",
            description: "Learn how to identify and exploit authentication vulnerabilities.",
            duration: "6 hours",
            status: "in-progress"
          },
          {
            title: "Secure Coding Practices",
            description: "Implement secure coding techniques to prevent common vulnerabilities.",
            duration: "4 hours",
            status: "not-started"
          },
          {
            title: "Web Application Firewalls",
            description: "Learn how to configure and bypass web application firewalls.",
            duration: "3 hours",
            status: "not-started"
          },
          {
            title: "API Security",
            description: "Understand common API vulnerabilities and how to secure them.",
            duration: "5 hours",
            status: "not-started"
          }
        ]
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

      return (
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="light" 
            color="default" 
            className="mb-6" 
            startContent={<Icon icon="lucide:arrow-left" />}
            onPress={() => onNavigate && onNavigate("dashboard")}
          >
            Back to Learning Paths
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-content1 border border-divider overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{pathData.title}</h1>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Badge color="warning" variant="flat">{pathData.level}</Badge>
                        <div className="flex items-center gap-1 text-sm text-foreground/70">
                          <Icon icon="lucide:clock" />
                          <span>{pathData.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-foreground/70">
                          <Icon icon="lucide:book-open" />
                          <span>{pathData.modules.length} modules</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-foreground/70">
                          <Icon icon="lucide:tag" />
                          <span>{pathData.category}</span>
                        </div>
                      </div>
                      <p className="text-foreground/70">{pathData.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{pathData.progress}%</span>
                    </div>
                    <Progress 
                      aria-label="Learning path progress" 
                      value={pathData.progress} 
                      color="primary"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      color="primary" 
                      startContent={<Icon icon="lucide:play" />}
                      onPress={() => onNavigate && onNavigate("course-detail")}
                    >
                      Continue Learning
                    </Button>
                    <Button 
                      variant="flat" 
                      color="default" 
                      startContent={<Icon icon="lucide:download" />}
                    >
                      Download Resources
                    </Button>
                    <Button 
                      variant="light" 
                      color="default" 
                      startContent={<Icon icon="lucide:share-2" />}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-content1 border border-divider overflow-hidden">
                <Tabs 
                  aria-label="Learning path tabs" 
                  selectedKey={selectedTab}
                  onSelectionChange={setSelectedTab as any}
                  classNames={{
                    tabList: "bg-content2 p-1",
                    cursor: "bg-content3",
                    tab: "data-[selected=true]:text-primary"
                  }}
                >
                  <Tab key="overview" title="Overview">
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold mb-4">About This Learning Path</h2>
                          <p className="text-foreground/70 mb-4">
                            This comprehensive learning path will take you from the basics of web application security
                            to advanced exploitation and defense techniques. You'll learn how to identify, exploit, and
                            mitigate common web vulnerabilities through hands-on labs and practical exercises.
                          </p>
                          <p className="text-foreground/70">
                            By the end of this path, you'll be able to conduct thorough web application security assessments,
                            identify vulnerabilities, and implement effective security controls to protect web applications.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Skills You'll Gain</h3>
                          <div className="flex flex-wrap gap-2">
                            {pathData.skills.map((skill, index) => (
                              <Badge key={index} variant="flat" color="default">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Prerequisites</h3>
                          <ul className="list-disc pl-5 space-y-1 text-foreground/70">
                            <li>Basic understanding of web technologies (HTML, CSS, JavaScript)</li>
                            <li>Familiarity with HTTP protocol</li>
                            <li>Basic programming knowledge</li>
                            <li>Understanding of networking concepts</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">What's Included</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon icon="lucide:video" className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Video Lessons</h4>
                                <p className="text-sm text-foreground/70">25+ hours of video content</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon icon="lucide:server" className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Hands-on Labs</h4>
                                <p className="text-sm text-foreground/70">15 interactive lab environments</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon icon="lucide:file-text" className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Downloadable Resources</h4>
                                <p className="text-sm text-foreground/70">Cheat sheets and reference guides</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon icon="lucide:award" className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Certification</h4>
                                <p className="text-sm text-foreground/70">Path completion certificate</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="modules" title="Modules">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Learning Path Modules</h2>
                      
                      <div className="space-y-4">
                        {pathData.modules.map((module, index) => (
                          <Card key={index} className={`p-4 border ${module.status === "in-progress" ? "border-primary" : "border-divider"}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="mt-1">{getStatusIcon(module.status)}</div>
                                <div>
                                  <h3 className="font-medium mb-1">{module.title}</h3>
                                  <p className="text-sm text-foreground/70 mb-2">{module.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-foreground/70">
                                    <div className="flex items-center gap-1">
                                      <Icon icon="lucide:clock" />
                                      <span>{module.duration}</span>
                                    </div>
                                    <span>{getStatusText(module.status)}</span>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                color={module.status === "in-progress" ? "primary" : "default"}
                                variant={module.status === "in-progress" ? "solid" : "flat"}
                                onPress={() => onNavigate && onNavigate("course-detail")}
                              >
                                {module.status === "completed" ? "Review" : module.status === "in-progress" ? "Continue" : "Start"}
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </Tab>
                  <Tab key="resources" title="Resources">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {[
                          { title: "Web Security Cheat Sheet", type: "PDF", size: "2.4 MB" },
                          { title: "OWASP Top 10 Guide", type: "PDF", size: "3.1 MB" },
                          { title: "SQL Injection Techniques", type: "PDF", size: "1.8 MB" },
                          { title: "XSS Attack Vectors", type: "PDF", size: "2.2 MB" }
                        ].map((resource, index) => (
                          <Card key={index} className="p-4 bg-content2 border border-divider">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{resource.title}</h3>
                              <Badge variant="flat" color="default">{resource.type}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-foreground/70">{resource.size}</span>
                              <Button 
                                size="sm" 
                                variant="light" 
                                color="primary" 
                                startContent={<Icon icon="lucide:download" />}
                              >
                                Download
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-medium mb-3">Recommended Tools</h3>
                      <div className="space-y-3 mb-6">
                        {[
                          { name: "Burp Suite", description: "Web vulnerability scanner and proxy tool" },
                          { name: "OWASP ZAP", description: "Open-source web application security scanner" },
                          { name: "SQLmap", description: "Automatic SQL injection and database takeover tool" },
                          { name: "Nikto", description: "Web server scanner for dangerous files and outdated software" }
                        ].map((tool, index) => (
                          <div key={index} className="p-3 border border-divider rounded-lg">
                            <h4 className="font-medium mb-1">{tool.name}</h4>
                            <p className="text-sm text-foreground/70">{tool.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-medium mb-3">External Resources</h3>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center gap-2 text-primary hover:underline">
                          <Icon icon="lucide:external-link" />
                          <span>OWASP Web Security Testing Guide</span>
                        </a>
                        <a href="#" className="flex items-center gap-2 text-primary hover:underline">
                          <Icon icon="lucide:external-link" />
                          <span>PortSwigger Web Security Academy</span>
                        </a>
                        <a href="#" className="flex items-center gap-2 text-primary hover:underline">
                          <Icon icon="lucide:external-link" />
                          <span>Mozilla Web Security Guidelines</span>
                        </a>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="discussion" title="Discussion">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Learning Path Discussion</h2>
                      
                      <div className="space-y-4 mb-6">
                        {[
                          { 
                            user: "John Doe", 
                            avatar: 11, 
                            time: "2 days ago", 
                            content: "I'm having trouble with the SQL injection lab in module 4. Any tips on how to bypass the WAF?" 
                          },
                          { 
                            user: "Jane Doe", 
                            avatar: 12, 
                            time: "1 day ago", 
                            content: "Try using different encoding techniques like URL encoding or hex encoding. The WAF might be looking for specific patterns." 
                          },
                          { 
                            user: "John Doe Jr.", 
                            avatar: 13, 
                            time: "12 hours ago", 
                            content: "Thanks for the tip! I was able to bypass it using hex encoding. The lab was really helpful in understanding how WAFs work." 
                          }
                        ].map((comment, index) => (
                          <div key={index} className="p-4 border border-divider rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <img 
                                src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${comment.avatar}`}
                                alt={comment.user}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium">{comment.user}</p>
                                <p className="text-xs text-foreground/70">{comment.time}</p>
                              </div>
                            </div>
                            <p className="text-foreground/90">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Add Your Comment</h3>
                        <textarea 
                          className="w-full p-3 rounded-lg bg-content2 border border-divider focus:outline-none focus:border-primary transition-colors"
                          rows={4}
                          placeholder="Share your thoughts or ask questions..."
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <Button color="primary" size="sm">
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </Card>
            </div>
            
            <div>
              <Card className="bg-content1 border border-divider p-4 mb-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-3">Your Progress</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Completion</span>
                    <span>{pathData.progress}%</span>
                  </div>
                  <Progress 
                    aria-label="Learning path progress" 
                    value={pathData.progress} 
                    color="primary"
                  />
                </div>
                
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Modules Completed</span>
                    <span>{pathData.completed}/{pathData.modules.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Time Left</span>
                    <span>14 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Points Earned</span>
                    <span>650</span>
                  </div>
                </div>
                
                <Button 
                  color="primary" 
                  className="w-full mb-3"
                  startContent={<Icon icon="lucide:play" />}
                  onPress={() => onNavigate && onNavigate("course-detail")}
                >
                  Continue Learning
                </Button>
                
                <Button 
                  variant="flat" 
                  color="default" 
                  className="w-full"
                  startContent={<Icon icon="lucide:calendar" />}
                >
                  Set Learning Schedule
                </Button>
                
                <Divider className="my-4" />
                
                <h3 className="font-medium mb-2">Next Up</h3>
                <div className="p-3 border border-primary/30 rounded-lg bg-primary/5">
                  <h4 className="font-medium mb-1">Authentication and Session Management</h4>
                  <div className="flex justify-between text-xs text-foreground/70 mb-2">
                    <span>Module 5 of 8</span>
                    <span>6 hours</span>
                  </div>
                  <Button 
                    size="sm" 
                    color="primary" 
                    variant="flat" 
                    className="w-full"
                    onPress={() => onNavigate && onNavigate("course-detail")}
                  >
                    Continue
                  </Button>
                </div>
              </Card>
              
              <Card className="bg-content1 border border-divider p-4">
                <h2 className="text-lg font-semibold mb-3">Instructor</h2>
                
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="https://img.heroui.chat/image/avatar?w=80&h=80&u=25"
                    alt="John Doe"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-xs text-foreground/70">Security Researcher & Educator</p>
                  </div>
                </div>
                
                <p className="text-sm text-foreground/70 mb-3">
                  John is a cybersecurity expert with over 10 years of experience in web application security.
                  He has conducted security assessments for Fortune 500 companies and is a regular speaker at security conferences.
                </p>
                
                <Button 
                  variant="light" 
                  color="default" 
                  size="sm" 
                  className="w-full"
                  startContent={<Icon icon="lucide:message-square" />}
                >
                  Message Instructor
                </Button>
              </Card>
            </div>
          </div>
        </div>
      );
    };