import * as React from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, Search, Gavel, Heart, Bell, Settings, ChevronLeft, ChevronRight } from "lucide-react";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "3.05rem" }
};

const variants = {
  open: { x: 0, opacity: 1 },
  closed: { x: -20, opacity: 0, transition: { duration: 0.2 } }
};

const transitionProps = {
  type: "tween" as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.2
};

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (o: boolean) => void;
  userName: string;
  currentPlan: string | null;
  onUpgradeClick: () => void;
}

export function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  userName,
  currentPlan,
  onUpgradeClick
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Search Gazettes", href: "/search", icon: Search },
    { name: "Browse Tenders", href: "/tenders", icon: Gavel },
    { name: "Saved Items", href: "/saved", icon: Heart },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings }
  ];

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
      <motion.div 
        className={cn(
          "fixed left-0 z-40 h-full shrink-0 border-r bg-white",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        initial={false}
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        transition={transitionProps}
      >
        <div className="relative z-40 flex h-full shrink-0 flex-col bg-white">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 items-center justify-between border-b p-2">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Gazette Portal Logo" className="w-8 h-8 rounded-lg object-contain" />
                <motion.div variants={variants}>
                  {!isCollapsed && <p className="text-sm font-medium text-gray-900">Gazette Portal</p>}
                </motion.div>
              </div>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className="hidden md:flex p-1.5 rounded-md hover:bg-gray-100"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            
            <div className="flex h-full w-full flex-col">
              <div className="p-2">
                <motion.div 
                  variants={variants} 
                  className={cn(
                    "rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all",
                    isCollapsed && "p-2"
                  )}
                >
                  {!isCollapsed ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          currentPlan === 'subscriber' ? 'bg-green-500' : 'bg-yellow-500'
                        )} />
                        <span className="text-xs font-medium text-gray-700">
                          {currentPlan === 'subscriber' ? 'Subscriber Plan' : 'Free Plan'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {currentPlan === 'subscriber' ? 'Full access enabled.' : 'Basic access to search.'}
                      </p>
                      {currentPlan !== 'subscriber' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full mt-2" 
                          onClick={onUpgradeClick}
                        >
                          Upgrade
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        currentPlan === 'subscriber' ? 'bg-green-500' : 'bg-yellow-500'
                      )} />
                    </div>
                  )}
                </motion.div>
              </div>
              
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className="flex w-full flex-col gap-1">
                    {navigationItems.map(item => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={({ isActive }) => cn(
                            "flex h-9 w-full flex-row items-center rounded-md px-2 py-1.5 transition",
                            isActive 
                              ? "bg-gray-900 text-white hover:bg-gray-800" 
                              : "hover:bg-gray-100"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <motion.div variants={variants}>
                            {!isCollapsed && <p className="ml-2 text-sm font-medium">{item.name}</p>}
                          </motion.div>
                        </NavLink>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="p-2 border-t">
                <motion.div 
                  variants={variants} 
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer" 
                  onClick={() => navigate('/settings')}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-200 text-xs">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentPlan ? `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan` : 'No Plan'}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
