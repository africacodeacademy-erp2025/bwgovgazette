import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Badge, Tabs, Tab, Input, Divider } from "@heroui/react";
    import { motion } from "framer-motion";

    interface ChallengePageProps {
      onNavigate?: (page: string) => void;
    }

    export const ChallengePage: React.FC<ChallengePageProps> = ({ onNavigate }) => {
      const [selectedCategory, setSelectedCategory] = React.useState("all");
      
      const challenges = [
        {
          title: "Cross-Site Scripting Challenge",
          description: "Identify and exploit XSS vulnerabilities in a web application.",
          difficulty: "Medium",
          points: 250,
          category: "Web",
          solves: 124,
          status: "not-started"
        },
        {
          title: "Reverse Engineering Binary",
          description: "Analyze and reverse engineer a compiled binary to find the hidden flag.",
          difficulty: "Hard",
          points: 500,
          category: "Binary",
          solves: 45,
          status: "not-started"
        },
        {
          title: "Network Traffic Analysis",
          description: "Analyze packet captures to identify suspicious activities and extract hidden data.",
          difficulty: "Easy",
          points: 100,
          category: "Network",
          solves: 256,
          status: "completed"
        },
        {
          title: "SQL Injection Attack",
          description: "Exploit SQL injection vulnerabilities to extract sensitive data from a database.",
          difficulty: "Medium",
          points: 300,
          category: "Web",
          solves: 189,
          status: "in-progress"
        },
        {
          title: "Cryptography Challenge",
          description: "Decrypt messages using various cryptographic techniques.",
          difficulty: "Medium",
          points: 250,
          category: "Crypto",
          solves: 132,
          status: "not-started"
        },
        {
          title: "Forensics Investigation",
          description: "Analyze disk images to recover deleted files and hidden data.",
          difficulty: "Hard",
          points: 400,
          category: "Forensics",
          solves: 78,
          status: "not-started"
        }
      ];

      const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
          case "Easy": return "success";
          case "Medium": return "warning";
          case "Hard": return "danger";
          default: return "default";
        }
      };

      const getStatusIcon = (status: string) => {
        switch (status) {
          case "completed": return <Icon icon="lucide:check-circle" className="text-success" />;
          case "in-progress": return <Icon icon="lucide:clock" className="text-warning" />;
          case "not-started": return <Icon icon="lucide:circle" className="text-foreground/50" />;
          default: return null;
        }
      };

      const filteredChallenges = selectedCategory === "all" 
        ? challenges 
        : challenges.filter(challenge => challenge.category.toLowerCase() === selectedCategory);

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
                <h1 className="text-xl font-semibold">CTF Challenges</h1>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {/* Rest of the challenge page content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">CTF Challenges</h2>
                    <p className="text-foreground/70">Test your skills with capture-the-flag challenges</p>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <Input
                      placeholder="Search challenges..."
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
                
                <Card className="bg-content1 border border-divider overflow-hidden mb-6">
                  <div className="p-4 bg-primary/10 border-b border-divider">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <Icon icon="lucide:zap" className="text-primary mr-2" />
                          Daily Challenge
                        </h3>
                        <p className="text-foreground/70">Complete today's challenge for bonus points</p>
                      </div>
                      <Button color="primary" onPress={() => onNavigate && onNavigate("challenge-detail")}>Start Challenge</Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium mb-2">Web Authentication Bypass</h4>
                    <p className="text-foreground/70 mb-4">
                      Find and exploit vulnerabilities in a web authentication system to gain unauthorized access.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:award" className="text-primary" />
                        <span>500 points</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:clock" />
                        <span>24 hours remaining</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:users" />
                        <span>45 solves</span>
                      </div>
                      <Badge color="warning" variant="flat">Medium</Badge>
                    </div>
                  </div>
                </Card>
                
                <Tabs 
                  aria-label="Challenge categories" 
                  selectedKey={selectedCategory}
                  onSelectionChange={setSelectedCategory as any}
                  className="mb-6"
                  classNames={{
                    tabList: "bg-content1 p-1 rounded-lg",
                    cursor: "bg-content3",
                    tab: "data-[selected=true]:text-primary"
                  }}
                >
                  <Tab key="all" title="All Challenges" />
                  <Tab key="web" title="Web" />
                  <Tab key="crypto" title="Cryptography" />
                  <Tab key="binary" title="Binary" />
                  <Tab key="forensics" title="Forensics" />
                  <Tab key="network" title="Network" />
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChallenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="p-4 bg-content1 border border-divider h-full">
                        <div className="flex justify-between items-start mb-3">
                          <Badge color={getDifficultyColor(challenge.difficulty) as any} variant="flat">
                            {challenge.difficulty}
                          </Badge>
                          {getStatusIcon(challenge.status)}
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                        <p className="text-sm text-foreground/70 mb-4">{challenge.description}</p>
                        
                        <div className="flex justify-between text-sm text-foreground/70 mb-4">
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:tag" />
                            <span>{challenge.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:award" />
                            <span>{challenge.points} pts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:users" />
                            <span>{challenge.solves}</span>
                          </div>
                        </div>
                        
                        <Button 
                          color={challenge.status === "in-progress" ? "primary" : "default"}
                          variant={challenge.status === "in-progress" ? "solid" : "flat"}
                          className="w-full"
                          onPress={() => onNavigate && onNavigate("challenge-detail")}
                        >
                          {challenge.status === "completed" ? "View Solution" : challenge.status === "in-progress" ? "Continue" : "Start Challenge"}
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-content2 rounded-lg border border-divider">
                  <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-divider">
                          <th className="py-2 px-4 text-left">Rank</th>
                          <th className="py-2 px-4 text-left">User</th>
                          <th className="py-2 px-4 text-left">Challenges Solved</th>
                          <th className="py-2 px-4 text-left">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { rank: 1, name: "h4ck3rm4n", solved: 42, points: 8750 },
                          { rank: 2, name: "cyberninja", solved: 39, points: 8200 },
                          { rank: 3, name: "securityguru", solved: 37, points: 7850 },
                          { rank: 4, name: "codebuster", solved: 35, points: 7400 },
                          { rank: 5, name: "binarywizard", solved: 33, points: 7100 }
                        ].map((user, index) => (
                          <tr key={index} className="border-b border-divider">
                            <td className="py-2 px-4">{user.rank}</td>
                            <td className="py-2 px-4">{user.name}</td>
                            <td className="py-2 px-4">{user.solved}</td>
                            <td className="py-2 px-4">{user.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="light" color="primary">
                      View Full Leaderboard
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    };