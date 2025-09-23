import React from "react";
import { Icon } from "@iconify/react";
import { 
  Button, 
  Card, 
  Input, 
  Checkbox, 
  Link, 
  Divider 
} from "@heroui/react";
import { motion } from "framer-motion";

interface SignInProps {
  onNavigate: (page: string) => void;
}

export const SignIn: React.FC<SignInProps> = ({ onNavigate }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Fix the handleSignIn function to properly navigate to dashboard
  const handleSignIn = () => {
    if (!email || !password) return;
    
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
            <h2 className="mt-6 text-3xl font-bold">
              Welcome <span className="text-primary text-glow">back</span>
            </h2>
            <p className="mt-2 text-foreground/70">
              Sign in to continue to your account
            </p>
          </div>
          
          <Card className="p-6 bg-content1 border border-divider">
            <div className="space-y-6">
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
              
              <Input
                label="Password"
                placeholder="Enter your password"
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
              
              <div className="flex items-center justify-between">
                <Checkbox 
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  color="primary"
                >
                  <span className="text-sm">Remember me</span>
                </Checkbox>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                color="primary" 
                className="w-full font-medium animated-border"
                onPress={handleSignIn}
                isLoading={isLoading}
              >
                Sign In
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
              Don't have an account?{" "}
              <Link 
                className="text-primary hover:underline cursor-pointer" 
                onPress={() => onNavigate("signup")}
              >
                Sign up
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
              <div className="bg-content2 rounded-md p-2 mb-3 flex items-center">
                <div className="flex gap-1.5 mr-3">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="text-xs text-foreground/70 font-mono">terminal - ssh user@cybertrainer.local</div>
              </div>
              <div className="font-mono text-sm p-2">
                <p className="text-primary">user@cybertrainer:~#</p>
                <p className="mb-2">Authenticating user...</p>
                <p className="text-success mb-1">[+] Authentication successful</p>
                <p className="text-foreground/70 mb-1">[+] Welcome back, John Doe</p>
                <p className="text-foreground/70 mb-1">[+] Last login: Today at 10:23 AM</p>
                <p className="text-warning mb-1">[!] 3 new security alerts detected</p>
                <p className="text-primary mb-1">[+] Loading dashboard...</p>
                <p className="text-success mb-1">[+] Ready</p>
                <p className="text-primary">user@cybertrainer:~#</p>
                <p className="animate-pulse">_</p>
              </div>
            </Card>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};