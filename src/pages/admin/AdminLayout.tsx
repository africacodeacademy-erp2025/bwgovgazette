"use client";

import * as React from "react";
import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, FileText, Upload, Users as UsersIcon, Menu, X, ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';

// Utility function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

// Animation variants
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

const navigationItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Manage Gazettes', href: '/admin/gazettes', icon: FileText },
  { name: 'Upload Document', href: '/admin/upload', icon: Upload },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Profile', href: '/admin/profile', icon: User },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
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
            {/* Header */}
            <div className="flex h-[54px] w-full shrink-0 items-center justify-between border-b p-2">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="Admin Portal Logo" 
                  className="w-8 h-8 rounded-lg object-contain" 
                />
                <motion.div variants={variants}>
                  {!isCollapsed && (
                    <p className="text-sm font-medium text-gray-900">Admin Portal</p>
                  )}
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

            {/* Navigation */}
            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className="flex w-full flex-col gap-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      
                      return (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex h-9 w-full flex-row items-center rounded-md px-2 py-1.5 transition",
                            isActive 
                              ? "bg-gray-900 text-white hover:bg-gray-800" 
                              : "hover:bg-gray-100"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <motion.div variants={variants}>
                            {!isCollapsed && (
                              <p className="ml-2 text-sm font-medium">{item.name}</p>
                            )}
                          </motion.div>
                        </NavLink>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Footer */}
              <div className="p-2 border-t">
                <motion.div 
                  variants={variants} 
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-200 text-xs">
                      {displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">Admin</p>
                    </div>
                  )}
                  {!isCollapsed && <LogOut className="h-4 w-4 text-gray-500" />}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Main Content */}
      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

