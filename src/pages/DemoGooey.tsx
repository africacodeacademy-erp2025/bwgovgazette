"use client";

import React from 'react';
import { GooeyMarquee } from "@/components/ui/gooey-marquee";

export default function DemoGooey() {
  return (
    <div className="min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <GooeyMarquee text="Design creates culture." />

        <p className="text-xl mt-8 text-primary/60">
          The component uses two text layers - a blurred background layer with high contrast filtering and linear gradients for the gooey effect, and a clean foreground layer for readability.
        </p>
      </div>
    </div>
  )
}

