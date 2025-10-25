"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Sparkles,
  Scissors,
  Palette,
  Droplet,
  Heart,
  Hand,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { categories } from "@/data/data";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PhoneSidebar from "@/components/PhoneSidebar";

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("cut") || name.includes("styling"))
    return <Scissors className="w-6 h-6" />;
  if (name.includes("facial") || name.includes("cleanup"))
    return <Sparkles className="w-6 h-6" />;
  if (name.includes("colour") || name.includes("color"))
    return <Palette className="w-6 h-6" />;
  if (name.includes("spa") || name.includes("massage"))
    return <Heart className="w-6 h-6" />;
  if (name.includes("wax") || name.includes("thread"))
    return <Zap className="w-6 h-6" />;
  if (name.includes("manicure") || name.includes("pedicure"))
    return <Hand className="w-6 h-6" />;
  return <Droplet className="w-6 h-6" />;
};

export default function SalonServices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      services: category.services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) =>
      selectedCategory
        ? category.name === selectedCategory
        : category.services.length > 0
    );

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Initialize scroll position and add resize listener
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <Navbar />
        <PhoneSidebar />
      </div>
      <div className="min-h-screen bg-[var(--primary-background)] container mx-auto">
        {/* Header */}
        <div className="relative mt-10 rounded-md px-6 py-12 text-[var(--text-white)] text-center overflow-hidden shadow-[0_4px_20px_rgba(255,170,0,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] to-[#ff8800]/80 backdrop-blur-lg rounded-md" />

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              Our Services
            </h1>
            <p className="text-lg opacity-95 max-w-2xl mx-auto">
              Discover our premium salon and spa services tailored just for you
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray-light)] w-5 h-5" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 dark:border-gray-700/50 rounded-xl outline-none transition-all duration-300 text-[var(--text-gray-dark)] focus:border-[var(--bg-primary)] focus:shadow-[0_0_0_3px_rgba(255,170,0,0.1)]"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="relative mb-10">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hidden md:flex items-center justify-center w-8 h-8 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[var(--text-gray-dark)]" />
              </button>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hidden md:flex items-center justify-center w-8 h-8 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[var(--text-gray-dark)]" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
              className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide md:flex-wrap md:justify-center md:overflow-x-visible"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === null
                    ? "bg-[var(--bg-primary)] text-[var(--text-white)]"
                    : "bg-gray-100 text-[var(--text-gray-dark)] hover:bg-gray-200"
                }`}
              >
                All Services
              </button>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.name
                      ? "bg-[var(--bg-primary)] text-[var(--text-white)]"
                      : "bg-gray-100 text-[var(--text-gray-dark)] hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex flex-col gap-10">
            {filteredCategories.map((category) => (
              <div key={category.name}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-[var(--bg-primary)]">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(255,170,0,0.1)] flex items-center justify-center text-[var(--bg-primary)]">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] m-0">
                      {category.name}
                    </h2>
                    <p className="text-sm text-[var(--text-gray-light)] mt-1">
                      {category.services.length} service
                      {category.services.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[var(--bg-primary)] group"
                    >
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[rgba(255,170,0,0.1)] to-transparent rounded-bl-2xl" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold flex-1 pr-4">
                            {service.name}
                          </h3>
                          <div className="bg-[var(--bg-primary)] text-[var(--text-white)] px-3.5 py-1.5 rounded-lg text-base font-bold whitespace-nowrap">
                            ₹{service.rate}
                          </div>
                        </div>
                        <p className="text-[15px] leading-relaxed text-[var(--text-gray-dark)]">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16 px-4 text-[var(--text-gray-light)]">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-2xl mb-2">No services found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}