import React from "react";
import { Icon } from "@iconify/react";
import { Button, Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Link } from "@heroui/react";

export const Navbar: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const menuItems = [
    { name: "Home", href: "#" },
    { name: "Training Paths", href: "#training-paths" },
    { name: "Labs", href: "#labs" },
    { name: "Challenges", href: "#challenges" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <HeroUINavbar 
      isMenuOpen={isMenuOpen} 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-content1/80 backdrop-blur-md border-b border-divider"
      maxWidth="xl"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Icon icon="lucide:shield-alert" className="text-primary text-2xl" />
          <p className="font-bold text-lg ml-2">CyberTrainer<span className="text-primary">X</span></p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link 
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <Button 
            as={Link} 
            href="#" 
            variant="flat" 
            color="default"
            className="mr-2"
            onPress={() => onNavigate?.("signin")}
          >
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button 
            as={Link} 
            href="#" 
            color="primary"
            variant="shadow"
            className="font-medium"
            onPress={() => onNavigate?.("signup")}
          >
            Start Training
          </Button>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarMenu className="bg-content1/95 backdrop-blur-md pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              href={item.href}
              className="w-full text-foreground/80 hover:text-primary"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="mt-6">
          <Button 
            as={Link} 
            href="#" 
            variant="flat" 
            color="default"
            className="w-full mb-2"
            onPress={() => onNavigate?.("signin")}
          >
            Login
          </Button>
          <Button 
            as={Link} 
            href="#" 
            color="primary"
            className="w-full"
            onPress={() => onNavigate?.("signup")}
          >
            Start Training
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};