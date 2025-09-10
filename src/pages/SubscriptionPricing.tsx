import { Check, Minus, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
        </div>
      </header>

      <div className="w-full py-8">
        <div className="container mx-auto">
          <div className="flex text-center justify-center items-center gap-3 flex-col">
            <Badge>Subscription Plans</Badge>
            <div className="flex gap-1 flex-col">
              <h1 className="text-2xl md:text-4xl tracking-tighter max-w-xl text-center font-regular">
                Never Miss an Important <span className="text-primary">Gazette Alert</span>
              </h1>
              <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
                Stay informed with real-time notifications for official gazettes, tenders, and public notices.
              </p>
            </div>
            <div className="grid text-left w-full grid-cols-3 lg:grid-cols-4 divide-x pt-8">
              <div className="col-span-3 lg:col-span-1"></div>
              <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col">
                <p className="text-2xl">Basic</p>
                <p className="text-sm text-muted-foreground">
                  Perfect for individuals who need basic gazette notifications and access to recent publications.
                </p>
                <p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
                  <span className="text-4xl">Free</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>
                <Button variant="outline" className="gap-4 mt-8" onClick={() => navigate('/signup')}>
                  Get Started <MoveRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col">
                <p className="text-2xl">Professional</p>
                <p className="text-sm text-muted-foreground">
                  Advanced alerts, keyword filtering, and priority access to new publications for professionals.
                </p>
                <p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
                  <span className="text-4xl">$29</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>
                <Button className="gap-4 mt-8" onClick={() => navigate('/signup')}>
                  Try it <MoveRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col">
                <p className="text-2xl">Enterprise</p>
                <p className="text-sm text-muted-foreground">
                  Custom solutions for organizations with API access, bulk downloads, and dedicated support.
                </p>
                <p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
                  <span className="text-4xl">$99</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>
                <Button variant="outline" className="gap-4 mt-8">
                  Contact us <PhoneCall className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
                <b>Features</b>
              </div>
              <div></div>
              <div></div>
              <div></div>
              
              <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">Email Alerts</div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              
              <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
                Advanced Filtering
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Minus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              
              <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
                SMS Notifications
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Minus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              
              <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
                Daily Alerts
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <p className="text-muted-foreground text-sm">5 per day</p>
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <p className="text-muted-foreground text-sm">50 per day</p>
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <p className="text-muted-foreground text-sm">Unlimited</p>
              </div>
              
              <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
                API Access
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Minus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Minus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              
              <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
                Priority Support
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Minus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}