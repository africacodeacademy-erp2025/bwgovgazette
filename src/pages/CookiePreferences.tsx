import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CookiePreferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    localStorage.setItem('cookiesAccepted', 'true');
    toast.success('Cookie preferences saved successfully');
    navigate(-1);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    localStorage.setItem('cookiesAccepted', 'true');
    toast.success('All cookies accepted');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full">
        <div className="container mx-auto">
          <div className="flex gap-4 py-12 flex-col items-start">
            <div>
              <Badge>Cookie Preferences</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
                Manage Your Cookie Preferences
              </h2>
              <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
                Choose which cookies you want to allow. You can change your preferences at any time.
              </p>
            </div>

            <div className="flex gap-6 pt-12 flex-col w-full max-w-3xl">
              <div className="border rounded-lg p-6 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="necessary" className="text-lg font-semibold cursor-default">
                    Necessary Cookies
                  </Label>
                  <Switch
                    id="necessary"
                    checked={preferences.necessary}
                    disabled
                    className="opacity-50"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly and cannot be disabled.
                </p>
              </div>

              <div className="border rounded-lg p-6 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="analytics" className="text-lg font-semibold cursor-pointer">
                    Analytics Cookies
                  </Label>
                  <Switch
                    id="analytics"
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, analytics: checked })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously.
                </p>
              </div>

              <div className="border rounded-lg p-6 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="marketing" className="text-lg font-semibold cursor-pointer">
                    Marketing Cookies
                  </Label>
                  <Switch
                    id="marketing"
                    checked={preferences.marketing}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, marketing: checked })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  These cookies are used to track visitors across websites and display relevant advertisements.
                </p>
              </div>

              <div className="border rounded-lg p-6 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="functional" className="text-lg font-semibold cursor-pointer">
                    Functional Cookies
                  </Label>
                  <Switch
                    id="functional"
                    checked={preferences.functional}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, functional: checked })
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  These cookies enable enhanced functionality and personalization features on our website.
                </p>
              </div>

              <div className="flex gap-4 mt-4">
                <Button onClick={handleSavePreferences} size="lg">
                  Save Preferences
                </Button>
                <Button onClick={handleAcceptAll} variant="outline" size="lg">
                  Accept All
                </Button>
                <Button onClick={() => navigate(-1)} variant="ghost" size="lg">
                  Cancel
                </Button>
              </div>

              <div className="border-t pt-6 mt-4">
                <p className="text-sm text-muted-foreground">
                  For more information about how we use cookies, please read our{' '}
                  <a href="/cookie-policy" className="text-primary hover:underline">
                    Cookie Policy
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
