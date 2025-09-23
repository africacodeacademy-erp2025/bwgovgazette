import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Badge, Progress, Tabs, Tab, Divider } from "@heroui/react";
    import { motion } from "framer-motion";

    interface LabDetailPageProps {
      onNavigate?: (page: string) => void;
    }

    export const LabDetailPage: React.FC<LabDetailPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("instructions");
      
      const labData = {
        title: "SQL Injection Attack Lab",
        description: "Learn how to identify and exploit SQL injection vulnerabilities in web applications.",
        difficulty: "Beginner",
        duration: "45 min",
        points: 100,
        category: "Web Security",
        progress: 35,
        objectives: [
          { title: "Understand SQL injection concepts", completed: true },
          { title: "Identify vulnerable input fields", completed: true },
          { title: "Extract database information", completed: false },
          { title: "Bypass authentication", completed: false },
          { title: "Implement prevention measures", completed: false }
        ],
        resources: [
          { title: "SQL Injection Cheat Sheet", type: "PDF" },
          { title: "Database Security Fundamentals", type: "Video" },
          { title: "Web Security Basics", type: "Article" }
        ]
      };

      return (
        <div className="min-h-screen bg-background text-foreground flex">
          {/* Sidebar */}
          <div className="w-60 fixed left-0 top-0 h-screen bg-content1 border-r border-divider flex flex-col z-40">
            {/* Sidebar content - this is just a placeholder to show the layout */}
            <div className="p-4 flex items-center h-16 border-b border-divider">
              <Icon icon="lucide:shield-alert" className="text-primary text-xl" />
              <p className="font-bold text-lg ml-2">CyberTrainer<span className="text-primary">X</span></p>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-2">
              {/* Sidebar menu items would go here */}
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col ml-60 transition-all duration-200">
            {/* Header */}
            <header className="h-16 border-b border-divider bg-content1 flex items-center justify-between px-4 sticky top-0 z-20">
              <div className="flex items-center">
                <Button
                  isIconOnly
                  variant="light"
                  className="mr-2"
                >
                  <Icon icon="lucide:menu" />
                </Button>
                <Button 
                  variant="light" 
                  color="default" 
                  className="mr-4" 
                  startContent={<Icon icon="lucide:arrow-left" />}
                  onPress={() => onNavigate && onNavigate("dashboard")}
                >
                  Back to Labs
                </Button>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {/* Rest of the lab detail content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-content1 border border-divider overflow-hidden mb-6">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h1 className="text-2xl font-bold mb-2">{labData.title}</h1>
                            <div className="flex flex-wrap gap-3 mb-4">
                              <Badge color="success" variant="flat">{labData.difficulty}</Badge>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:clock" />
                                <span>{labData.duration}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:award" />
                                <span>{labData.points} pts</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:tag" />
                                <span>{labData.category}</span>
                              </div>
                            </div>
                            <p className="text-foreground/70">{labData.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{labData.progress}%</span>
                          </div>
                          <Progress 
                            aria-label="Lab progress" 
                            value={labData.progress} 
                            color="primary"
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            color="primary" 
                            startContent={<Icon icon="lucide:play" />}
                          >
                            Launch Lab Environment
                          </Button>
                          <Button 
                            variant="flat" 
                            color="default" 
                            startContent={<Icon icon="lucide:book-open" />}
                          >
                            View Guide
                          </Button>
                          <Button 
                            variant="light" 
                            color="default" 
                            startContent={<Icon icon="lucide:flag" />}
                          >
                            Submit Flag
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-content1 border border-divider overflow-hidden">
                      <Tabs 
                        aria-label="Lab content tabs" 
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab as any}
                        classNames={{
                          tabList: "bg-content2 p-1",
                          cursor: "bg-content3",
                          tab: "data-[selected=true]:text-primary"
                        }}
                      >
                        <Tab key="instructions" title="Instructions">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Lab Instructions</h2>
                            
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-lg font-medium mb-2">Overview</h3>
                                <p className="text-foreground/70 mb-4">
                                  In this lab, you will learn how to identify and exploit SQL injection vulnerabilities in web applications.
                                  SQL injection is a code injection technique that exploits vulnerabilities in the database layer of an application.
                                </p>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-2">Objectives</h3>
                                <div className="space-y-3">
                                  {labData.objectives.map((objective, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      {objective.completed ? (
                                        <Icon icon="lucide:check-circle" className="text-success" />
                                      ) : (
                                        <Icon icon="lucide:circle" className="text-foreground/50" />
                                      )}
                                      <span className={objective.completed ? "line-through text-foreground/70" : ""}>
                                        {objective.title}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-2">Step 1: Understanding SQL Injection</h3>
                                <p className="text-foreground/70 mb-4">
                                  SQL injection occurs when user input is incorrectly filtered and directly included in SQL queries.
                                  This can allow attackers to manipulate the database and potentially access, modify, or delete data.
                                </p>
                                <div className="bg-content2 p-4 rounded-lg mb-4">
                                  <p className="font-mono text-sm">
                                    SELECT * FROM users WHERE username = 'INPUT' AND password = 'INPUT'
                                  </p>
                                </div>
                                <p className="text-foreground/70">
                                  If the input is not properly sanitized, an attacker could input something like:
                                  <span className="font-mono text-sm block mt-2 bg-content2 p-2 rounded-lg">
                                    admin' --
                                  </span>
                                  This would change the query to:
                                  <span className="font-mono text-sm block mt-2 bg-content2 p-2 rounded-lg">
                                    SELECT * FROM users WHERE username = 'admin' -- ' AND password = 'anything'
                                  </span>
                                  The -- is a comment in SQL, which causes the rest of the query to be ignored.
                                </p>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-2">Step 2: Identifying Vulnerable Input Fields</h3>
                                <p className="text-foreground/70 mb-4">
                                  In the lab environment, you'll find a simple web application with a login form.
                                  Your task is to identify if the login form is vulnerable to SQL injection.
                                </p>
                                <p className="text-foreground/70">
                                  Try entering special characters like single quotes ('), double quotes ("), or semicolons (;) 
                                  in the input fields and observe how the application responds.
                                </p>
                              </div>
                              
                              <div className="flex justify-between">
                                <Button variant="light" color="default" disabled>
                                  Previous Step
                                </Button>
                                <Button color="primary">
                                  Next Step
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab key="resources" title="Resources">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Lab Resources</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {labData.resources.map((resource, index) => (
                                <Card key={index} className="p-4 bg-content2 border border-divider">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium">{resource.title}</h3>
                                    <Badge variant="flat" color="default">{resource.type}</Badge>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="light" 
                                    color="primary" 
                                    startContent={<Icon icon="lucide:download" />}
                                  >
                                    Download
                                  </Button>
                                </Card>
                              ))}
                            </div>
                            
                            <div className="mt-6">
                              <h3 className="text-lg font-medium mb-3">Additional Resources</h3>
                              <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                  <Icon icon="lucide:external-link" className="text-primary" />
                                  <a href="#" className="text-primary hover:underline">OWASP SQL Injection Prevention Cheat Sheet</a>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Icon icon="lucide:external-link" className="text-primary" />
                                  <a href="#" className="text-primary hover:underline">SQL Injection Attack Examples</a>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Icon icon="lucide:external-link" className="text-primary" />
                                  <a href="#" className="text-primary hover:underline">Database Security Best Practices</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </Tab>
                        <Tab key="discussion" title="Discussion">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Lab Discussion</h2>
                            
                            <div className="space-y-4">
                              {[
                                { 
                                  user: "John Doe", 
                                  avatar: 11, 
                                  time: "2 hours ago", 
                                  content: "I'm stuck on extracting the database version. Any hints?" 
                                },
                                { 
                                  user: "Jane Doe", 
                                  avatar: 12, 
                                  time: "1 hour ago", 
                                  content: "Try using the UNION SELECT statement with version() or @@version depending on the database type." 
                                },
                                { 
                                  user: "John Doe Jr.", 
                                  avatar: 13, 
                                  time: "30 minutes ago", 
                                  content: "Thanks! That worked. Now I'm trying to figure out how to list all the tables." 
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
                            
                            <div className="mt-6">
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
                    <Card className="bg-content1 border border-divider p-4 mb-6">
                      <h2 className="text-lg font-semibold mb-3">Lab Environment</h2>
                      
                      <div className="p-3 border border-success/30 rounded-lg bg-success/10 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                          <h3 className="font-medium">Active Environment</h3>
                        </div>
                        <p className="text-sm text-foreground/70 mb-3">Running - 25 minutes</p>
                        <div className="flex gap-2">
                          <Button size="sm" color="success" variant="flat">
                            Connect
                          </Button>
                          <Button size="sm" variant="light" color="danger">
                            Stop
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Time Remaining</span>
                          <span className="text-sm font-medium">1h 35m</span>
                        </div>
                        <Progress 
                          aria-label="Time remaining" 
                          value={65} 
                          color="warning"
                        />
                      </div>
                      
                      <Divider className="my-4" />
                      
                      <h3 className="font-medium mb-2">Environment Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Type</span>
                          <span>Web Application</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">IP Address</span>
                          <span>10.10.10.10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Port</span>
                          <span>80, 443</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Username</span>
                          <span>student</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Password</span>
                          <span>cybersec123</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-4" 
                        color="primary" 
                        variant="flat"
                        startContent={<Icon icon="lucide:refresh" />}
                      >
                        Reset Environment
                      </Button>
                    </Card>
                    
                    <Card className="bg-content1 border border-divider p-4">
                      <h2 className="text-lg font-semibold mb-3">Your Progress</h2>
                      
                      <div className="space-y-3 mb-4">
                        {labData.objectives.map((objective, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {objective.completed ? (
                              <Icon icon="lucide:check-circle" className="text-success" />
                            ) : (
                              <Icon icon="lucide:circle" className="text-foreground/50" />
                            )}
                            <span className={objective.completed ? "line-through text-foreground/70" : ""}>
                              {objective.title}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Divider className="my-4" />
                      
                      <h3 className="font-medium mb-2">Need Help?</h3>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="default" 
                          className="w-full"
                          startContent={<Icon icon="lucide:help-circle" />}
                        >
                          View Hints
                        </Button>
                        <Button 
                          size="sm" 
                          variant="light" 
                          color="default" 
                          className="w-full"
                          startContent={<Icon icon="lucide:message-circle" />}
                        >
                          Ask in Community
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    };