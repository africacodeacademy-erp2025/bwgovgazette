import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Badge, Tabs, Tab, Input, Radio, RadioGroup, Divider } from "@heroui/react";
    import { motion } from "framer-motion";

    interface EnvironmentPageProps {
      onNavigate?: (page: string) => void;
    }

    export const EnvironmentPage: React.FC<EnvironmentPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("new");
      const [selectedTemplate, setSelectedTemplate] = React.useState("kali");
      const [selectedDuration, setSelectedDuration] = React.useState("2h");
      
      const templates = [
        {
          id: "kali",
          name: "Kali Linux",
          description: "Full-featured penetration testing environment with pre-installed security tools.",
          icon: "logos:kali-linux",
          category: "Offensive Security"
        },
        {
          id: "ubuntu",
          name: "Ubuntu Server",
          description: "Clean Ubuntu server environment for custom configurations and testing.",
          icon: "logos:ubuntu",
          category: "General Purpose"
        },
        {
          id: "windows",
          name: "Windows Server",
          description: "Windows Server environment for testing Windows-specific vulnerabilities.",
          icon: "logos:microsoft-windows",
          category: "Windows Security"
        },
        {
          id: "metasploitable",
          name: "Metasploitable",
          description: "Intentionally vulnerable Linux virtual machine for security training.",
          icon: "lucide:bug",
          category: "Vulnerable Systems"
        },
        {
          id: "owasp",
          name: "OWASP Juice Shop",
          description: "Modern vulnerable web application for web security training.",
          icon: "lucide:shopping-cart",
          category: "Web Security"
        },
        {
          id: "dvwa",
          name: "DVWA",
          description: "Damn Vulnerable Web Application for practicing web attacks.",
          icon: "lucide:globe",
          category: "Web Security"
        }
      ];
      
      const activeEnvironments = [
        {
          name: "Kali Linux VM",
          status: "Running",
          timeRemaining: "1h 45m",
          ipAddress: "10.10.10.5",
          ports: "22, 80, 443",
          createdAt: "Today, 10:30 AM"
        },
        {
          name: "OWASP Juice Shop",
          status: "Running",
          timeRemaining: "45m",
          ipAddress: "10.10.10.10",
          ports: "80, 3000",
          createdAt: "Today, 11:15 AM"
        }
      ];
      
      const savedEnvironments = [
        {
          name: "Web Pentesting Setup",
          description: "Kali Linux with additional web testing tools",
          lastUsed: "Yesterday",
          category: "Web Security"
        },
        {
          name: "Network Analysis Environment",
          description: "Specialized setup for network traffic analysis",
          lastUsed: "3 days ago",
          category: "Network Security"
        }
      ];

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
                  Back to Dashboard
                </Button>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {/* Rest of the environment page content */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Lab Environments</h1>
                    <p className="text-foreground/70">Create and manage your virtual lab environments</p>
                  </div>
                </div>
                
                <Card className="bg-content1 border border-divider overflow-hidden mb-6">
                  <Tabs 
                    aria-label="Environment tabs" 
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab as any}
                    classNames={{
                      tabList: "bg-content2 p-1",
                      cursor: "bg-content3",
                      tab: "data-[selected=true]:text-primary"
                    }}
                  >
                    <Tab key="active" title="Active Environments">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeEnvironments.map((env, index) => (
                            <Card key={index} className="p-4 bg-content2 border border-divider">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold">{env.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                    <span className="text-sm">{env.status}</span>
                                  </div>
                                </div>
                                <Badge color="warning" variant="flat">
                                  {env.timeRemaining} remaining
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">IP Address</span>
                                  <span>{env.ipAddress}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">Ports</span>
                                  <span>{env.ports}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">Created</span>
                                  <span>{env.createdAt}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  color="primary" 
                                  variant="flat" 
                                  className="flex-1"
                                  startContent={<Icon icon="lucide:terminal" />}
                                >
                                  Connect
                                </Button>
                                <Button 
                                  color="danger" 
                                  variant="light" 
                                  className="flex-1"
                                  startContent={<Icon icon="lucide:power" />}
                                >
                                  Stop
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                        
                        {activeEnvironments.length === 0 && (
                          <div className="text-center py-12">
                            <Icon icon="lucide:server-off" className="text-foreground/30 text-5xl mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Active Environments</h3>
                            <p className="text-foreground/70 mb-4">You don't have any running lab environments.</p>
                            <Button 
                              color="primary" 
                              onPress={() => setSelectedTab("new")}
                            >
                              Launch New Environment
                            </Button>
                          </div>
                        )}
                      </div>
                    </Tab>
                    <Tab key="new" title="Launch New Environment">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6">Create New Lab Environment</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <h3 className="text-lg font-medium mb-4">Select Environment Template</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              {templates.map((template) => (
                                <Card 
                                  key={template.id}
                                  isPressable
                                  className={`p-4 border ${selectedTemplate === template.id ? 'border-primary' : 'border-divider'}`}
                                  onPress={() => setSelectedTemplate(template.id)}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-content2">
                                      <Icon icon={template.icon} className="text-2xl" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{template.name}</h4>
                                      <p className="text-xs text-foreground/70 mb-2">{template.description}</p>
                                      <Badge variant="flat" color="default" size="sm">
                                        {template.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                            
                            <h3 className="text-lg font-medium mb-4">Environment Configuration</h3>
                            
                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-medium mb-2">Environment Name</label>
                                <Input 
                                  placeholder="My Lab Environment" 
                                  defaultValue={templates.find(t => t.id === selectedTemplate)?.name}
                                  classNames={{
                                    input: "text-foreground",
                                    inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2",
                                    label: "text-foreground"
                                  }}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">Duration</label>
                                <RadioGroup 
                                  orientation="horizontal" 
                                  value={selectedDuration}
                                  onValueChange={setSelectedDuration}
                                >
                                  <Radio value="1h">1 hour</Radio>
                                  <Radio value="2h">2 hours</Radio>
                                  <Radio value="4h">4 hours</Radio>
                                  <Radio value="8h">8 hours</Radio>
                                </RadioGroup>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">Resources</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Card className="p-3 bg-content2 border border-divider">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm">CPU</span>
                                      <Badge variant="flat" color="default">2 cores</Badge>
                                    </div>
                                    <input 
                                      type="range" 
                                      min="1" 
                                      max="8" 
                                      defaultValue="2" 
                                      className="w-full h-1 bg-content3 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                  </Card>
                                  <Card className="p-3 bg-content2 border border-divider">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm">RAM</span>
                                      <Badge variant="flat" color="default">4 GB</Badge>
                                    </div>
                                    <input 
                                      type="range" 
                                      min="1" 
                                      max="16" 
                                      defaultValue="4" 
                                      className="w-full h-1 bg-content3 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                  </Card>
                                  <Card className="p-3 bg-content2 border border-divider">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm">Storage</span>
                                      <Badge variant="flat" color="default">20 GB</Badge>
                                    </div>
                                    <input 
                                      type="range" 
                                      min="10" 
                                      max="100" 
                                      defaultValue="20" 
                                      className="w-full h-1 bg-content3 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                  </Card>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">Network Configuration</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs text-foreground/70 mb-1">Network Type</label>
                                    <select className="w-full p-2 rounded-lg bg-content2 border border-divider text-foreground">
                                      <option>Isolated Network</option>
                                      <option>Internet Access</option>
                                      <option>Custom Network</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-foreground/70 mb-1">Exposed Ports</label>
                                    <Input 
                                      placeholder="22, 80, 443" 
                                      defaultValue="22, 80, 443" 
                                      classNames={{
                                        input: "text-foreground",
                                        inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2",
                                        label: "text-foreground"
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="flat" 
                                  color="default"
                                  onPress={() => onNavigate && onNavigate("dashboard")}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  color="primary"
                                  startContent={<Icon icon="lucide:play" />}
                                  onPress={() => onNavigate && onNavigate("lab-detail")}
                                >
                                  Launch Environment
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Card className="p-4 bg-content1 border border-divider sticky top-20">
                              <h3 className="font-medium mb-4">Environment Summary</h3>
                              
                              <div className="space-y-3 text-sm mb-4">
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">Template</span>
                                  <span>{templates.find(t => t.id === selectedTemplate)?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">Duration</span>
                                  <span>{selectedDuration === "1h" ? "1 hour" : selectedDuration === "2h" ? "2 hours" : selectedDuration === "4h" ? "4 hours" : "8 hours"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">Resources</span>
                                  <span>2 CPU, 4GB RAM, 20GB Storage</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">Network</span>
                                  <span>Isolated Network</span>
                                </div>
                              </div>
                              
                              <Divider className="my-4" />
                              
                              <div className="space-y-3 text-sm mb-4">
                                <div className="flex justify-between font-medium">
                                  <span>Credit Usage</span>
                                  <span>4 credits</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground/70">Your Balance</span>
                                  <span>25 credits</span>
                                </div>
                              </div>
                              
                              <Button 
                                color="primary" 
                                className="w-full"
                                startContent={<Icon icon="lucide:play" />}
                                onPress={() => onNavigate && onNavigate("lab-detail")}
                              >
                                Launch Environment
                              </Button>
                              
                              <div className="mt-4 text-center">
                                <Button 
                                  variant="light" 
                                  color="primary" 
                                  size="sm"
                                  onPress={() => onNavigate && onNavigate("upgrade")}
                                >
                                  Need more credits?
                                </Button>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab key="saved" title="Saved Environments">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {savedEnvironments.map((env, index) => (
                            <Card key={index} className="p-4 bg-content2 border border-divider">
                              <h3 className="font-semibold mb-1">{env.name}</h3>
                              <p className="text-sm text-foreground/70 mb-3">{env.description}</p>
                              
                              <div className="flex justify-between text-sm mb-4">
                                <Badge variant="flat" color="default">
                                  {env.category}
                                </Badge>
                                <span className="text-foreground/70">Last used: {env.lastUsed}</span>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  color="primary" 
                                  variant="flat" 
                                  className="flex-1"
                                  startContent={<Icon icon="lucide:play" />}
                                  onPress={() => onNavigate && onNavigate("lab-detail")}
                                >
                                  Launch
                                </Button>
                                <Button 
                                  color="default" 
                                  variant="light" 
                                  className="flex-1"
                                  startContent={<Icon icon="lucide:edit" />}
                                >
                                  Edit
                                </Button>
                              </div>
                            </Card>
                          ))}
                          
                          <Card className="p-4 border border-dashed border-divider flex flex-col items-center justify-center text-center">
                            <Icon icon="lucide:plus" className="text-foreground/50 text-2xl mb-2" />
                            <h3 className="font-medium mb-1">Save Current Environment</h3>
                            <p className="text-sm text-foreground/70 mb-3">
                              Save your current environment configuration for future use
                            </p>
                            <Button 
                              color="primary" 
                              variant="light"
                              onPress={() => setSelectedTab("new")}
                            >
                              Create New
                            </Button>
                          </Card>
                        </div>
                        
                        {savedEnvironments.length === 0 && (
                          <div className="text-center py-12">
                            <Icon icon="lucide:save" className="text-foreground/30 text-5xl mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Saved Environments</h3>
                            <p className="text-foreground/70 mb-4">You haven't saved any environment configurations yet.</p>
                            <Button 
                              color="primary" 
                              onPress={() => setSelectedTab("new")}
                            >
                              Create New Environment
                            </Button>
                          </div>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </Card>
                
                <Card className="bg-content1 border border-divider p-4">
                  <h2 className="text-lg font-semibold mb-4">Environment Usage Tips</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border border-divider rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:clock" className="text-primary" />
                        <h3 className="font-medium">Time Management</h3>
                      </div>
                      <p className="text-sm text-foreground/70">
                        Environments automatically shut down after the selected duration to save resources.
                      </p>
                    </div>
                    
                    <div className="p-3 border border-divider rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:save" className="text-primary" />
                        <h3 className="font-medium">Save Your Work</h3>
                      </div>
                      <p className="text-sm text-foreground/70">
                        Remember to save your work before the environment shuts down.
                      </p>
                    </div>
                    
                    <div className="p-3 border border-divider rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:shield" className="text-primary" />
                        <h3 className="font-medium">Security First</h3>
                      </div>
                      <p className="text-sm text-foreground/70">
                        All environments are isolated by default for security purposes.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </main>
          </div>
        </div>
      );
    };