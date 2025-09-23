import React from "react";
import { Icon } from "@iconify/react";
import { Button, Card, Divider, Tooltip } from "@heroui/react";
import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/hero-section";
import { FeaturesSection } from "./components/features-section";
import { TrainingPathsSection } from "./components/training-paths-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { PricingSection } from "./components/pricing-section";
import { FaqSection } from "./components/faq-section";
import { Footer } from "./components/footer";
import { SignIn } from "./pages/sign-in";
import { SignUp } from "./pages/sign-up";
import { Dashboard } from "./pages/dashboard";
import { ChallengePage } from "./pages/challenge-page";
import { ChallengeDetailPage } from "./pages/challenge-detail-page";
import { LabDetailPage } from "./pages/lab-detail-page";
import { EnvironmentPage } from "./pages/environment-page";
import { LearningPathDetailPage } from "./pages/learning-path-detail-page";
import { CourseDetailPage } from "./pages/course-detail-page";
import { UpgradePage } from "./pages/upgrade-page";
import { SettingsPage } from "./pages/settings-page";
import { HelpPage } from "./pages/help-page";
import { SimulationsPage } from "./pages/simulations-page";

export default function App() {
  const [currentPage, setCurrentPage] = React.useState("landing");

  // Add console log to debug navigation
  React.useEffect(() => {
    console.log("Current page:", currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "signin":
        return <SignIn onNavigate={setCurrentPage} />;
      case "signup":
        return <SignUp onNavigate={setCurrentPage} />;
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "challenge":
        return <ChallengePage onNavigate={setCurrentPage} />;
      case "challenge-detail":
        return <ChallengeDetailPage onNavigate={setCurrentPage} />;
      case "lab-detail":
        return <LabDetailPage onNavigate={setCurrentPage} />;
      case "environment":
        return <EnvironmentPage onNavigate={setCurrentPage} />;
      case "learning-path-detail":
        return <LearningPathDetailPage onNavigate={setCurrentPage} />;
      case "course-detail":
        return <CourseDetailPage onNavigate={setCurrentPage} />;
      case "upgrade":
        return <UpgradePage onNavigate={setCurrentPage} />;
      case "settings":
        return <SettingsPage onNavigate={setCurrentPage} />;
      case "help":
        return <HelpPage onNavigate={setCurrentPage} />;
      case "simulations":
        return <SimulationsPage onNavigate={setCurrentPage} />;
      default:
        return (
          <>
            <Navbar onNavigate={setCurrentPage} />
            <main>
              <HeroSection onNavigate={setCurrentPage} />
              <FeaturesSection />
              <TrainingPathsSection />
              <TestimonialsSection />
              <PricingSection />
              <FaqSection />
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground terminal-text">
      {renderPage()}
    </div>
  );
}