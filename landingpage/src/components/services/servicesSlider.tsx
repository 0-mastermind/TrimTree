"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
  {
    id: 1,
    title: "Hair Cut",
    description:
      "Get a fresh new look with a stylish haircut tailored to your preferences by professionals.",
    price: "From ₹300",
    image: "/images/services/image3.png",
  },
  {
    id: 2,
    title: "Blow Dry",
    description:
      "A professional blow-dry to give your hair a smooth, voluminous, and perfectly styled finish.",
    price: "From ₹300",
    image: "/images/services/image2.png",
  },
  {
    id: 3,
    title: "Keratin Treatment",
    description:
      "Achieve smooth, frizz-free, and manageable hair with our transformative keratin treatment.",
    price: "From ₹5000",
    image: "/images/services/image5.png",
  },
  {
    id: 4,
    title: "Global Hair Colour (L'Oréal)",
    description:
      "Transform your look with a stunning, all-over global hair color using premium L'Oréal products.",
    price: "From ₹3000",
    image: "/images/services/image.png",
  },
  {
    id: 5,
    title: "Hair Spa (L'Oréal)",
    description:
      "Indulge in a premium L'Oréal hair spa to deeply nourish and revitalize your hair.",
    price: "From ₹1200",
    image: "/images/services/image4.png",
  },
];

export default function ServicesSlider() {
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
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
    const visibleCount = 3;
    const result = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % services.length;
      result.push({
        ...services[index],
        position: i,
        isCenter: i === 1,
        slideKey: `${index}-${currentIndex}-${i}`,
      });
    }
    return result;
  };

  return (
    <>
      <div id="services" className="w-full px-6 pt-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}>
            <h6 className="text-center text-lg text-[var(--text-primary)] font-secondary capitalize">
              - Services
            </h6>
            <h1 className="my-10 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)]">
              Expert premium hair services tailored for you
            </h1>
          </motion.div>
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <motion.div
              className="flex items-start justify-center gap-6 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}>
              <AnimatePresence mode="popLayout">
                {getVisibleServices().map((service) => (
                  <motion.div
                    key={service.slideKey}
                    className={`relative ${service.isCenter ? "z-20" : "z-10"}`}
                    layout
                    initial={{
                      opacity: 0,
                      x: 400,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: service.isCenter ? 1 : 0.4,
                      x: 0,
                      scale: service.isCenter ? 1.05 : 0.95,
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
                            scale: 1.02,
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
                    }>
                    <motion.div
                      className={`
                      w-90  rounded-3xl overflow-hidden`}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}>
                      <div className="relative h-72 overflow-hidden">
                        <motion.div
                          className="relative w-full h-full"
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}>
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                        <motion.div
                          className="absolute top-6 right-6"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                          animate={
                            service.isCenter
                              ? {
                                  scale: [1, 1.05, 1],
                                }
                              : {}
                          }>
                          <span className="bg-[var(--bg-primary)] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            {service.price}
                          </span>
                        </motion.div>
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
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

                      <div className="py-6 ">
                        <h3
                          className={`
                        text-[1.7rem] font-bold mb-4 transition-colors duration-300
                        dark:text-[var(--text-white)]
                      `}>
                          {service.title}
                        </h3>
                        <p
                          className={`
                        text-md leading-relaxed transition-colors duration-300 font-secondary 
                       text-[var(--text-gray-light)]
                      `}>
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
      
      <div className="flex justify-center mt-2">
        <button
          className="flex gap-2 px-8 py-2 font-semibold justify-center items-center  font-secondary border-2 hover:bg-[#ffaa00] border-[#ffaa00] rounded-lg  hover:text-white transition-colors duration-300 cursor-pointer text-[#ffaa00]"
          onClick={() => router.push('/services')}
        >
          View All <MoveRight className='h-5 w-5' />
        </button>
      </div>
    </>
  );
}
