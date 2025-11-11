"use client";
import "@smastrom/react-rating/style.css";
import { RootState, useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ReviewCard from "@/components/admin/landingpage/ReviewCard";
import { fetchReviews } from "@/utils/api/landingpage";

const Reviews = () => {
  const reviews = useSelector(
    (state: RootState) => state.landingPage.reviews
  );
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
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
         <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manage Reviews</h1>
          <button
            onClick={() => router.push("reviews/new")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Reviews</span>
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 sm:mt-12 auto-rows-fr">
          {reviews.map((item, index) => (
            <ReviewCard key={item._id} review={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
