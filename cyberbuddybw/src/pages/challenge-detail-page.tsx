import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Badge, Tabs, Tab, Input, Divider, Progress } from "@heroui/react";
    import { motion } from "framer-motion";

    interface ChallengeDetailPageProps {
      onNavigate?: (page: string) => void;
    }

    export const ChallengeDetailPage: React.FC<ChallengeDetailPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("description");
      const [flagInput, setFlagInput] = React.useState("");
      const [flagSubmitted, setFlagSubmitted] = React.useState(false);
      const [showHint, setShowHint] = React.useState(false);
      
      const challengeData = {
        title: "Cross-Site Scripting Challenge",
        description: "Identify and exploit XSS vulnerabilities in a web application to extract sensitive information.",
        difficulty: "Medium",
        points: 250,
        category: "Web",
        solves: 124,
        status: "in-progress",
        progress: 35,
        flag: "CTF{xss_m4st3r_2023}",
        hints: [
          "Look for user input fields that don't properly sanitize input",
          "Try injecting script tags with event handlers",
          "The admin bot visits the page every few minutes"
        ],
        resources: [
          { name: "XSS Cheat Sheet", type: "PDF", size: "1.2 MB" },
          { name: "Web Security Basics", type: "Video", size: "45 MB" }
        ]
      };
      
      const handleFlagSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFlagSubmitted(true);
        
        // If flag is correct, show success message and update progress
        if (flagInput.trim() === challengeData.flag) {
          // You could add additional logic here like updating progress
          setTimeout(() => {
            // Navigate back to challenges after successful submission
            if (onNavigate) {
              onNavigate("challenge");
            }
          }, 2000);
        }
      };
      
      const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
          case "Easy": return "success";
          case "Medium": return "warning";
          case "Hard": return "danger";
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
                <Button 
                  variant="light" 
                  color="default" 
                  className="mr-4" 
                  startContent={<Icon icon="lucide:arrow-left" />}
                  onPress={() => onNavigate && onNavigate("challenge")}
                >
                  Back to Challenges
                </Button>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-content1 border border-divider overflow-hidden mb-6">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h1 className="text-2xl font-bold mb-2">{challengeData.title}</h1>
                            <div className="flex flex-wrap gap-3 mb-4">
                              <Badge color={getDifficultyColor(challengeData.difficulty)} variant="flat">
                                {challengeData.difficulty}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:tag" />
                                <span>{challengeData.category}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:award" />
                                <span>{challengeData.points} pts</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:users" />
                                <span>{challengeData.solves} solves</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{challengeData.progress}%</span>
                          </div>
                          <Progress 
                            aria-label="Challenge progress" 
                            value={challengeData.progress} 
                            color="primary"
                          />
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-content1 border border-divider overflow-hidden">
                      <Tabs 
                        aria-label="Challenge tabs" 
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab as any}
                        classNames={{
                          tabList: "bg-content2 p-1",
                          cursor: "bg-content3",
                          tab: "data-[selected=true]:text-primary"
                        }}
                      >
                        <Tab key="description" title="Description">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Challenge Description</h2>
                            <p className="text-foreground/70 mb-6">
                              {challengeData.description}
                            </p>
                            
                            <div className="bg-content2 p-4 rounded-lg border border-divider mb-6">
                              <h3 className="font-medium mb-2">Scenario</h3>
                              <p className="text-foreground/70 mb-4">
                                You've been hired to perform a security assessment of a web application. 
                                The client is concerned about cross-site scripting vulnerabilities that could 
                                allow attackers to steal user cookies and perform actions on behalf of other users.
                              </p>
                              <p className="text-foreground/70">
                                Your task is to identify and exploit any XSS vulnerabilities in the application, 
                                and demonstrate how they could be used to steal sensitive information.
                              </p>
                            </div>
                            
                            <div className="bg-content2 p-4 rounded-lg border border-divider mb-6">
                              <h3 className="font-medium mb-2">Objectives</h3>
                              <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                                <li>Find an input field vulnerable to XSS</li>
                                <li>Craft a payload that can steal cookies</li>
                                <li>Execute the payload and capture the admin's cookie</li>
                                <li>Use the cookie to access the admin panel</li>
                                <li>Find and submit the flag</li>
                              </ul>
                            </div>
                            
                            <div className="flex justify-between">
                              <Button 
                                variant="flat" 
                                color="primary"
                                startContent={<Icon icon="lucide:external-link" />}
                                onPress={() => onNavigate && onNavigate("environment")}
                              >
                                Launch Challenge Environment
                              </Button>
                              <Button 
                                variant="light" 
                                color={showHint ? "primary" : "default"}
                                startContent={<Icon icon="lucide:help-circle" />}
                                onPress={() => setShowHint(!showHint)}
                              >
                                {showHint ? "Hide Hint" : "Show Hint"}
                              </Button>
                            </div>
                            
                            {showHint && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg"
                              >
                                <h3 className="font-medium text-warning mb-2">Hint</h3>
                                <p className="text-foreground/70">
                                  {challengeData.hints[0]}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </Tab>
                        <Tab key="submit" title="Submit Flag">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Submit Your Flag</h2>
                            <p className="text-foreground/70 mb-6">
                              Once you've found the flag, submit it here to complete the challenge.
                              Flags are typically in the format CTF{'{flag_text}'}.
                            </p>
                            
                            <form onSubmit={handleFlagSubmit} className="mb-6">
                              <div className="mb-4">
                                <Input
                                  label="Flag"
                                  placeholder="Enter flag (e.g., CTF{example_flag})"
                                  value={flagInput}
                                  onChange={(e) => setFlagInput(e.target.value)}
                                  className="mb-2"
                                />
                              </div>
                              
                              <Button 
                                type="submit" 
                                color="primary"
                                startContent={<Icon icon="lucide:flag" />}
                              >
                                Submit Flag
                              </Button>
                            </form>
                            
                            {flagSubmitted && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 rounded-lg ${
                                  flagInput.trim() === challengeData.flag 
                                    ? "bg-success/10 border border-success/30" 
                                    : "bg-danger/10 border border-danger/30"
                                }`}
                              >
                                <h3 className={`font-medium ${
                                  flagInput.trim() === challengeData.flag ? "text-success" : "text-danger"
                                } mb-2`}>
                                  {flagInput.trim() === challengeData.flag ? "Correct Flag!" : "Incorrect Flag"}
                                </h3>
                                <p className="text-foreground/70">
                                  {flagInput.trim() === challengeData.flag 
                                    ? "Congratulations! You've successfully completed this challenge." 
                                    : "That's not the right flag. Keep trying!"}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </Tab>
                        <Tab key="resources" title="Resources">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Challenge Resources</h2>
                            <p className="text-foreground/70 mb-6">
                              Here are some resources that might help you solve this challenge.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              {challengeData.resources.map((resource, index) => (
                                <Card key={index} className="p-4 bg-content2 border border-divider">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium">{resource.name}</h3>
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
                            
                            <h3 className="text-lg font-medium mb-3">External Resources</h3>
                            <div className="space-y-2">
                              <a href="#" className="flex items-center gap-2 text-primary hover:underline">
                                <Icon icon="lucide:external-link" />
                                <span>OWASP XSS Prevention Cheat Sheet</span>
                              </a>
                              <a href="#" className="flex items-center gap-2 text-primary hover:underline">
                                <Icon icon="lucide:external-link" />
                                <span>PortSwigger XSS Tutorial</span>
                              </a>
                              <a href="#" className="flex items-center gap-2 text-primary hover:underline">
                                <Icon icon="lucide:external-link" />
                                <span>Mozilla Web Security Documentation</span>
                              </a>
                            </div>
                          </div>
                        </Tab>
                        <Tab key="discussion" title="Discussion">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Challenge Discussion</h2>
                            <p className="text-foreground/70 mb-6">
                              Discuss this challenge with other users. Please avoid sharing direct solutions.
                            </p>
                            
                            <div className="space-y-4 mb-6">
                              {[
                                { 
                                  user: "securityninja", 
                                  avatar: 11, 
                                  time: "2 days ago", 
                                  content: "I'm stuck on finding the vulnerable input field. Any hints without spoilers?" 
                                },
                                { 
                                  user: "xsshunter", 
                                  avatar: 12, 
                                  time: "1 day ago", 
                                  content: "Try looking at the comment section, sometimes developers forget to sanitize those inputs." 
                                },
                                { 
                                  user: "webpentester", 
                                  avatar: 13, 
                                  time: "12 hours ago", 
                                  content: "Don't forget to check for DOM-based XSS as well, not just reflected or stored XSS." 
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
                      <h2 className="text-lg font-semibold mb-3">Challenge Details</h2>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Category</span>
                          <span>{challengeData.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Difficulty</span>
                          <span>{challengeData.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Points</span>
                          <span>{challengeData.points}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Solves</span>
                          <span>{challengeData.solves}</span>
                        </div>
                      </div>
                      
                      <Divider className="my-4" />
                      
                      <h3 className="font-medium mb-2">Your Progress</h3>
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion</span>
                            <span>{challengeData.progress}%</span>
                          </div>
                          <Progress 
                            aria-label="Challenge progress" 
                            value={challengeData.progress} 
                            color="primary"
                          />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/70">Status</span>
                          <span className="text-warning">In Progress</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mb-3" 
                        color="primary"
                        startContent={<Icon icon="lucide:play" />}
                        onPress={() => onNavigate && onNavigate("environment")}
                      >
                        Launch Environment
                      </Button>
                      
                      <Button 
                        variant="flat" 
                        color="default" 
                        className="w-full"
                        startContent={<Icon icon="lucide:flag" />}
                        onPress={() => setSelectedTab("submit")}
                      >
                        Submit Flag
                      </Button>
                      
                      <Divider className="my-4" />
                      
                      <h3 className="font-medium mb-2">Need Help?</h3>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="default" 
                          className="w-full"
                          startContent={<Icon icon="lucide:help-circle" />}
                          onPress={() => {
                            setSelectedTab("description");
                            setShowHint(true);
                          }}
                        >
                          View Hints
                        </Button>
                        <Button 
                          size="sm" 
                          variant="light" 
                          color="default" 
                          className="w-full"
                          startContent={<Icon icon="lucide:message-circle" />}
                          onPress={() => setSelectedTab("discussion")}
                        >
                          Ask in Discussion
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="bg-content1 border border-divider p-4">
                      <h2 className="text-lg font-semibold mb-3">Related Challenges</h2>
                      
                      <div className="space-y-3">
                        {[
                          { title: "SQL Injection Attack", difficulty: "Medium", category: "Web" },
                          { title: "CSRF Vulnerability", difficulty: "Easy", category: "Web" },
                          { title: "DOM-based XSS", difficulty: "Hard", category: "Web" }
                        ].map((challenge, index) => (
                          <div 
                            key={index} 
                            className="p-3 border border-divider rounded-lg hover:bg-content2 transition-colors cursor-pointer"
                            onClick={() => onNavigate && onNavigate("challenge-detail")}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium text-sm">{challenge.title}</h3>
                              <Badge 
                                color={getDifficultyColor(challenge.difficulty)} 
                                variant="flat"
                                size="sm"
                              >
                                {challenge.difficulty}
                              </Badge>
                            </div>
                            <span className="text-xs text-foreground/70">{challenge.category}</span>
                          </div>
                        ))}
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