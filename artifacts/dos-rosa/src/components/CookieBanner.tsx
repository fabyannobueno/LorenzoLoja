import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("mclorenzo-cookies-accepted");
    if (!accepted) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mclorenzo-cookies-accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-gray-700 text-sm md:text-base text-center md:text-left flex-1">
        Ao navegar por este site voce aceita o uso de cookies para melhorar a sua experiencia.
      </p>
      <Button
        onClick={handleAccept}
        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white tracking-wide uppercase px-8"
      >
        Entendi
      </Button>
    </div>
  );
}
