// /frontend/src/app/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import ViewportAnchoredView from "@/components/ViewportAnchoredView";
import HeroSection from "@/components/sections/HeroSection";
import WhatIsSection from "@/components/sections/WhatIsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  const sections = [
    {
      id: "hero",
      component: <HeroSection user={user} isLoading={isLoading} />,
    },
    {
      id: "what-is",
      component: <WhatIsSection />,
    },
    {
      id: "how-it-works",
      component: <HowItWorksSection />,
    },
  ];

  return <ViewportAnchoredView sections={sections} transitionDuration={0.8} scrollThreshold={50} />;
}