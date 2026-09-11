import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Highlight from "@/components/Highlight";
import Schedules from "@/components/Schedules";
import Pricing from "@/components/Pricing";
import Locations from "@/components/Locations";
import Testimonials from "@/components/Testimonials";
import RegistrationForm from "@/components/RegistrationForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Core Features & Safety Pillars */}
      <Features />

      {/* Swimming Classes & Programs */}
      <Services />

      {/* Central Promotional Highlight */}
      <Highlight />

      {/* Class Schedules by Branch */}
      <Schedules />

      {/* Transparent Pricing & Investment */}
      <Pricing />

      {/* Branch Facilities & Contact */}
      <Locations />

      {/* Testimonials & Social Proof */}
      <Testimonials />

      {/* Registration & Booking Form */}
      <RegistrationForm />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Floating Action Button */}
      <WhatsAppFloating />
    </main>
  );
}
