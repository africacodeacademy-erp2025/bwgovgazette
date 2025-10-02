"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      
      <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-1/4 md:right-auto md:-translate-x-1/2 z-50">
        <Card className="w-full md:w-[350px] shadow-lg rounded-2xl border bg-background text-foreground">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🍪</span>
                <h2 className="font-semibold">Cookie Notice</h2>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                We use cookies to ensure that we give you the best experience on
                our website.{" "}
                <a
                  href="/cookie-policy"
                  className="underline text-primary hover:text-primary/80"
                >
                  Read cookies policies.
                </a>
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
                <a
                  href="/cookie-preferences"
                  className="text-xs sm:text-sm underline hover:text-primary transition order-2 sm:order-1"
                >
                  Manage your preferences
                </a>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className={cn(
                    "rounded-lg px-4 py-1 text-white order-1 sm:order-2 w-full sm:w-auto",
                    "bg-primary hover:bg-primary/90"
                  )}
                >
                  Accept
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}