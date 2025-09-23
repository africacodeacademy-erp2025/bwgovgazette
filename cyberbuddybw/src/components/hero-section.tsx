import React from "react";
import { Icon } from "@iconify/react";
import { Button, Card } from "@heroui/react";
import { motion } from "framer-motion";

export const HeroSection: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <section className="relative grid-background py-20 lg:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-primary text-glow">Hack</span> to Defend.<br />
                <span className="typing-animation">Learn by Breaking.</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Master cybersecurity through hands-on training. Real-world scenarios, 
                CTF challenges, and guided labs to transform you into an elite security professional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  color="primary" 
                  size="lg"
                  className="font-medium text-base animated-border"
                  startContent={<Icon icon="lucide:shield" />}
                  onPress={() => onNavigate?.("signup")}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="bordered" 
                  color="default" 
                  size="lg"
                  className="font-medium text-base"
                  startContent={<Icon icon="lucide:play" />}
                >
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-content2 border border-content1 flex items-center justify-center text-xs"
                    >
                      <Icon icon="lucide:user" className="text-foreground/70" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-foreground/70">
                  <span className="text-primary font-medium">10,000+</span> security professionals trained
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-content1 border border-divider p-4 box-glow">
              <div className="bg-content2 rounded-md p-2 mb-3 flex items-center">
                <div className="flex gap-1.5 mr-3">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="text-xs text-foreground/70 font-mono">terminal - ssh root@cybertrainer.local</div>
              </div>
              <div className="font-mono text-sm p-2">
                <p className="text-primary">root@cybertrainer:~#</p>
                <p className="mb-2">Starting vulnerability scan...</p>
                <p className="text-foreground/70 mb-1">[+] Scanning target: 192.168.1.100</p>
                <p className="text-foreground/70 mb-1">[+] Open ports: 22, 80, 443, 3306</p>
                <p className="text-foreground/70 mb-1">[+] Detected services: SSH, HTTP, HTTPS, MySQL</p>
                <p className="text-warning mb-1">[!] Vulnerable service detected: OpenSSH 7.5p1</p>
                <p className="text-danger mb-1">[!] CVE-2017-15906 identified</p>
                <p className="mb-2">Exploiting vulnerability...</p>
                <p className="text-success mb-1">[+] Access gained!</p>
                <p className="text-primary">root@target:~#</p>
                <p className="animate-pulse">_</p>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: "lucide:server", label: "500+ Labs" },
            { icon: "lucide:flag", label: "200+ CTF Challenges" },
            { icon: "lucide:award", label: "Industry Recognized" },
            { icon: "lucide:users", label: "Active Community" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-content2 border border-divider flex items-center justify-center mb-3">
                <Icon icon={item.icon} className="text-primary text-xl" />
              </div>
              <p className="font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};