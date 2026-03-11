import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfjs-dist", "canvas", "tesseract.js", "sharp"],
};

export default nextConfig;
