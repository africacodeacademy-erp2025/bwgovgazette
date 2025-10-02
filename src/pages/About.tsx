"use client";

import React, { useState, useEffect } from 'react';
import { Feature } from '@/components/ui/feature-with-advantages';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner-1';
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { toast } from 'sonner';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const startFreePlan = () => {
    localStorage.setItem('plan_choice', 'free');
    toast.success('Continuing with Free plan');
    setShowPricingModal(false);
  };

  const handleSubscribeClick = () => {
    toast.info('Redirecting to checkout...');
    setShowPricingModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={50} />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={() => setShowPricingModal(true)} size="lg">
          Upgrade Now
        </Button>
      </div>
      
      <Feature />

      <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
        <DialogContent className="max-w-5xl py-6">
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
          </DialogHeader>
          <SubscriptionPricing onSelectFree={startFreePlan} onSelectPaid={handleSubscribeClick} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

