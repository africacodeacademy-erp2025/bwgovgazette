import React from "react";
import { Icon } from "@iconify/react";
import { 
  Button, 
  Card, 
  Input, 
  Checkbox, 
  Link, 
  Divider,
  Tooltip
} from "@heroui/react";
import { motion } from "framer-motion";

interface SignUpProps {
  onNavigate: (page: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const passwordStrength = React.useMemo(() => {
    if (!password) return { score: 0, text: "" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const strengthText = [
      "", 
      "Weak", 
      "Fair", 
      "Good", 
      "Strong", 
      "Excellent"
    ];
    
    return { score, text: strengthText[score] };
  }, [password]);

  const getStrengthColor = () => {
    const colors = ["", "danger", "warning", "warning", "success", "primary"];
    return colors[passwordStrength.score] || "";
  };

  const handleSignUp = () => {
    if (!name || !email || !password || !agreeTerms) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onNavigate("dashboard"); // Make sure this works
    }, 1000); // Reduced timeout for faster navigation
  };

  return (
    <div className="h-screen grid-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="flex w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div 
              className="mx-auto h-12 w-12 bg-content1 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => onNavigate("landing")}
            >
              <Icon icon="lucide:shield-alert" className="text-primary text-2xl" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">
              Create your <span className="text-primary text-glow">account</span>
            </h2>
            <p className="mt-2 text-foreground/70">
              Join thousands of security professionals
            </p>
          </div>
          
          <Card className="p-6 bg-content1 border border-divider">
            <div className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onValueChange={setName}
                classNames={{
                  input: "text-foreground",
                  inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2",
                  label: "text-foreground"
                }}
                startContent={
                  <Icon icon="lucide:user" className="text-foreground/50" />
                }
              />
              
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onValueChange={setEmail}
                classNames={{
                  input: "text-foreground",
                  inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2",
                  label: "text-foreground"
                }}
                startContent={
                  <Icon icon="lucide:mail" className="text-foreground/50" />
                }
              />
              
              <div className="space-y-2">
                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onValueChange={setPassword}
                  classNames={{
                    input: "text-foreground",
                    inputWrapper: "bg-content2 data-[hover=true]:bg-content2 data-[focus=true]:bg-content2",
                    label: "text-foreground"
                  }}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <Icon icon="lucide:eye-off" className="text-foreground/50" />
                      ) : (
                        <Icon icon="lucide:eye" className="text-foreground/50" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  startContent={
                    <Icon icon="lucide:lock" className="text-foreground/50" />
                  }
                />
                
                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1 w-full max-w-[200px]">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i}
                            className={`h-1 rounded-full flex-1 ${
                              i <= passwordStrength.score 
                                ? `bg-${getStrengthColor()}` 
                                : "bg-foreground/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs text-${getStrengthColor()}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Icon 
                          icon={password.length >= 8 ? "lucide:check" : "lucide:x"} 
                          className={password.length >= 8 ? "text-success" : "text-foreground/50"} 
                          width={14}
                        />
                        <span className="text-foreground/70">8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon 
                          icon={/[A-Z]/.test(password) ? "lucide:check" : "lucide:x"} 
                          className={/[A-Z]/.test(password) ? "text-success" : "text-foreground/50"} 
                          width={14}
                        />
                        <span className="text-foreground/70">Uppercase</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon 
                          icon={/[0-9]/.test(password) ? "lucide:check" : "lucide:x"} 
                          className={/[0-9]/.test(password) ? "text-success" : "text-foreground/50"} 
                          width={14}
                        />
                        <span className="text-foreground/70">Number</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon 
                          icon={/[^A-Za-z0-9]/.test(password) ? "lucide:check" : "lucide:x"} 
                          className={/[^A-Za-z0-9]/.test(password) ? "text-success" : "text-foreground/50"} 
                          width={14}
                        />
                        <span className="text-foreground/70">Special char</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Checkbox 
                isSelected={agreeTerms}
                onValueChange={setAgreeTerms}
                color="primary"
              >
                <span className="text-sm">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>
              
              <Button 
                color="primary" 
                className="w-full font-medium animated-border"
                onPress={handleSignUp}
                isDisabled={!name || !email || !password || !agreeTerms || passwordStrength.score < 3}
                isLoading={isLoading}
              >
                Create Account
              </Button>
              
              <div className="relative my-6">
                <Divider className="absolute inset-0 flex items-center" />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-content1 px-2 text-foreground/50">OR</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="bordered" 
                  className="w-full"
                  startContent={<Icon icon="logos:google-icon" />}
                >
                  Google
                </Button>
                <Button 
                  variant="bordered" 
                  className="w-full"
                  startContent={<Icon icon="logos:github-icon" />}
                >
                  GitHub
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="text-center mt-6">
            <p className="text-foreground/70">
              Already have an account?{" "}
              <Link 
                className="text-primary hover:underline cursor-pointer" 
                onPress={() => onNavigate("signin")}
              >
                Sign in
              </Link>
            </p>
            <p className="mt-2">
              <Link 
                className="text-foreground/50 hover:text-foreground/70 text-sm cursor-pointer"
                onPress={() => onNavigate("landing")}
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="hidden lg:flex flex-1 items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full max-w-md">
            <Card className="bg-content1 border border-divider p-4 box-glow">
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold mb-4">Join Our Cybersecurity Community</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                        <img 
                          src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${i+10}`}
                          alt="Community member"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">John Doe {i}</p>
                      <p className="text-xs text-foreground/70">Security Expert</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary/20 rounded-full"></div>
                    <span>Access to 500+ hands-on labs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary/20 rounded-full"></div>
                    <span>Weekly CTF challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary/20 rounded-full"></div>
                    <span>Structured learning paths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary/20 rounded-full"></div>
                    <span>Active community support</span>
                  </div>
                </div>
              </div>
            </Card>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};