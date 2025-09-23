import React from "react";
import { Icon } from "@iconify/react";
import { Link, Divider } from "@heroui/react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Learning Paths", href: "#training-paths" },
        { name: "Labs", href: "#labs" },
        { name: "Challenges", href: "#challenges" },
        { name: "Pricing", href: "#pricing" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press", href: "#" },
        { name: "Partners", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Community", href: "#" },
        { name: "Knowledge Base", href: "#" },
        { name: "API", href: "#" },
        { name: "Status", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
        { name: "Security", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-content1 border-t border-divider pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Icon icon="lucide:shield-alert" className="text-primary text-2xl" />
              <p className="font-bold text-lg ml-2">CyberTrainer<span className="text-primary">X</span></p>
            </div>
            <p className="text-foreground/70 mb-4 max-w-md">
              Empowering security professionals through hands-on training and realistic cyber challenges.
            </p>
            <div className="flex space-x-4">
              {["lucide:twitter", "lucide:github", "lucide:linkedin", "lucide:youtube", "lucide:discord"].map((icon, index) => (
                <Link key={index} href="#" className="text-foreground/70 hover:text-primary transition-colors">
                  <Icon icon={icon} className="text-xl" />
                </Link>
              ))}
            </div>
          </div>
          
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href}
                      className="text-foreground/70 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Divider className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm mb-4 md:mb-0">
            © {currentYear} CyberTrainerX. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};