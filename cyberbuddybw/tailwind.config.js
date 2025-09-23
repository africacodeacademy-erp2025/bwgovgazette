import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "0.9375rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "4px", 
          medium: "6px", 
          large: "8px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            background: "#0a0a0a",
            foreground: "#ffffff",
            focus: "#9fef00",
            content1: {
              DEFAULT: "#141414",
              foreground: "#ffffff"
            },
            content2: {
              DEFAULT: "#1c1c1c",
              foreground: "#ffffff"
            },
            content3: {
              DEFAULT: "#242424",
              foreground: "#ffffff"
            },
            content4: {
              DEFAULT: "#2d2d2d",
              foreground: "#ffffff"
            },
            divider: {
              DEFAULT: "rgba(255, 255, 255, 0.15)"
            },
            default: {
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b",
              DEFAULT: "#27272a",
              foreground: "#ffffff"
            },
            primary: {
              50: "#f1ffe0",
              100: "#e3ffc2",
              200: "#c6ff85",
              300: "#a9ff47",
              400: "#9fef00", // HackTheBox green
              500: "#81c500",
              600: "#639700",
              700: "#466a00",
              800: "#283c00",
              900: "#0a0e00",
              DEFAULT: "#9fef00",
              foreground: "#000000"
            }
          }
        },
        dark: {
          colors: {
            background: "#0a0a0a",
            foreground: "#ffffff",
            focus: "#9fef00",
            content1: {
              DEFAULT: "#141414",
              foreground: "#ffffff"
            },
            content2: {
              DEFAULT: "#1c1c1c",
              foreground: "#ffffff"
            },
            content3: {
              DEFAULT: "#242424",
              foreground: "#ffffff"
            },
            content4: {
              DEFAULT: "#2d2d2d",
              foreground: "#ffffff"
            },
            divider: {
              DEFAULT: "rgba(255, 255, 255, 0.15)"
            },
            default: {
              50: "#18181b",
              100: "#27272a",
              200: "#3f3f46",
              300: "#52525b",
              400: "#71717a",
              500: "#a1a1aa",
              600: "#d4d4d8",
              700: "#e4e4e7",
              800: "#f4f4f5",
              900: "#fafafa",
              DEFAULT: "#a1a1aa",
              foreground: "#000000"
            },
            primary: {
              50: "#0a0e00",
              100: "#283c00",
              200: "#466a00",
              300: "#639700",
              400: "#81c500",
              500: "#9fef00", // HackTheBox green
              600: "#a9ff47",
              700: "#c6ff85",
              800: "#e3ffc2",
              900: "#f1ffe0",
              DEFAULT: "#9fef00",
              foreground: "#000000"
            }
          }
        }
      }
    })
  ]
}
