import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Tabs, Tab, Badge, Divider, Input } from "@heroui/react";
    import { motion } from "framer-motion";

    interface SimulationsPageProps {
      onNavigate?: (page: string) => void;
    }

    export const SimulationsPage: React.FC<SimulationsPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("terminal");
      const [terminalInput, setTerminalInput] = React.useState("");
      const [terminalHistory, setTerminalHistory] = React.useState<{type: string, content: string}[]>([
        { type: "system", content: "Welcome to the Linux Command Line Simulation!" },
        { type: "system", content: "This simulation will guide you through basic Linux commands." },
        { type: "system", content: "Type 'help' to see available commands or 'start' to begin the tutorial." }
      ]);
      const [currentStep, setCurrentStep] = React.useState(0);
      const [webAppInput, setWebAppInput] = React.useState("");
      const [webAppResult, setWebAppResult] = React.useState<string | null>(null);
      
      const tutorialSteps = [
        {
          command: "ls",
          description: "List directory contents",
          expectedOutput: "documents  downloads  pictures  secret.txt",
          hint: "Type 'ls' to list all files and directories in the current location."
        },
        {
          command: "cat secret.txt",
          description: "View the contents of secret.txt",
          expectedOutput: "Congratulations! You found the first flag: CTF{b4s1c_c0mm4nd5}",
          hint: "Use the 'cat' command to view the contents of a file."
        },
        {
          command: "cd documents",
          description: "Change directory to 'documents'",
          expectedOutput: "Changed directory to: documents",
          hint: "Use the 'cd' command followed by a directory name to navigate to that directory."
        },
        {
          command: "ls -la",
          description: "List all files including hidden ones",
          expectedOutput: "total 12\ndrwxr-xr-x 2 user user 4096 Jun 10 12:34 .\ndrwxr-xr-x 5 user user 4096 Jun 10 12:34 ..\n-rw-r--r-- 1 user user    0 Jun 10 12:34 file1.txt\n-rw-r--r-- 1 user user    0 Jun 10 12:34 file2.txt\n-rw-r--r-- 1 user user   42 Jun 10 12:34 .hidden_file",
          hint: "Use 'ls' with the '-la' flags to show all files, including hidden ones (those starting with a dot)."
        },
        {
          command: "cat .hidden_file",
          description: "View the contents of the hidden file",
          expectedOutput: "You found the second flag: CTF{h1dd3n_f1l3s_4r3_fun}",
          hint: "Use the 'cat' command to view the hidden file you discovered."
        }
      ];
      
      const sqlInjectionTests = [
        { input: "' OR '1'='1", result: "SQL Injection detected! This would bypass login authentication by making the WHERE clause always true." },
        { input: "admin' --", result: "SQL Injection detected! This would comment out the password check in the query." },
        { input: "'; DROP TABLE users; --", result: "SQL Injection detected! This would attempt to delete the users table." },
        { input: "' UNION SELECT username,password FROM users --", result: "SQL Injection detected! This would attempt to extract all usernames and passwords." }
      ];
      
      const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const input = terminalInput.trim();
        
        // Add user input to history
        setTerminalHistory(prev => [...prev, { type: "user", content: `$ ${input}` }]);
        
        // Process commands
        if (input === "help") {
          setTerminalHistory(prev => [...prev, { 
            type: "system", 
            content: "Available commands: help, clear, start, ls, cd, cat, pwd, whoami, echo" 
          }]);
        } else if (input === "clear") {
          setTerminalHistory([{ 
            type: "system", 
            content: "Terminal cleared. Type 'help' for available commands." 
          }]);
        } else if (input === "start") {
          setCurrentStep(0);
          setTerminalHistory(prev => [...prev, { 
            type: "system", 
            content: `Tutorial started. ${tutorialSteps[0].description}` 
          }, {
            type: "hint",
            content: tutorialSteps[0].hint
          }]);
        } else {
          // Check if the input matches the expected command for the current step
          if (currentStep < tutorialSteps.length && input === tutorialSteps[currentStep].command) {
            setTerminalHistory(prev => [...prev, { 
              type: "output", 
              content: tutorialSteps[currentStep].expectedOutput 
            }]);
            
            // Move to next step if available
            if (currentStep < tutorialSteps.length - 1) {
              const nextStep = currentStep + 1;
              setCurrentStep(nextStep);
              setTerminalHistory(prev => [...prev, { 
                type: "system", 
                content: `Great job! Next: ${tutorialSteps[nextStep].description}` 
              }, {
                type: "hint",
                content: tutorialSteps[nextStep].hint
              }]);
            } else {
              setTerminalHistory(prev => [...prev, { 
                type: "system", 
                content: "Congratulations! You've completed the Linux command tutorial!" 
              }]);
            }
          } else {
            // Handle other commands or incorrect input
            setTerminalHistory(prev => [...prev, { 
              type: "error", 
              content: `Command not recognized or incorrect for current step. Type 'help' for available commands or check the hint.` 
            }]);
          }
        }
        
        setTerminalInput("");
      };
      
      const handleWebAppTest = (e: React.FormEvent) => {
        e.preventDefault();
        const input = webAppInput.trim();
        
        // Check if input matches any of the SQL injection patterns
        const matchedTest = sqlInjectionTests.find(test => 
          input.toLowerCase().includes(test.input.toLowerCase())
        );
        
        if (matchedTest) {
          setWebAppResult(matchedTest.result);
        } else if (input.includes("'") || input.includes("\"") || input.includes(";")) {
          setWebAppResult("Potential SQL injection attempt detected. Try a more specific payload.");
        } else {
          setWebAppResult("No SQL injection detected in this input.");
        }
      };
      
      const simulations = [
        {
          title: "Linux Command Line Basics",
          description: "Learn essential Linux commands through an interactive terminal simulation.",
          difficulty: "Beginner",
          category: "Linux",
          duration: "15 min",
          tab: "terminal"
        },
        {
          title: "SQL Injection Testing",
          description: "Practice identifying and exploiting SQL injection vulnerabilities.",
          difficulty: "Intermediate",
          category: "Web Security",
          duration: "20 min",
          tab: "webapp"
        },
        {
          title: "Network Traffic Analysis",
          description: "Analyze packet captures to identify suspicious activities.",
          difficulty: "Advanced",
          category: "Network",
          duration: "30 min",
          tab: "network",
          comingSoon: true
        },
        {
          title: "Password Cracking",
          description: "Learn techniques to crack password hashes.",
          difficulty: "Intermediate",
          category: "Cryptography",
          duration: "25 min",
          tab: "crypto",
          comingSoon: true
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
                <h1 className="text-xl font-semibold">Interactive Simulations</h1>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <p className="text-foreground/70">Practice your cybersecurity skills with hands-on interactive simulations</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {simulations.map((sim, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`p-4 border border-divider h-full ${!sim.comingSoon ? 'cursor-pointer' : ''}`}
                        isPressable={!sim.comingSoon}
                        onPress={() => !sim.comingSoon && setSelectedTab(sim.tab)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <Badge color={getDifficultyColor(sim.difficulty)} variant="flat">
                            {sim.difficulty}
                          </Badge>
                          {sim.comingSoon && (
                            <Badge color="default" variant="flat">Coming Soon</Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{sim.title}</h3>
                        <p className="text-sm text-foreground/70 mb-4">{sim.description}</p>
                        
                        <div className="flex justify-between text-sm text-foreground/70 mt-auto">
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:tag" />
                            <span>{sim.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:clock" />
                            <span>{sim.duration}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <Card className="bg-content1 border border-divider overflow-hidden">
                  <Tabs 
                    aria-label="Simulation tabs" 
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab as any}
                    classNames={{
                      tabList: "bg-content2 p-1",
                      cursor: "bg-content3",
                      tab: "data-[selected=true]:text-primary"
                    }}
                  >
                    <Tab key="terminal" title="Linux Command Line">
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <Card className="bg-content2 border border-divider p-0 overflow-hidden">
                              <div className="bg-content3 p-2 flex items-center">
                                <div className="flex gap-1.5 ml-2">
                                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                                  <div className="w-3 h-3 rounded-full bg-success"></div>
                                </div>
                                <div className="text-xs text-center flex-1 text-foreground/70">Terminal</div>
                              </div>
                              
                              <div className="p-4 font-mono text-sm h-[400px] overflow-y-auto bg-content3/50">
                                {terminalHistory.map((entry, index) => (
                                  <div 
                                    key={index} 
                                    className={`mb-1 ${
                                      entry.type === "user" ? "text-primary" : 
                                      entry.type === "error" ? "text-danger" : 
                                      entry.type === "hint" ? "text-warning italic" : 
                                      "text-foreground"
                                    }`}
                                  >
                                    {entry.content}
                                  </div>
                                ))}
                              </div>
                              
                              <form onSubmit={handleTerminalSubmit} className="border-t border-divider p-2 flex">
                                <span className="text-primary font-mono mr-2">$</span>
                                <Input
                                  value={terminalInput}
                                  onChange={(e) => setTerminalInput(e.target.value)}
                                  placeholder="Type your command here..."
                                  className="flex-1"
                                  classNames={{
                                    inputWrapper: "bg-transparent border-none shadow-none",
                                    input: "font-mono"
                                  }}
                                  autoFocus
                                />
                              </form>
                            </Card>
                          </div>
                          
                          <div>
                            <Card className="bg-content2 border border-divider p-4 sticky top-20">
                              <h3 className="font-semibold mb-3">Tutorial Progress</h3>
                              
                              <div className="space-y-3 mb-4">
                                {tutorialSteps.map((step, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    {index < currentStep ? (
                                      <Icon icon="lucide:check-circle" className="text-success" />
                                    ) : index === currentStep ? (
                                      <Icon icon="lucide:circle" className="text-primary animate-pulse" />
                                    ) : (
                                      <Icon icon="lucide:circle" className="text-foreground/50" />
                                    )}
                                    <span className={index < currentStep ? "line-through text-foreground/70" : ""}>
                                      {step.description}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              
                              <Divider className="my-4" />
                              
                              <h3 className="font-medium mb-2">Current Task</h3>
                              {currentStep < tutorialSteps.length ? (
                                <div className="p-3 border border-primary/30 rounded-lg bg-primary/5">
                                  <h4 className="font-medium mb-1">{tutorialSteps[currentStep].description}</h4>
                                  <p className="text-xs text-foreground/70 mb-2">
                                    {tutorialSteps[currentStep].hint}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-3 border border-success/30 rounded-lg bg-success/5">
                                  <h4 className="font-medium mb-1">All tasks completed!</h4>
                                  <p className="text-xs text-foreground/70">
                                    You've successfully completed all the tutorial steps.
                                  </p>
                                </div>
                              )}
                              
                              <Button 
                                className="w-full mt-4" 
                                color="primary" 
                                variant="flat"
                                onPress={() => {
                                  setCurrentStep(0);
                                  setTerminalHistory([
                                    { type: "system", content: "Tutorial reset. Let's start from the beginning!" },
                                    { type: "system", content: tutorialSteps[0].description },
                                    { type: "hint", content: tutorialSteps[0].hint }
                                  ]);
                                }}
                              >
                                Reset Tutorial
                              </Button>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    
                    <Tab key="webapp" title="SQL Injection">
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <Card className="bg-content2 border border-divider overflow-hidden">
                              <div className="bg-content3 p-2 flex items-center">
                                <div className="flex gap-1.5 ml-2">
                                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                                  <div className="w-3 h-3 rounded-full bg-success"></div>
                                </div>
                                <div className="text-xs text-center flex-1 text-foreground/70">Web Application</div>
                              </div>
                              
                              <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4 text-center">Login Form</h3>
                                
                                <form onSubmit={handleWebAppTest} className="max-w-md mx-auto">
                                  <div className="space-y-4 mb-6">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Username</label>
                                      <Input 
                                        value={webAppInput}
                                        onChange={(e) => setWebAppInput(e.target.value)}
                                        placeholder="Enter username..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Password</label>
                                      <Input 
                                        type="password"
                                        placeholder="Enter password..."
                                      />
                                    </div>
                                  </div>
                                  
                                  <Button color="primary" className="w-full" type="submit">
                                    Login
                                  </Button>
                                </form>
                                
                                {webAppResult && (
                                  <div className={`mt-6 p-4 rounded-lg ${
                                    webAppResult.includes("SQL Injection detected") 
                                      ? "bg-success/10 border border-success/30" 
                                      : "bg-warning/10 border border-warning/30"
                                  }`}>
                                    <p className="text-sm">{webAppResult}</p>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </div>
                          
                          <div>
                            <Card className="bg-content2 border border-divider p-4 sticky top-20">
                              <h3 className="font-semibold mb-3">SQL Injection Guide</h3>
                              
                              <p className="text-sm text-foreground/70 mb-4">
                                SQL injection is a code injection technique that exploits vulnerabilities in the 
                                database layer of an application. Try these common SQL injection payloads in the username field:
                              </p>
                              
                              <div className="space-y-2 mb-4">
                                {sqlInjectionTests.map((test, index) => (
                                  <div key={index} className="p-2 bg-content3 rounded-lg">
                                    <code className="text-sm font-mono">{test.input}</code>
                                  </div>
                                ))}
                              </div>
                              
                              <Divider className="my-4" />
                              
                              <h3 className="font-medium mb-2">How It Works</h3>
                              <p className="text-sm text-foreground/70 mb-3">
                                When you enter a username, the application might construct a SQL query like:
                              </p>
                              
                              <div className="p-2 bg-content3 rounded-lg mb-4">
                                <code className="text-sm font-mono">
                                  SELECT * FROM users WHERE username = 'INPUT' AND password = 'PASSWORD'
                                </code>
                              </div>
                              
                              <p className="text-sm text-foreground/70">
                                By injecting special characters and SQL syntax, you can manipulate this query to bypass authentication
                                or extract sensitive data.
                              </p>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    
                    <Tab key="network" title="Network Analysis">
                      <div className="p-6 text-center">
                        <Icon icon="lucide:construction" className="text-5xl text-warning mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                        <p className="text-foreground/70 mb-6">
                          The Network Traffic Analysis simulation is currently under development.
                        </p>
                        <Button color="primary" variant="flat" onPress={() => setSelectedTab("terminal")}>
                          Try Linux Command Simulation
                        </Button>
                      </div>
                    </Tab>
                    
                    <Tab key="crypto" title="Password Cracking">
                      <div className="p-6 text-center">
                        <Icon icon="lucide:construction" className="text-5xl text-warning mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                        <p className="text-foreground/70 mb-6">
                          The Password Cracking simulation is currently under development.
                        </p>
                        <Button color="primary" variant="flat" onPress={() => setSelectedTab("terminal")}>
                          Try Linux Command Simulation
                        </Button>
                      </div>
                    </Tab>
                  </Tabs>
                </Card>
              </div>
            </main>
          </div>
        </div>
      );
    };