import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full">
        <div className="container mx-auto">
          <div className="flex gap-4 py-12 flex-col items-start">
            <div>
              <Badge>Cookie Policy</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
                Understanding How We Use Cookies
              </h2>
              <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
                Cookies help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </div>

            <div className="flex gap-10 pt-12 flex-col w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="flex flex-row gap-6 w-full items-start">
                  <Check className="w-4 h-4 mt-2 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">What Are Cookies</p>
                    <p className="text-muted-foreground text-sm">
                      Cookies are small text files placed on your device when you visit our website. 
                      They help us provide better functionality and remember your preferences.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-6 items-start">
                  <Check className="w-4 h-4 mt-2 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Necessary Cookies</p>
                    <p className="text-muted-foreground text-sm">
                      Essential for the website to function properly. They enable basic functions like 
                      page navigation and access to secure areas.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-6 items-start">
                  <Check className="w-4 h-4 mt-2 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Analytics Cookies</p>
                    <p className="text-muted-foreground text-sm">
                      Help us understand how visitors interact with our website by collecting and reporting 
                      information anonymously to improve performance.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-6 w-full items-start">
                  <Check className="w-4 h-4 mt-2 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Marketing Cookies</p>
                    <p className="text-muted-foreground text-sm">
                      Used to track visitors across websites to display relevant and engaging ads 
                      for individual users and advertisers.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-6 items-start">
                  <Check className="w-4 h-4 mt-2 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Functional Cookies</p>
                    <p className="text-muted-foreground text-sm">
                      Enable enhanced functionality and personalization. They may be set by us or 
                      third party providers whose services we've added.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-6 items-start">
                  <Check className="w-4 h-4 mt-2 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Managing Your Cookies</p>
                    <p className="text-muted-foreground text-sm">
                      You can control cookies in various ways. Note that removing or blocking cookies 
                      may impact your experience. Visit our{' '}
                      <a href="/cookie-preferences" className="text-primary hover:underline">
                        Cookie Preferences
                      </a>{' '}
                      page anytime.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-10 mt-6">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Changes to This Policy</h3>
                    <p className="text-muted-foreground">
                      We may update our Cookie Policy from time to time. We will notify you of any changes 
                      by posting the new Cookie Policy on this page and updating the "last updated" date.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
                    <p className="text-muted-foreground">
                      If you have any questions about our Cookie Policy, please{' '}
                      <a href="/contact" className="text-primary hover:underline">
                        contact us
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
