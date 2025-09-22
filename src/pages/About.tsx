"use client";

import React from 'react';
import { Search, Download, Bell, BadgeCheck, Shield, FileText } from 'lucide-react';
import { Feature } from '@/components/ui/feature-with-image-carousel';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex text-center justify-center items-center gap-4 flex-col mb-10">
            <div className="px-3 py-1 border rounded-full text-xs">About</div>
            <div className="flex gap-2 flex-col">
              <h1 className="text-3xl md:text-5xl tracking-tighter max-w-3xl text-center font-regular">Building the most accessible way to read official Gazettes</h1>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                We make authoritative information easy to find, searchable, and available to everyone.
              </p>
            </div>
          </div>

          <div className="grid text-left w-full grid-cols-1 md:grid-cols-2 gap-6">
            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Search & Browse</h2>
              </div>
              <p className="text-muted-foreground mb-3">
                Find the documents you need quickly with full-text search and helpful filters.
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>OCR-enabled search across titles and content</li>
                <li>Filter by timeframe and relevance</li>
                <li>Clean results view with key details</li>
              </ul>
            </div>

            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Download className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Read & Download</h2>
              </div>
              <p className="text-muted-foreground mb-3">
                Access content in your preferred format—online viewing or downloadable PDFs.
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Fast, responsive viewer for the web</li>
                <li>Download copies for offline use</li>
                <li>Clear titles, dates, and categories</li>
              </ul>
            </div>

            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Instant Alerts</h2>
              </div>
              <p className="text-muted-foreground mb-3">
                Subscribe to get notified as soon as new gazettes are published.
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Email notifications for fresh publications</li>
                <li>Personalized dashboard to manage your plan</li>
                <li>Clear upgrade path from Free to Subscriber</li>
              </ul>
            </div>

            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Accessible & Trusted</h2>
              </div>
              <p className="text-muted-foreground mb-3">
                Built for reliability and clarity so you can trust what you read.
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Verified documents with dates and categories</li>
                <li>24/7 availability with a modern web experience</li>
                <li>Simple, transparent subscription pricing</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 grid text-left w-full grid-cols-1 md:grid-cols-2 gap-6">
            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
              </div>
              <p className="text-muted-foreground">
                We follow industry-standard best practices to safeguard your account and data.
              </p>
            </div>
            <div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">What’s Next</h2>
              </div>
              <p className="text-muted-foreground">
                We’re continuously improving search, expanding coverage, and refining the reading experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Feature />
    </div>
  );
}

