import CTABanner from "./components/CTABanner";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HowItWorksSection from "./components/HowItWorksSection";
import PricingSection from "./components/PricingSection";
import Header from "./components/header";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTABanner />
      <Footer />
    </main>
  );
}
