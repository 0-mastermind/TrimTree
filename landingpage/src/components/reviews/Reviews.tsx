"use client";
import "@smastrom/react-rating/style.css";
import { RootState, useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { fetchReviews } from "@/lib/api/landingpage";
import { useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Reviews = () => {
  const reviews = useSelector(
    (state: RootState) => state.landingPage.reviews
  ).slice(0, 6);
  const router = useRouter();

  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchReviews());
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <section className="my-10 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="my-4 text-3xl sm:text-4xl lg:text-5xl max-w-[800px] text-center mx-auto text-[var(--text-primary)] font-semibold leading-tight">
          What our clients say about Trim Tree Salon&apos;s services
        </h1>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 sm:mt-12 auto-rows-fr">
          {reviews.map((item, index) => (
            <ReviewCard key={item._id} review={item} index={index} />
          ))}
        </div>
        <div className="flex justify-center mt-14">
          <button
            className="flex gap-2 px-8 py-2 font-semibold justify-center items-center font-secondary border-2 hover:bg-[#ffaa00] border-[#ffaa00] rounded-lg hover:text-white transition-colors duration-300 cursor-pointer text-[#ffaa00] dark:text-[#ffaa00] dark:border-[#ffaa00] dark:hover:bg-[#ffaa00] dark:hover:text-white"
            onClick={() => router.push("/reviews")}
            type="button"
          >
            View All <MoveRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
