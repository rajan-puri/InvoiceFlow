import React from "react";
import { getSessionFromCookies } from "@/lib/auth";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SocialProof from "@/components/landing/SocialProof";
import ProblemSection from "@/components/landing/ProblemSection";
import ProductOverview from "@/components/landing/ProductOverview";
import ProductShowcase from "@/components/landing/ProductShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import BusinessWorkflow from "@/components/landing/BusinessWorkflow";
import AudienceSection from "@/components/landing/AudienceSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import EcosystemPreview from "@/components/landing/EcosystemPreview";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default async function HomePage() {
  const session = await getSessionFromCookies();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar isAuthenticated={!!session} />

      {/* Hero Section with Live Mockup */}
      <HeroSection />

      {/* Subtle Social Proof */}
      <SocialProof />

      {/* The Problem: Manual vs Unified Flow */}
      <ProblemSection />

      {/* Complete Capabilities Overview */}
      <ProductOverview />

      {/* Large Realistic Product UI Showcase */}
      <ProductShowcase />

      {/* 4-Step How It Works with Connecting Pipeline */}
      <HowItWorks />

      {/* Daily Business Workflow Pipeline */}
      <BusinessWorkflow />

      {/* Audience Segments (SMBs, Agencies, Freelancers) */}
      <AudienceSection />

      {/* Key Commercial Benefits */}
      <BenefitsSection />

      {/* Unified Connected Workspace Preview */}
      <EcosystemPreview />

      {/* Customer Testimonial */}
      <TestimonialSection />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Conversion Final CTA */}
      <CtaSection />

      {/* Comprehensive SaaS Footer */}
      <Footer />
    </div>
  );
}
