import React from 'react';
import Image from 'next/image';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Reviews } from '@/types/type';

type ReviewCardProps = {
  review: Reviews;
  index?: number; // optional, for staggered animations
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review, index = 0 }) => {
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
            src="/images/team/user.jpg"
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
      <div className="pt-4 border-t border-[var(--text-gray-light)]/20 mt-auto">
        <h4 className="font-semibold text-base sm:text-lg mb-1 text-[var(--text-primary)]">
          {review.customerName}
        </h4>
        <p className="text-xs sm:text-sm text-[var(--text-gray-light)]/70 font-medium">
          {review.service}
        </p>
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

