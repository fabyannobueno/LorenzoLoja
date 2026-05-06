import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { StatsSection } from "@/components/StatsSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { AboutSection } from "@/components/AboutSection";
import { VideosSection } from "@/components/VideosSection";
import { PhotosSection } from "@/components/PhotosSection";
import { ShowsSection } from "@/components/ShowsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <StatsSection />
        <CategoryGrid />
        <AboutSection />
        <VideosSection />
        <PhotosSection />
        <ShowsSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
