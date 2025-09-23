import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Input, Tabs, Tab, Divider } from "@heroui/react";

    interface HelpPageProps {
      onNavigate?: (page: string) => void;
    }

    export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
      const [selectedTab, setSelectedTab] = React.useState("faq");
      
      const faqCategories = [
        {
          category: "Account & Billing",
          questions: [
            {
              question: "How do I change my password?",
              answer: "You can change your password in the Settings page under the Security tab. You'll need to enter your current password and then your new password twice to confirm."
            },
            {
              question: "How do I upgrade my subscription?",
              answer: "To upgrade your subscription, go to the Upgrade page from your dashboard or settings. You can select a new plan and complete the payment process to upgrade immediately."
            },
            {
              question: "Can I cancel my subscription at any time?",
              answer: "Yes, you can cancel your subscription at any time from the Billing section in your Settings. Your access will continue until the end of your current billing period."
            },
            {
              question: "How do I update my payment information?",
              answer: "You can update your payment information in the Settings page under the Billing tab. Click on 'Add Payment Method' to add a new card or select an existing card to update it."
            }
          ]
        },
        {
          category: "Courses & Learning",
          questions: [
            {
              question: "How do I access my courses?",
              answer: "You can access your courses from the Dashboard by clicking on the 'Courses' tab. This will show all the courses you're currently enrolled in."
            },
            {
              question: "Can I download course materials for offline use?",
              answer: "Yes, most course materials can be downloaded for offline use. Look for the download button in the course resources section."
            },
            {
              question: "How do I track my progress?",
              answer: "Your progress is automatically tracked as you complete lessons and modules. You can view your overall progress on the Dashboard and detailed progress within each course."
            },
            {
              question: "What happens if I fail a quiz or assessment?",
              answer: "If you fail a quiz or assessment, you can retake it as many times as needed. We encourage learning from mistakes and trying again."
            }
          ]
        },
        {
          category: "Labs & Environments",
          questions: [
            {
              question: "How do lab environments work?",
              answer: "Lab environments are virtual machines or containers that provide a safe space to practice cybersecurity techniques. They're isolated from your system and the internet for security."
            },
            {
              question: "What happens when my lab time expires?",
              answer: "When your lab time expires, the environment is automatically shut down. Any unsaved work will be lost, so make sure to save your progress regularly."
            },
            {
              question: "Can I extend my lab time?",
              answer: "Yes, you can extend your lab time by clicking the 'Extend' button in the lab interface. This will add additional time based on your subscription plan."
            },
            {
              question: "How do I report issues with lab environments?",
              answer: "If you encounter any issues with lab environments, you can report them by clicking the 'Report Issue' button in the lab interface or by contacting support."
            }
          ]
        },
        {
          category: "Challenges & CTFs",
          questions: [
            {
              question: "How do I submit flags for challenges?",
              answer: "To submit flags for challenges, enter the flag in the submission box on the challenge page and click 'Submit'. You'll receive immediate feedback on whether the flag is correct."
            },
            {
              question: "Are hints available for challenges?",
              answer: "Yes, hints are available for most challenges. Some hints are free, while others may cost points depending on the challenge difficulty."
            },
            {
              question: "How are points calculated for challenges?",
              answer: "Points are calculated based on the difficulty of the challenge and how many people have solved it. First solves typically earn bonus points."
            },
            {
              question: "Can I collaborate with others on challenges?",
              answer: "While we encourage learning together, challenge submissions should be your own work. Team challenges are specifically designed for collaboration."
            }
          ]
        }
      ];

      return (
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="light" 
            color="default" 
            className="mb-6" 
            startContent={<Icon icon="lucide:arrow-left" />}
            onPress={() => onNavigate && onNavigate("dashboard")}
          >
            Back to Dashboard
          </Button>
          
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-4">How Can We Help You?</h1>
            <p className="text-foreground/70 mb-6">
              Find answers to common questions or contact our support team for assistance.
            </p>
            
            <div className="relative mb-8">
              <Input
                placeholder="Search for help articles..."
                className="max-w-xl mx-auto"
                size="lg"
                classNames={{
                  input: "text-foreground",
                  inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2"
                }}
                startContent={<Icon icon="lucide:search" className="text-foreground/50" />}
              />
            </div>
          </div>
          
          <Card className="bg-content1 border border-divider overflow-hidden mb-8">
            <Tabs 
              aria-label="Help tabs" 
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab as any}
              classNames={{
                tabList: "bg-content2 p-1",
                cursor: "bg-content3",
                tab: "data-[selected=true]:text-primary"
              }}
            >
              <Tab key="faq" title="Frequently Asked Questions">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqCategories.map((category, categoryIndex) => (
                      <Card key={categoryIndex} className="p-4 bg-content2 border border-divider">
                        <h2 className="text-lg font-semibold mb-4">{category.category}</h2>
                        
                        <div className="space-y-4">
                          {category.questions.map((faq, faqIndex) => (
                            <div key={faqIndex} className="border-b border-divider pb-4 last:border-0 last:pb-0">
                              <h3 className="font-medium mb-2">{faq.question}</h3>
                              <p className="text-foreground/70 text-sm">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>
              <Tab key="contact" title="Contact Support">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input 
                            placeholder="Your name" 
                            classNames={{
                              input: "text-foreground",
                              inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2"
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input 
                            placeholder="Your email address" 
                            type="email" 
                            classNames={{
                              input: "text-foreground",
                              inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2"
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Subject</label>
                          <select className="w-full p-2 rounded-lg bg-content2 border border-divider">
                            <option>Select a topic</option>
                            <option>Account Issues</option>
                            <option>Billing Questions</option>
                            <option>Course Content</option>
                            <option>Lab Environment Problems</option>
                            <option>Challenge Issues</option>
                            <option>Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Message</label>
                          <textarea 
                            className="w-full p-3 rounded-lg bg-content2 border border-divider focus:outline-none focus:border-primary transition-colors"
                            rows={6}
                            placeholder="Describe your issue in detail..."
                          ></textarea>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="attach-files" />
                          <label htmlFor="attach-files" className="text-sm">
                            Attach screenshots or files to help us understand your issue
                          </label>
                        </div>
                        
                        <Button color="primary">
                          Submit Request
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Card className="p-4 bg-content2 border border-divider mb-6">
                        <h3 className="font-medium mb-3">Support Hours</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span>9:00 AM - 8:00 PM EST</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday</span>
                            <span>10:00 AM - 6:00 PM EST</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span>Closed</span>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-content2 border border-divider mb-6">
                        <h3 className="font-medium mb-3">Response Time</h3>
                        <p className="text-sm text-foreground/70">
                          We typically respond to support requests within 24 hours during business days.
                          Premium members receive priority support with faster response times.
                        </p>
                      </Card>
                      
                      <Card className="p-4 bg-content2 border border-divider">
                        <h3 className="font-medium mb-3">Other Ways to Reach Us</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:mail" className="text-primary" />
                            <span className="text-sm">support@cybertrainerx.com</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:phone" className="text-primary" />
                            <span className="text-sm">+1 (555) 123-4567</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:message-circle" className="text-primary" />
                            <span className="text-sm">Live Chat (Premium Only)</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab key="documentation" title="Documentation">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Documentation & Resources</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-4 bg-content2 border border-divider">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon icon="lucide:book-open" className="text-primary" />
                        </div>
                        <h3 className="font-medium">Getting Started Guide</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Learn how to navigate the platform, set up your account, and start your learning journey.
                      </p>
                      <Button size="sm" variant="flat" color="primary" className="w-full">
                        Read Guide
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-content2 border border-divider">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon icon="lucide:server" className="text-primary" />
                        </div>
                        <h3 className="font-medium">Lab Environment Guide</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Detailed instructions on how to use our virtual lab environments effectively.
                      </p>
                      <Button size="sm" variant="flat" color="primary" className="w-full">
                        Read Guide
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-content2 border border-divider">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon icon="lucide:flag" className="text-primary" />
                        </div>
                        <h3 className="font-medium">Challenge Walkthrough</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Learn how to approach and solve challenges with our step-by-step methodology.
                      </p>
                      <Button size="sm" variant="flat" color="primary" className="w-full">
                        Read Guide
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-content2 border border-divider">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon icon="lucide:code" className="text-primary" />
                        </div>
                        <h3 className="font-medium">API Documentation</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Technical documentation for developers integrating with our platform API.
                      </p>
                      <Button size="sm" variant="flat" color="primary" className="w-full">
                        View Docs
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-content2 border border-divider">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon icon="lucide:credit-card" className="text-primary" />
                        </div>
                        <h3 className="font-medium">Billing & Subscription</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Information about billing cycles, payment methods, and subscription management.
                      </p>
                      <Button size="sm" variant="flat" color="primary" className="w-full">
                        Read Guide
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-content2 border border-divider">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon icon="lucide:users" className="text-primary" />
                        </div>
                        <h3 className="font-medium">Community Guidelines</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">
                        Rules and best practices for participating in our learning community.
                      </p>
                      <Button size="sm" variant="flat" color="primary" className="w-full">
                        Read Guide
                      </Button>
                    </Card>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Video Tutorials</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: "Platform Overview", duration: "5:32" },
                        { title: "Setting Up Your First Lab", duration: "8:45" },
                        { title: "Solving Your First Challenge", duration: "12:18" }
                      ].map((video, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="h-40 bg-content2 flex items-center justify-center">
                            <div className="p-3 rounded-full bg-primary/20 border border-primary/30">
                              <Icon icon="lucide:play" className="text-primary text-xl" />
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">{video.title}</h4>
                            <p className="text-xs text-foreground/70">{video.duration}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Card>
          
          <div className="bg-content2 rounded-lg p-6 text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">Still Need Help?</h2>
            <p className="text-foreground/70 mb-4">
              Our support team is available to assist you with any questions or issues.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                color="primary" 
                startContent={<Icon icon="lucide:message-circle" />}
              >
                Live Chat
              </Button>
              <Button 
                variant="flat" 
                color="default" 
                startContent={<Icon icon="lucide:mail" />}
              >
                Email Support
              </Button>
            </div>
          </div>
        </div>
      );
    };