"use client";
import Image from "next/image";
import { data } from "./data";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const Reviews = () => {
  return (
    <section className="my-10 py-10">
      <h1 className="my-4 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)] font-semibold">
        What our clients say about Trim Tree Salon&apos;s services
      </h1>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 grid-rows-12 max-h-[1200px]">
        {data.map((item) => (
          <div
            className={`bg-[var(--text-gray-light)]/10 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 ${item.rowSpan} overflow-hidden`}
            key={item.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Image
                  src={item.userProfile}
                  className="rounded-full object-cover"
                  alt="user fallback image"
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <Rating
                  readOnly
                  style={{ maxWidth: 100 }}
                  itemStyles={{ itemShapes: Star, activeFillColor: "#ffb700" }}
                  value={item.ratings}
                />
              </div>
            </div>
            <p className="text-sm sm:text-base leading-relaxed mb-4 text-[var(--text-gray-light)]">
              {item.body}
            </p>
            <div className="pt-4 border-t border-[var(--text-gray-light)]/20">
              <h4 className="font-semibold text-base mb-1">{item.name}</h4>
              <p className="text-xs sm:text-sm text-[var(--text-gray-light)]/80">
                {item.service}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
