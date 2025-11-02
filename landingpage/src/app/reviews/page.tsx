"use client";
import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchReviews } from "@/lib/api/landingpage";
import ReviewCard from "@/components/reviews/ReviewCard";

const Team = () => {
  const router = useRouter();
  const reviews = useSelector((state: RootState) => state.landingPage.reviews);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchReviews());
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchData();
  }, [dispatch]);
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative px-6 md:px-12 lg:px-20 pt-8 pb-16 md:pb-20">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[var(--text-primary)] mb-8 md:mb-12 group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
            <ArrowLeft className="w-5 h-5 text-black" />
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* Title Section */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block">
            <span className="text-sm font-semibold tracking-wider uppercase text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
              Our Testimonials
            </span>
          </div>
          <h1 className="my-10 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)]">
            Hear from our satisfied clients
          </h1>

          <h6 className="text-center text-lg text-[var(--text-primary)] font-secondary capitalize">
            Discover why our clients love Trim Tree Salon
          </h6>
        </div>
      </div>

      {/* Review Grid Section */}
      <div className="px-6 md:px-12 lg:px-20 pb-16 md:pb-24 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 sm:mt-12 auto-rows-fr max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="transform transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
              }}
            >
              <ReviewCard review={review} index={index} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Team;
