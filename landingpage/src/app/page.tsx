import HeroSection from "@/components/hero/HeroSection";
import AppProvider from "@/utils/AppProvider";

export default function Home() {
  return (
    <div>
      <AppProvider>
        <HeroSection />
      </AppProvider>
    </div>
  );
}
