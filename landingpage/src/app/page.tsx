import HeroSection from "@/components/hero/HeroSection";
import OurWork from "@/components/our-work/OurWork";
import ServicesSlider from "@/components/services/servicesSlider";
import AppProvider from "@/utils/AppProvider";

export default function Home() {
  return (
    <div>
      <AppProvider>
        <HeroSection />
        <OurWork />
        <ServicesSlider />
      </AppProvider>
    </div>
  );
}
