import CTABanner from "./components/CTABanner";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HowItWorksSection from "./components/HowItWorksSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import Header from "./components/header";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-[var(--text-primary)]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTABanner />
      <Footer />
    </main>
  );
}
