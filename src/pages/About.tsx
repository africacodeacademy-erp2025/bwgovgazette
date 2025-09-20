"use client";

import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About</h1>
          <p className="text-muted-foreground text-lg">
            govgazette is your trusted source for official gazettes and public notices. We make it simple to search, read, and download authoritative documents — anytime, anywhere.
          </p>
        </div>
      </section>
    </div>
  );
}

