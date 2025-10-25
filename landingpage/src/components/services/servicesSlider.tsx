"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight } from "lucide-react";
import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Hair Cut",
    description:
      "Get a fresh new look with a stylish haircut tailored to your preferences by professionals.",
    price: "From ₹300",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
  },
  {
    id: 2,
    title: "Blow Dry",
    description:
      "A professional blow-dry to give your hair a smooth, voluminous, and perfectly styled finish.",
    price: "From ₹300",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
  },
  {
    id: 3,
    title: "Keratin Treatment",
    description:
      "Achieve smooth, frizz-free, and manageable hair with our transformative keratin treatment.",
    price: "From ₹5000",
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&q=80",
  },
  {
    id: 4,
    title: "Global Hair Colour (L'Oréal)",
    description:
      "Transform your look with a stunning, all-over global hair color using premium L'Oréal products.",
    price: "From ₹3000",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80",
  },
  {
    id: 5,
    title: "Hair Spa (L'Oréal)",
    description:
      "Indulge in a premium L'Oréal hair spa to deeply nourish and revitalize your hair.",
    price: "From ₹1200",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80",
  },
];

export default function ServicesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const getVisibleServices = () => {
    const visibleCount = isMobile ? 1 : 3;
    const result = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % services.length;
      result.push({
        ...services[index],
        position: i,
        isCenter: isMobile ? true : i === 1,
        slideKey: `${index}-${currentIndex}-${i}`,
      });
    }
    return result;
  };

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
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className="flex items-start justify-center gap-4 sm:gap-6 py-4 sm:py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <AnimatePresence mode="popLayout">
                {getVisibleServices().map((service) => (
                  <motion.div
                    key={service.slideKey}
                    className={`relative ${
                      service.isCenter ? "z-20" : "z-10"
                    } w-full max-w-[340px] sm:max-w-none`}
                    layout
                    initial={{
                      opacity: 0,
                      x: 400,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: service.isCenter ? 1 : 0.4,
                      x: 0,
                      scale: service.isCenter ? (isMobile ? 1 : 1.05) : 0.95,
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
                      layout: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
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
                            src={service.image}
                            alt={service.title}
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
                            {service.price}
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
                          {service.title}
                        </h3>
                        <p className="text-sm sm:text-md leading-relaxed text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2 px-4">
        <button
          className="flex gap-2 px-6 sm:px-8 py-2 font-semibold justify-center items-center border-2 hover:bg-[var(--bg-primary)] border-[var(--bg-primary)] rounded-lg hover:text-white transition-colors duration-300 cursor-pointer 
          text-[var(--bg-primary)] text-sm sm:text-base"
        >
          View All <MoveRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </>
  );
}
