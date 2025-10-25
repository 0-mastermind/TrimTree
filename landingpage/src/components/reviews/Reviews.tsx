"use client";
import Image from "next/image";
import { data } from "./data";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const Reviews = () => {
  return (
    <section className="my-10 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="my-4 text-3xl sm:text-4xl lg:text-5xl max-w-[800px] text-center mx-auto text-[var(--text-primary)] font-semibold leading-tight">
          What our clients say about Trim Tree Salon&apos;s services
        </h1>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 sm:mt-12 auto-rows-fr">
          {data.map((item, index) => (
            <div
              className={`bg-gradient-to-br from-[var(--text-gray-light)]/5 to-[var(--text-gray-light)]/10 
                p-5 sm:p-6 lg:p-7 rounded-2xl 
                hover:shadow-lg hover:scale-[1.02] 
                transition-all duration-300 ease-out
                border border-[var(--text-gray-light)]/10
                flex flex-col
                ${item.rowSpan}
                animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
              key={item.id}>
              {/* Header with Avatar and Rating */}
              <div className="flex items-start justify-between mb-5 gap-3">
                <div className="relative">
                  <Image
                    src={item.userProfile}
                    className="rounded-full object-cover ring-2 ring-[var(--text-gray-light)]/20 ring-offset-2"
                    alt={`${item.name}'s profile picture`}
                    width={56}
                    height={56}
                  />
                </div>
                <div className="flex-shrink-0">
                  <Rating
                    readOnly
                    style={{ maxWidth: 110 }}
                    itemStyles={{
                      itemShapes: Star,
                      activeFillColor: "#ffb700",
                      inactiveFillColor: "#e5e7eb",
                    }}
                    value={item.ratings}
                  />
                  <p className="text-xs text-[var(--text-gray-light)]/60 mt-1 text-right">
                    {item.ratings.toFixed(1)} / 5.0
                  </p>
                </div>
              </div>

              {/* Review Body */}
              <div className="flex-grow mb-5">
                <p className="text-sm sm:text-base leading-relaxed text-[var(--text-gray-light)] line-clamp-6">
                  &ldquo;{item.body}&rdquo;
                </p>
              </div>

              {/* Footer with Name and Service */}
              <div className="pt-4 border-t border-[var(--text-gray-light)]/20 mt-auto">
                <h4 className="font-semibold text-base sm:text-lg mb-1 text-[var(--text-primary)]">
                  {item.name}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-gray-light)]/70 font-medium">
                  {item.service}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Reviews;
