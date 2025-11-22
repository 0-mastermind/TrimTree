"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, ChevronRight } from "lucide-react";
import { GalleryPopUp } from "./GalleryPopUp";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Slider } from "@/types/type";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchSliders } from "@/lib/api/landingpage";
interface ServiceWithPosition extends Slider {
  position: number;
  isCenter: boolean;
  slideKey: string;
}

export default function ServicesSlider() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedService, setSelectedService] =
    useState<ServiceWithPosition | null>(null);
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const services = useSelector(
    (state: RootState) => state.landingPage.sliders as Slider[]
  );

  // Fetch sliders on mount
  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  useEffect(() => {
    if (!isHovered && services.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isHovered, services.length]);

  const getVisibleServices = useMemo((): ServiceWithPosition[] => {
    const visibleCount = isMobile ? 1 : 3;
    const result: ServiceWithPosition[] = [];

    if (services.length === 0) return result;

    for (let i = 0; i < Math.min(visibleCount, services.length); i++) {
      const index = (currentIndex + i) % services.length;
      const base = services[index];

      result.push({
        ...base,
        position: i,
        isCenter: isMobile ? true : i === 1,
        slideKey: `${base._id}-${currentIndex}-${i}`,
      });
    }

    return result;
  }, [services, isMobile, currentIndex]);

  const handleServiceClick = (service: ServiceWithPosition) => {
    if (service.isCenter) {
      setSelectedService(service);
      setGalleryOpen(true);
    }
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    setSelectedService(null);
  };

  const nextSlide = () => {
    if (services.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const canSlide = services.length > (isMobile ? 1 : 1);

  return (
    <>
      <div id="services" className="w-full px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="my-6 sm:my-10 text-3xl sm:text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)] font-semibold px-4">
              Expert premium services tailored for you
            </h1>
          </motion.div>

          <div className="relative">
            {/* Right Navigation Button Only */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 hover:text-[var(--bg-primary)] rounded-full p-2 sm:p-3 shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canSlide}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className="flex items-start justify-center gap-4 sm:gap-6 py-4 sm:py-8 px-4 sm:px-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {services.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No services available.
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {getVisibleServices.map((service) => (
                      <motion.div
                        key={service.slideKey}
                        className={`relative ${
                          service.isCenter ? "z-20" : "z-10"
                        } w-full max-w-[340px] sm:max-w-none cursor-pointer`}
                        layout
                        initial={{
                          opacity: 0,
                          x: 400,
                          scale: 0.9,
                        }}
                        animate={{
                          opacity: service.isCenter ? 1 : 0.4,
                          x: 0,
                          scale: service.isCenter
                            ? isMobile
                              ? 1
                              : 1.05
                            : 0.95,
                          filter: service.isCenter ? "blur(0px)" : "blur(1px)",
                        }}
                        exit={{
                          opacity: 0,
                          x: -400,
                          scale: 0.8,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: [0.25, 0.1, 0.25, 1],
                          layout: {
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1],
                          },
                        }}
                        whileHover={
                          service.isCenter
                            ? {
                                y: -8,
                                scale: isMobile ? 1 : 1.02,
                                transition: {
                                  duration: 0.3,
                                  ease: [0.25, 0.1, 0.25, 1],
                                },
                              }
                            : {
                                opacity: 0.7,
                                scale: 0.98,
                                transition: {
                                  duration: 0.3,
                                  ease: [0.25, 0.1, 0.25, 1],
                                },
                              }
                        }
                        onClick={() => handleServiceClick(service)}
                      >
                        <motion.div
                          className="w-full sm:w-90 rounded-3xl overflow-hidden"
                          transition={{
                            boxShadow: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }}
                        >
                          <div className="relative h-64 sm:h-72 overflow-hidden">
                            <motion.div
                              className="relative w-full h-full"
                              whileHover={{ scale: 1.05 }}
                              transition={{
                                duration: 0.4,
                                ease: [0.25, 0.1, 0.25, 1],
                              }}
                            >
                              <Image
                                width={1920}
                                height={1080}
                                quality={100}
                                src={service.thumbnail?.url}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                            <motion.div
                              className="absolute top-4 sm:top-6 right-4 sm:right-6"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                              animate={
                                service.isCenter
                                  ? {
                                      scale: [1, 1.05, 1],
                                    }
                                  : {}
                              }
                            >
                              <span className="bg-[var(--bg-primary)] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                                ₹{service.price}
                              </span>
                            </motion.div>
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 bg-white/80 rounded-full"
                                  animate={
                                    service.isCenter
                                      ? {
                                          opacity: [0.5, 1, 0.5],
                                        }
                                      : {
                                          opacity: 0.5,
                                        }
                                  }
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="py-4 sm:py-6 px-2">
                            <h3 className="text-2xl sm:text-[1.7rem] font-bold mb-3 sm:mb-4 text-[var(--text-primary)]">
                              {service.name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </h3>

                            <p className="text-sm sm:text-md leading-relaxed text-gray-600">
                              {service.description}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2 px-4">
        <button
          className="flex gap-2 px-6 sm:px-8 py-2 font-semibold justify-center items-center border-2 hover:bg-[var(--bg-primary)] border-[var(--bg-primary)] rounded-lg hover:text-white transition-colors duration-300 cursor-pointer 
          text-[var(--bg-primary)] text-sm sm:text-base"
          onClick={() => router.push("/services")}
        >
          View All <MoveRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Popup Gallery */}
      <AnimatePresence>
        {galleryOpen && selectedService && (
          <GalleryPopUp
            images={selectedService.gallery?.map((g) => g.url) ?? []}
            currentImageIndex={0}
            onClose={closeGallery}
          />
        )}
      </AnimatePresence>
    </>
  );
}
