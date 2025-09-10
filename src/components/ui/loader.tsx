import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: number;
}

export function Loader({ className, size = 200 }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <svg className="w-0 h-0">
          <defs>
            <filter id="loader-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation={7} result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" result="inreGegga" />
              <feComposite in="SourceGraphic" in2="inreGegga" operator="atop" />
            </filter>
          </defs>
        </svg>
        
        <svg 
          className="animate-pulse" 
          style={{ filter: 'url(#loader-blur)' }}
          width={size} 
          height={size} 
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="loader-gradient">
              <stop offset={0} stopColor="hsl(var(--primary))" />
              <stop offset={1} stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
            <linearGradient 
              y2={160} 
              x2={160} 
              y1={40} 
              x1={40} 
              gradientUnits="userSpaceOnUse" 
              id="gradient" 
              href="#loader-gradient" 
            />
          </defs>
          <path 
            className="animate-spin"
            style={{
              animation: 'spin 10s infinite linear',
              strokeDasharray: '180 800',
              fill: 'none',
              stroke: 'url(#gradient)',
              strokeWidth: 23,
              strokeLinecap: 'round'
            }}
            d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64" 
          />
          <circle 
            className="animate-spin"
            style={{
              animation: 'spin 3s infinite linear',
              strokeDasharray: '26 54',
              fill: 'none',
              stroke: 'url(#gradient)',
              strokeWidth: 23,
              strokeLinecap: 'round'
            }}
            cx={100} 
            cy={100} 
            r={64} 
          />
        </svg>
        
        <svg 
          className="absolute top-0 left-0 opacity-30 blur-sm"
          style={{ transform: 'translate(3px, 3px)' }}
          width={size} 
          height={size} 
          viewBox="0 0 200 200"
        >
          <path 
            className="animate-spin"
            style={{
              animation: 'spin 10s infinite linear',
              strokeDasharray: '180 800',
              fill: 'none',
              stroke: 'hsl(var(--primary))',
              strokeWidth: 23,
              strokeLinecap: 'round'
            }}
            d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64" 
          />
          <circle 
            className="animate-spin"
            style={{
              animation: 'spin 3s infinite linear',
              strokeDasharray: '26 54',
              fill: 'none',
              stroke: 'hsl(var(--primary))',
              strokeWidth: 23,
              strokeLinecap: 'round'
            }}
            cx={100} 
            cy={100} 
            r={64} 
          />
        </svg>
      </div>
    </div>
  );
}