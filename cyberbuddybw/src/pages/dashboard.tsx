import React from "react";
import { Icon } from "@iconify/react";
import { 
  Button, 
  Card, 
  Progress, 
  Avatar, 
  Badge, 
  Tabs, 
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider
} from "@heroui/react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "../components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "../components/dashboard/dashboard-header";
import { OverviewSection } from "../components/dashboard/overview-section";
import { RecentActivitySection } from "../components/dashboard/recent-activity-section";
import { ChallengesSection } from "../components/dashboard/challenges-section";
import { LearningPathsSection } from "../components/dashboard/learning-paths-section";
import { CoursesSection } from "../components/dashboard/courses-section";
import { LabsSection } from "../components/dashboard/labs-section";
import { AchievementsSection } from "../components/dashboard/achievements-section";
import { CommunitySection } from "../components/dashboard/community-section";
import { ChallengePage } from "./challenge-page";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [activePage, setActivePage] = React.useState("overview");
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Add this function to handle sidebar navigation
  const handleSidebarNavigation = (page: string) => {
    setActivePage(page);
    if (page === "dashboard") {
      setSelectedTab("overview");
    } else {
      setSelectedTab(page);
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        onNavigate={onNavigate} 
        onPageChange={handleSidebarNavigation}
        activePage={activePage}
      />
      
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-60' : 'ml-[72px]'} transition-all duration-200`}>
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          onNavigate={onNavigate} 
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Welcome back, <span className="text-primary">John</span></h1>
              <p className="text-foreground/70">Continue your cybersecurity journey</p>
            </div>
            
            <Tabs 
              aria-label="Dashboard tabs" 
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab as any}
              classNames={{
                tabList: "bg-content1 p-1 rounded-lg",
                cursor: "bg-content3",
                tab: "data-[selected=true]:text-primary"
              }}
            >
              <Tab key="overview" title="Overview">
                <div className="mt-6 space-y-6">
                  <OverviewSection />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <RecentActivitySection />
                    </div>
                    <div>
                      <ChallengesSection onNavigate={onNavigate} />
                    </div>
                  </div>
                  <LearningPathsSection onNavigate={onNavigate} />
                </div>
              </Tab>
              <Tab key="courses" title="Courses">
                <div className="mt-6">
                  <CoursesSection onNavigate={onNavigate} />
                </div>
              </Tab>
              <Tab key="labs" title="Labs">
                <div className="mt-6">
                  <LabsSection onNavigate={onNavigate} />
                </div>
              </Tab>
              <Tab key="challenges" title="Challenges">
                <div className="mt-6">
                  <ChallengePage onNavigate={onNavigate} />
                </div>
              </Tab>
              <Tab key="learning-paths" title="Learning Paths">
                <div className="mt-6">
                  <LearningPathsSection fullView={true} onNavigate={onNavigate} />
                </div>
              </Tab>
              <Tab key="achievements" title="Achievements">
                <div className="mt-6">
                  <AchievementsSection />
                </div>
              </Tab>
              <Tab key="community" title="Community">
                <div className="mt-6">
                  <CommunitySection />
                </div>
              </Tab>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};