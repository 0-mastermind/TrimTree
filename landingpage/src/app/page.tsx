import About from "@/components/about/About";
import Footer from "@/components/Footer";
import HeroSection from "@/components/hero/HeroSection";
import Team from "@/components/our-team/Team";
import OurWork from "@/components/our-work/OurWork";
import Reviews from "@/components/reviews/Reviews";
import ServicesSlider from "@/components/services/servicesSlider";
import AppProvider from "@/utils/AppProvider";

export default function Home() {
  return (
    <div>
      <AppProvider>
        <HeroSection />
        <OurWork />
        <ServicesSlider />
        <About />
        <Reviews />
        <Team />
        <Footer />
      </AppProvider>
    </div>
  );
}
