import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Badge, Progress, Tabs, Tab, Divider } from "@heroui/react";
    import { motion } from "framer-motion";

    interface CourseDetailPageProps {
      onNavigate?: (page: string) => void;
    }

    export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("content");
      const [currentLesson, setCurrentLesson] = React.useState(3);
      
      const courseData = {
        title: "Web Application Security Fundamentals",
        instructor: "John Doe",
        level: "Beginner",
        duration: "10 hours",
        enrolled: 1245,
        rating: 4.8,
        progress: 65,
        description: "Learn the fundamentals of web application security, including common vulnerabilities, attack vectors, and defense strategies.",
        lessons: [
          {
            id: 1,
            title: "Introduction to Web Security",
            duration: "15 min",
            type: "video",
            completed: true
          },
          {
            id: 2,
            title: "Understanding the HTTP Protocol",
            duration: "25 min",
            type: "video",
            completed: true
          },
          {
            id: 3,
            title: "Common Web Vulnerabilities",
            duration: "30 min",
            type: "video",
            completed: false
          },
          {
            id: 4,
            title: "Cross-Site Scripting (XSS)",
            duration: "45 min",
            type: "video",
            completed: false
          },
          {
            id: 5,
            title: "SQL Injection Basics",
            duration: "40 min",
            type: "video",
            completed: false
          },
          {
            id: 6,
            title: "XSS Attack Lab",
            duration: "60 min",
            type: "lab",
            completed: false
          },
          {
            id: 7,
            title: "SQL Injection Lab",
            duration: "60 min",
            type: "lab",
            completed: false
          },
          {
            id: 8,
            title: "Authentication Vulnerabilities",
            duration: "35 min",
            type: "video",
            completed: false
          },
          {
            id: 9,
            title: "Session Management",
            duration: "30 min",
            type: "video",
            completed: false
          },
          {
            id: 10,
            title: "Secure Coding Practices",
            duration: "50 min",
            type: "video",
            completed: false
          },
          {
            id: 11,
            title: "Final Assessment",
            duration: "45 min",
            type: "quiz",
            completed: false
          }
        ]
      };

      const getLessonTypeIcon = (type: string) => {
        switch (type) {
          case "video": return <Icon icon="lucide:video" />;
          case "lab": return <Icon icon="lucide:server" />;
          case "quiz": return <Icon icon="lucide:check-square" />;
          default: return <Icon icon="lucide:file-text" />;
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
                  onPress={() => onNavigate && onNavigate("dashboard")}
                >
                  Back to Courses
                </Button>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {/* Rest of the course detail content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-content1 border border-divider overflow-hidden mb-6">
                      <div className="aspect-video bg-content2 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                              <Icon icon="lucide:play" className="text-primary text-3xl" />
                            </div>
                            <h3 className="text-lg font-medium">Common Web Vulnerabilities</h3>
                            <p className="text-foreground/70">Lesson 3 • 30 minutes</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h1 className="text-2xl font-bold mb-2">{courseData.title}</h1>
                            <div className="flex flex-wrap gap-3 mb-4">
                              <Badge color="success" variant="flat">{courseData.level}</Badge>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:clock" />
                                <span>{courseData.duration}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:users" />
                                <span>{courseData.enrolled.toLocaleString()} enrolled</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Icon icon="lucide:star" className="text-warning" />
                                <span>{courseData.rating}</span>
                              </div>
                            </div>
                            <p className="text-foreground/70">{courseData.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{courseData.progress}%</span>
                          </div>
                          <Progress 
                            aria-label="Course progress" 
                            value={courseData.progress} 
                            color="primary"
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            color="primary" 
                            startContent={<Icon icon="lucide:play" />}
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
                            startContent={<Icon icon="lucide:bookmark" />}
                          >
                            Save for Later
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-content1 border border-divider overflow-hidden">
                      <Tabs 
                        aria-label="Course tabs" 
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab as any}
                        classNames={{
                          tabList: "bg-content2 p-1",
                          cursor: "bg-content3",
                          tab: "data-[selected=true]:text-primary"
                        }}
                      >
                        <Tab key="content" title="Course Content">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Course Lessons</h2>
                            
                            <div className="space-y-2">
                              {courseData.lessons.map((lesson) => (
                                <Card 
                                  key={lesson.id}
                                  isPressable
                                  className={`p-3 border ${lesson.id === currentLesson ? 'border-primary' : 'border-divider'}`}
                                  onPress={() => setCurrentLesson(lesson.id)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-full ${lesson.id === currentLesson ? 'bg-primary/20' : 'bg-content2'}`}>
                                        {lesson.completed ? (
                                          <Icon icon="lucide:check-circle" className="text-success" />
                                        ) : (
                                          getLessonTypeIcon(lesson.type)
                                        )}
                                      </div>
                                      <div>
                                        <h3 className="font-medium">{lesson.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-foreground/70">
                                          <span>{lesson.duration}</span>
                                          <span>•</span>
                                          <span className="capitalize">{lesson.type}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {lesson.id === currentLesson && (
                                      <Badge color="primary" variant="flat">Current</Badge>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </Tab>
                        <Tab key="overview" title="Overview">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
                            
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-lg font-medium mb-2">About This Course</h3>
                                <p className="text-foreground/70 mb-4">
                                  This course provides a comprehensive introduction to web application security.
                                  You'll learn about common vulnerabilities, attack vectors, and defense strategies
                                  to protect web applications from security threats.
                                </p>
                                <p className="text-foreground/70">
                                  Through a combination of video lessons, hands-on labs, and quizzes, you'll gain
                                  practical skills in identifying and mitigating web security risks. By the end of
                                  the course, you'll be able to conduct basic security assessments and implement
                                  security best practices in web applications.
                                </p>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-3">What You'll Learn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {[
                                    "Identify common web vulnerabilities",
                                    "Understand attack vectors and exploitation techniques",
                                    "Implement security controls and best practices",
                                    "Conduct basic web security assessments",
                                    "Protect against XSS and SQL injection attacks",
                                    "Secure authentication and session management",
                                    "Apply secure coding practices",
                                    "Use security tools for vulnerability detection"
                                  ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <Icon icon="lucide:check" className="text-success" />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-3">Prerequisites</h3>
                                <ul className="list-disc pl-5 space-y-1 text-foreground/70">
                                  <li>Basic understanding of web technologies (HTML, CSS, JavaScript)</li>
                                  <li>Familiarity with HTTP protocol</li>
                                  <li>Basic programming knowledge</li>
                                </ul>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-3">Target Audience</h3>
                                <ul className="list-disc pl-5 space-y-1 text-foreground/70">
                                  <li>Web developers looking to improve security knowledge</li>
                                  <li>Security professionals starting in web security</li>
                                  <li>IT professionals responsible for web application security</li>
                                  <li>Students interested in cybersecurity careers</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab key="resources" title="Resources">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Course Resources</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              {[
                                { title: "Course Slides", type: "PDF", size: "3.2 MB" },
                                { title: "Web Security Cheat Sheet", type: "PDF", size: "1.8 MB" },
                                { title: "Lab Setup Instructions", type: "PDF", size: "1.2 MB" },
                                { title: "Sample Vulnerable Code", type: "ZIP", size: "4.5 MB" }
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
                            <div className="space-y-3">
                              {[
                                { name: "Burp Suite Community Edition", description: "Web vulnerability scanner and proxy tool" },
                                { name: "OWASP ZAP", description: "Open-source web application security scanner" },
                                { name: "Firefox Developer Edition", description: "Browser with enhanced developer tools" }
                              ].map((tool, index) => (
                                <div key={index} className="p-3 border border-divider rounded-lg">
                                  <h4 className="font-medium mb-1">{tool.name}</h4>
                                  <p className="text-sm text-foreground/70">{tool.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Tab>
                        <Tab key="discussion" title="Discussion">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Course Discussion</h2>
                            
                            <div className="space-y-4 mb-6">
                              {[
                                { 
                                  user: "John Doe", 
                                  avatar: 11, 
                                  time: "3 days ago", 
                                  content: "The XSS examples in lesson 4 were really helpful. I was able to apply the concepts immediately in my own projects." 
                                },
                                { 
                                  user: "Jane Doe", 
                                  avatar: 12, 
                                  time: "2 days ago", 
                                  content: "I'm having trouble setting up the lab environment for the SQL injection practice. Has anyone else encountered issues?" 
                                },
                                { 
                                  user: "Instructor", 
                                  avatar: 25, 
                                  time: "1 day ago", 
                                  content: "Hi Jane, please make sure you're using the latest version of the lab environment. If you're still having issues, check out the troubleshooting guide in the resources section." 
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
                          <span>Course Completion</span>
                          <span>{courseData.progress}%</span>
                        </div>
                        <Progress 
                          aria-label="Course progress" 
                          value={courseData.progress} 
                          color="primary"
                        />
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Lessons Completed</span>
                          <span>{courseData.lessons.filter(l => l.completed).length}/{courseData.lessons.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Time Remaining</span>
                          <span>~3.5 hours</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Activity</span>
                          <span>Today</span>
                        </div>
                      </div>
                      
                      <Button 
                        color="primary" 
                        className="w-full mb-3"
                        startContent={<Icon icon="lucide:play" />}
                      >
                        Continue Learning
                      </Button>
                      
                      <Button 
                        variant="flat" 
                        color="default" 
                        className="w-full"
                        startContent={<Icon icon="lucide:download" />}
                      >
                        Download Certificate
                      </Button>
                      
                      <Divider className="my-4" />
                      
                      <h3 className="font-medium mb-2">Current Lesson</h3>
                      <div className="p-3 border border-primary/30 rounded-lg bg-primary/5">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon icon="lucide:video" className="text-primary" />
                          <h4 className="font-medium">Common Web Vulnerabilities</h4>
                        </div>
                        <div className="flex justify-between text-xs text-foreground/70 mb-2">
                          <span>Lesson 3 of 11</span>
                          <span>30 minutes</span>
                        </div>
                        <Button 
                          size="sm" 
                          color="primary" 
                          variant="flat" 
                          className="w-full"
                          startContent={<Icon icon="lucide:play" />}
                        >
                          Resume
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Next Up</h3>
                        <div className="p-3 border border-divider rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon icon="lucide:video" />
                            <h4 className="font-medium">Cross-Site Scripting (XSS)</h4>
                          </div>
                          <div className="flex justify-between text-xs text-foreground/70">
                            <span>Lesson 4 of 11</span>
                            <span>45 minutes</span>
                          </div>
                        </div>
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
            </main>
          </div>
        </div>
      );
    };