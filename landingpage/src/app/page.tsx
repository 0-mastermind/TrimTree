import HeroSection from "@/components/hero/HeroSection";
import OurWork from "@/components/our-work/OurWork";
import AppProvider from "@/utils/AppProvider";

export default function Home() {
  return (
    <div>
      <AppProvider>
        <HeroSection />
        <OurWork />
      </AppProvider>
    </div>
  );
}
