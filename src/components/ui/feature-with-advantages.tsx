import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-4 py-12 flex-col items-start">
          <div>
            <Badge>About GovGazette</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              Building the most accessible way to read official Gazettes
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              We make authoritative information easy to find, searchable, and available to everyone.
            </p>
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
              <div className="flex flex-row gap-6 w-full items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Search & Browse</p>
                  <p className="text-muted-foreground text-sm">
                    Find the documents you need quickly with full-text search and helpful filters.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Read & Download</p>
                  <p className="text-muted-foreground text-sm">
                    Access content in your preferred format—online viewing or downloadable PDFs.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Instant Alerts</p>
                  <p className="text-muted-foreground text-sm">
                    Subscribe to get notified as soon as new gazettes are published.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 w-full items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Accessible & Trusted</p>
                  <p className="text-muted-foreground text-sm">
                    Built for reliability and clarity so you can trust what you read.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Privacy & Security</p>
                  <p className="text-muted-foreground text-sm">
                    We follow industry-standard best practices to safeguard your account and data.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>What’s Next</p>
                  <p className="text-muted-foreground text-sm">
                    We’re continuously improving search, expanding coverage, and refining the reading experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
