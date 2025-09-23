import React from "react";
import { Icon } from "@iconify/react";
import { 
  Button, 
  Avatar, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Badge,
  Input
} from "@heroui/react";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  onNavigate: (page: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  toggleSidebar,
  onNavigate
}) => {
  return (
    <header className="h-16 border-b border-divider bg-content1 flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center">
        <Button
          isIconOnly
          variant="light"
          onPress={toggleSidebar}
          className="mr-2"
        >
          <Icon icon="lucide:menu" />
        </Button>
        
        <div className="hidden md:block relative">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[18rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal bg-content2 border-none hover:bg-content3",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<Icon icon="lucide:search" className="text-foreground/50" />}
            type="search"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="light"
          className="hidden sm:flex"
        >
          <Icon icon="lucide:search" className="sm:hidden" />
        </Button>
        
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              className="relative"
            >
              <Icon icon="lucide:bell" />
              <Badge color="danger" content="5" shape="circle" size="sm" className="absolute top-1 right-1" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Notifications" className="w-80">
            <DropdownItem key="notifications" className="h-auto p-0" textValue="Notifications">
              <div className="flex flex-col gap-1 p-2">
                <p className="text-small font-medium">Notifications</p>
                <p className="text-tiny text-foreground/50">You have 5 unread notifications</p>
              </div>
            </DropdownItem>
            <DropdownItem key="new_challenge" textValue="New challenge available" description="A new web security challenge is available">
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Icon icon="lucide:flag" className="text-primary" />
                </div>
                <span>New challenge available</span>
              </div>
            </DropdownItem>
            <DropdownItem key="achievement" textValue="Achievement unlocked" description="You've earned the 'First Blood' badge">
              <div className="flex items-center gap-2">
                <div className="bg-success/20 p-2 rounded-full">
                  <Icon icon="lucide:award" className="text-success" />
                </div>
                <span>Achievement unlocked</span>
              </div>
            </DropdownItem>
            <DropdownItem key="view_all" className="text-primary" textValue="View all notifications">
              View all notifications
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="John Doe"
              size="sm"
              src="https://img.heroui.chat/image/avatar?w=150&h=150&u=15"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">johndoe@example.com</p>
            </DropdownItem>
            <DropdownItem key="profile_settings" textValue="Profile Settings" onPress={() => onNavigate("settings")}>
              Profile Settings
            </DropdownItem>
            <DropdownItem key="team_settings" textValue="Team Settings" onPress={() => onNavigate("settings")}>
              Team Settings
            </DropdownItem>
            <DropdownItem key="analytics" textValue="Analytics">
              Analytics
            </DropdownItem>
            <DropdownItem key="help_and_feedback" textValue="Help & Feedback" onPress={() => onNavigate("help")}>
              Help & Feedback
            </DropdownItem>
            <DropdownItem key="logout" color="danger" textValue="Log Out" onPress={() => onNavigate("landing")}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};