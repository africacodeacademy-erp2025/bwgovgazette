import React from "react";
    import { Icon } from "@iconify/react";
    import { Card, Button, Badge, Divider, RadioGroup, Radio } from "@heroui/react";
    import { motion } from "framer-motion";

    interface UpgradePageProps {
      onNavigate?: (page: string) => void;
    }

    export const UpgradePage: React.FC<UpgradePageProps> = ({ onNavigate }) => {
      const [selectedPlan, setSelectedPlan] = React.useState("pro");
      const [billingCycle, setBillingCycle] = React.useState("annual");
      
      const plans = [
        {
          id: "basic",
          name: "Basic",
          price: billingCycle === "annual" ? 9.99 : 14.99,
          features: [
            "Access to basic courses",
            "5 lab hours per month",
            "Community support",
            "Basic challenges",
            "Certificate of completion"
          ],
          limitations: [
            "Limited lab environments",
            "No advanced courses",
            "No private mentoring"
          ]
        },
        {
          id: "pro",
          name: "Professional",
          price: billingCycle === "annual" ? 19.99 : 29.99,
          popular: true,
          features: [
            "Access to all courses",
            "20 lab hours per month",
            "Priority support",
            "All challenges",
            "Certificate of completion",
            "Advanced learning paths",
            "Team collaboration tools"
          ],
          limitations: [
            "Limited private mentoring"
          ]
        },
        {
          id: "enterprise",
          name: "Enterprise",
          price: billingCycle === "annual" ? 49.99 : 69.99,
          features: [
            "Access to all courses",
            "Unlimited lab hours",
            "24/7 premium support",
            "All challenges",
            "Certificate of completion",
            "Advanced learning paths",
            "Team collaboration tools",
            "Private mentoring sessions",
            "Custom learning paths",
            "Dedicated environment",
            "API access"
          ],
          limitations: []
        }
      ];

      return (
        <div className="min-h-screen bg-background text-foreground flex">
          {/* Sidebar */}
          <div className="w-60 fixed left-0 top-0 h-screen bg-content1 border-r border-divider flex flex-col z-40">
            {/* Sidebar content */}
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
                <h1 className="text-xl font-semibold">Upgrade Plan</h1>
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {/* Fix the JSX tag issue */}
                <Button 
                  variant="light" 
                  color="default" 
                  className="mb-6" 
                  startContent={<Icon icon="lucide:arrow-left" />}
                  onPress={() => onNavigate && onNavigate("dashboard")}
                >
                  Back to Dashboard
                </Button>
                
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h1 className="text-3xl font-bold mb-4">Upgrade Your Cybersecurity Training</h1>
                  <p className="text-foreground/70 text-lg mb-6">
                    Take your skills to the next level with premium features, advanced courses, and unlimited lab access.
                  </p>
                  
                  <div className="flex justify-center mb-8">
                    <RadioGroup 
                      orientation="horizontal" 
                      value={billingCycle}
                      onValueChange={setBillingCycle}
                      classNames={{
                        wrapper: "bg-content2 p-1 rounded-lg"
                      }}
                    >
                      <Radio value="annual">Annual (Save 20%)</Radio>
                      <Radio value="monthly">Monthly</Radio>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card 
                        className={`p-6 border ${selectedPlan === plan.id ? 'border-primary' : 'border-divider'} ${plan.popular ? 'shadow-lg' : ''} h-full flex flex-col`}
                        isPressable
                        onPress={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <Badge color="primary" className="self-start mb-2">
                            Most Popular
                          </Badge>
                        )}
                        
                        <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                        
                        <div className="mb-6">
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-foreground/70"> / {billingCycle === "annual" ? "year" : "month"}</span>
                        </div>
                        
                        <Button 
                          color={plan.id === selectedPlan ? "primary" : "default"}
                          variant={plan.id === selectedPlan ? "solid" : "flat"}
                          className="mb-6"
                        >
                          {plan.id === selectedPlan ? "Selected" : "Select Plan"}
                        </Button>
                        
                        <Divider className="my-4" />
                        
                        <div className="flex-grow">
                          <h3 className="font-medium mb-3">What's included:</h3>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Icon icon="lucide:check" className="text-success" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {plan.limitations.length > 0 && (
                            <>
                              <h3 className="font-medium mb-3 text-foreground/70">Limitations:</h3>
                              <ul className="space-y-2">
                                {plan.limitations.map((limitation, index) => (
                                  <li key={index} className="flex items-center gap-2 text-foreground/70">
                                    <Icon icon="lucide:x" className="text-danger" />
                                    <span className="text-sm">{limitation}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mb-12">
                  <Button 
                    color="primary" 
                    size="lg" 
                    className="px-12"
                    onPress={() => onNavigate && onNavigate("dashboard")}
                  >
                    Upgrade to {plans.find(p => p.id === selectedPlan)?.name}
                  </Button>
                  <p className="text-foreground/70 text-sm mt-2">
                    Cancel anytime. No long-term commitment required.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <Card className="p-6 bg-content1 border border-divider">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/20">
                        <Icon icon="lucide:server" className="text-primary text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold">Unlimited Lab Access</h3>
                    </div>
                    <p className="text-foreground/70">
                      Practice in realistic environments with unlimited access to our state-of-the-art virtual labs.
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-content1 border border-divider">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/20">
                        <Icon icon="lucide:book-open" className="text-primary text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold">Premium Courses</h3>
                    </div>
                    <p className="text-foreground/70">
                      Access our full library of advanced courses taught by industry experts and security professionals.
                    </p>
                  </Card>
                  
                  <Card className="p-6 bg-content1 border border-divider">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/20">
                        <Icon icon="lucide:headphones" className="text-primary text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold">Priority Support</h3>
                    </div>
                    <p className="text-foreground/70">
                      Get fast, personalized support from our team of cybersecurity experts whenever you need help.
                    </p>
                  </Card>
                </div>
                
                <Card className="bg-content1 border border-divider p-6 mb-12">
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        question: "Can I switch plans later?",
                        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle."
                      },
                      {
                        question: "How do lab hours work?",
                        answer: "Lab hours represent the time you can spend in our virtual lab environments. Hours are reset at the beginning of each billing cycle."
                      },
                      {
                        question: "Is there a refund policy?",
                        answer: "We offer a 14-day money-back guarantee if you're not satisfied with your subscription."
                      },
                      {
                        question: "Can I share my account with others?",
                        answer: "No, accounts are for individual use only. For team access, please consider our Enterprise plan or contact us for custom team solutions."
                      },
                      {
                        question: "Do I get access to new courses as they're released?",
                        answer: "Yes, you'll get access to all new courses within your subscription tier as soon as they're released."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border-b border-divider pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium mb-2">{faq.question}</h3>
                        <p className="text-foreground/70">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
                  <p className="text-foreground/70 mb-4">
                    Our team is here to help you find the right plan for your needs.
                  </p>
                  <Button 
                    variant="flat" 
                    color="primary" 
                    startContent={<Icon icon="lucide:message-circle" />}
                    onPress={() => onNavigate && onNavigate("help")}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    };