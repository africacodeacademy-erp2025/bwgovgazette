"use client";

import React from 'react';
import { Mail, MessageSquare, Phone, MapPin, Clock, LifeBuoy } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex text-center justify-center items-center gap-4 flex-col mb-10">
            <div className="px-3 py-1 border rounded-full text-xs">Contact</div>
            <div className="flex gap-2 flex-col">
              <h1 className="text-3xl md:text-5xl tracking-tighter max-w-3xl text-center font-regular">We’re here to help</h1>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                Questions about subscriptions, features, or access? Reach out and we’ll respond promptly.
              </p>
            </div>
          </div>

          <div className="grid text-left w-full grid-cols-1 md:grid-cols-2 gap-6">
            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Email Support</h2>
              </div>
              <p className="text-muted-foreground">
                support@govgazette.example
              </p>
            </div>

            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Phone</h2>
              </div>
              <p className="text-muted-foreground">
                +1 (000) 123-4567
              </p>
            </div>

            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Office</h2>
              </div>
              <p className="text-muted-foreground">
                Gaborone, Botswana (remote-first team)
              </p>
            </div>

            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Hours</h2>
              </div>
              <p className="text-muted-foreground">
                Mon–Fri, 9:00–17:00 (CAT)
              </p>
            </div>
          </div>

          <div className="mt-10 grid text-left w-full grid-cols-1 md:grid-cols-2 gap-6">
            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">General Inquiries</h2>
              </div>
              <p className="text-muted-foreground">
                Have a question about how the platform works? We can help you search gazettes, view documents, and manage your account.
              </p>
            </div>
            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <LifeBuoy className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Account & Billing</h2>
              </div>
              <p className="text-muted-foreground">
                Need help with your subscription or payment? Our team can assist with plan changes and billing issues.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

