"use client";

import React from 'react';
import { Search, Download, Bell, BadgeCheck, Shield, FileText } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">About govgazette</h1>
            <p className="text-muted-foreground text-lg">
              govgazette is a modern platform for discovering, reading, and tracking official gazettes and public notices. 
              Our goal is to make authoritative information easy to find, searchable, and available to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-background">
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

            <div className="border border-border rounded-lg p-6 bg-background">
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

            <div className="border border-border rounded-lg p-6 bg-background">
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

            <div className="border border-border rounded-lg p-6 bg-background">
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

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-background">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
              </div>
              <p className="text-muted-foreground">
                We follow industry-standard best practices to safeguard your account and data.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-background">
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
    </div>
  );
}

