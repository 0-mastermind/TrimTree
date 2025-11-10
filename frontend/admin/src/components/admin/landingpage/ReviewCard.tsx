"use client";
import React from 'react';
import Image from 'next/image';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Reviews } from '@/types/global';
import { Pencil, Trash } from 'lucide-react';
import { useAppDispatch } from '@/store/store';
import { deleteReview } from '@/utils/api/landingpage';
import { removeReview } from '@/store/features/landingpage/landingPage.slice';
import { useRouter } from 'next/navigation';


type ReviewCardProps = {
  review: Reviews;
  index?: number; // optional, for staggered animations
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review, index = 0 }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const res = await dispatch(deleteReview(review._id));
      if (res) {
        dispatch(removeReview(review._id));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <div
      className={`bg-gradient-to-br from-[var(--text-gray-light)]/5 to-[var(--text-gray-light)]/10 
        p-5 sm:p-6 lg:p-7 rounded-2xl 
        hover:shadow-lg hover:scale-[1.02] 
        transition-all duration-300 ease-out
        border border-[var(--text-gray-light)]/10
        flex flex-col
        row-span-4
        animate-fade-in`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header with Avatar and Rating */}
      <div className="flex items-start justify-between mb-5 gap-3">
        <div className="relative">
          <Image
            src="/user.jpg"
            className="rounded-full object-cover ring-2 ring-[var(--text-gray-light)]/20 ring-offset-2"
            alt={`${review.customerName}'s profile picture`}
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
              activeFillColor: '#ffb700',
              inactiveFillColor: '#e5e7eb',
            }}
            value={review.rating}
          />
          <p className="text-xs text-[var(--text-gray-light)]/60 mt-1 text-right">
            {review.rating.toFixed(1)} / 5.0
          </p>
        </div>
      </div>

      {/* Review Body */}
      <div className="flex-grow mb-5">
        <p className="text-sm sm:text-base leading-relaxed text-[var(--text-gray-light)] line-clamp-6">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      {/* Footer with Name and Service */}
      <div className="pt-4 border-t border-[var(--text-gray-light)]/20 mt-auto flex justify-between items-center">
      <div>

        <h4 className="font-semibold text-base sm:text-lg mb-1 text-[var(--text-primary)]">
          {review.customerName}
        </h4>
        <p className="text-xs sm:text-sm text-[var(--text-gray-light)]/70 font-medium">
          {review.service}
        </p>
      </div>
      <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
            aria-label={`Edit review by ${review.customerName}`}
            title="Edit"
            onClick={() => router.push(`reviews/edit/${review._id}`)}
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-busy={isDeleting}
            aria-label={`Delete review by ${review.customerName}`}
            title={isDeleting ? "Deleting..." : "Delete"}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition
              ${isDeleting ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
            `}
          >
            {isDeleting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </>
            )}
          </button>
      </div>
      </div>
    </div>
  );
};
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

export default ReviewCard;