import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { StatsSection } from "@/components/StatsSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedBanner } from "@/components/FeaturedBanner";
import { ProductsSection } from "@/components/ProductsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { CartDrawer } from "@/components/CartDrawer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  function handleSelectCategory(id: string | null, name: string) {
    setSelectedCategory(id);
    setSelectedCategoryName(name);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <StatsSection />
        <CategoryGrid
          onSelectCategory={handleSelectCategory}
          selectedId={selectedCategory}
        />
        <FeaturedBanner />
        <ProductsSection
          categoryId={selectedCategory}
          categoryName={selectedCategoryName || undefined}
        />
        <ContactSection />
      </main>
      <Footer />
      <CookieBanner />
      <CartDrawer />
    </div>
  );
}
