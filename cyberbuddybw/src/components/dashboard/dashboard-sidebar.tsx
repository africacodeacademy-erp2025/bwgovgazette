import React from "react";
import { Icon } from "@iconify/react";
import { Button, Tooltip, Divider } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardSidebarProps {
  isOpen: boolean;
  onNavigate: (page: string) => void;
  onPageChange?: (page: string) => void;
  activePage?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  isOpen,
  onNavigate,
  onPageChange,
  activePage = "dashboard"
}) => {
  // Update the sidebar items to include Simulations
  const menuItems = [
    { icon: "lucide:layout-dashboard", label: "Dashboard", page: "dashboard", active: activePage === "dashboard" },
    { icon: "lucide:book-open", label: "Courses", page: "courses", active: activePage === "courses" },
    { icon: "lucide:server", label: "Labs", page: "labs", active: activePage === "labs" },
    { icon: "lucide:flag", label: "Challenges", page: "challenges", active: activePage === "challenges" },
    { icon: "lucide:target", label: "Learning Paths", page: "learning-paths", active: activePage === "learning-paths" },
    { icon: "lucide:terminal", label: "Simulations", page: "simulations", active: activePage === "simulations" },
    { icon: "lucide:trophy", label: "Achievements", page: "achievements", active: activePage === "achievements" },
    { icon: "lucide:users", label: "Community", page: "community", active: activePage === "community" },
  ];
  
  // Ensure the navigation works correctly
  const bottomItems = [
    { icon: "lucide:settings", label: "Settings", active: false, onClick: () => onNavigate("settings") },
    { icon: "lucide:help-circle", label: "Help", active: false, onClick: () => onNavigate("help") },
    { icon: "lucide:log-out", label: "Logout", active: false, onClick: () => onNavigate("landing") },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ width: isOpen ? 240 : 72 }}
        animate={{ width: isOpen ? 240 : 72 }}
        transition={{ duration: 0.2 }}
        className="h-screen bg-content1 border-r border-divider flex flex-col fixed left-0 top-0 z-40"
      >
        <div className="p-4 flex items-center h-16">
          {isOpen ? (
            <div className="flex items-center">
              <Icon icon="lucide:shield-alert" className="text-primary text-xl" />
              <p className="font-bold text-lg ml-2">CyberTrainer<span className="text-primary">X</span></p>
            </div>
          ) : (
            <Icon icon="lucide:shield-alert" className="text-primary text-xl mx-auto" />
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Tooltip
                key={index}
                content={item.label}
                placement="right"
                isDisabled={isOpen}
              >
                <Button
                  className={`w-full justify-start ${isOpen ? 'px-4' : 'justify-center'}`}
                  variant={item.active ? "flat" : "light"}
                  color={item.active ? "primary" : "default"}
                  startContent={<Icon icon={item.icon} className={item.active ? "text-primary" : ""} />}
                  onPress={() => {
                    if (item.page === "simulations") {
                      onNavigate("simulations");
                    } else {
                      onPageChange?.(item.page);
                    }
                  }}
                >
                  {isOpen && <span>{item.label}</span>}
                </Button>
              </Tooltip>
            ))}
          </div>
          
          {isOpen && (
            <div className="mt-8 px-4">
              <div className="bg-content2 rounded-lg p-4 border border-divider">
                <div className="flex items-center mb-2">
                  <Icon icon="lucide:zap" className="text-primary mr-2" />
                  <span className="font-medium">Pro Upgrade</span>
                </div>
                <p className="text-xs text-foreground/70 mb-3">
                  Unlock advanced features and premium content
                </p>
                <Button size="sm" color="primary" className="w-full" onPress={() => onNavigate("upgrade")}>
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-divider">
          {bottomItems.map((item, index) => (
            <Tooltip
              key={index}
              content={item.label}
              placement="right"
              isDisabled={isOpen}
            >
              <Button
                className={`w-full justify-start ${isOpen ? 'px-4' : 'justify-center'} mb-1`}
                variant="light"
                color="default"
                startContent={<Icon icon={item.icon} />}
                onPress={item.onClick}
              >
                {isOpen && <span>{item.label}</span>}
              </Button>
            </Tooltip>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};