"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { createReview } from "@/utils/api/landingpage";

interface ReviewData {
  customerName: string;
  service: string;
  rating: string;
  comment: string;
}

const MAX_COMMENT_CHARS = 250;

const CreateReviewPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [reviewData, setReviewData] = useState<ReviewData>({
    customerName: "",
    service: "",
    rating: "",
    comment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!reviewData.customerName.trim())
      newErrors.customerName = "Customer name is required.";
    if (!reviewData.service.trim()) newErrors.service = "Service is required.";
    if (!reviewData.rating.trim()) {
      newErrors.rating = "Rating is required.";
    } else {
      const r = Number(reviewData.rating);
      if (isNaN(r) || r < 1 || r > 5) {
        newErrors.rating = "Rating must be a number between 1 and 5.";
      }
    }
    if (!reviewData.comment.trim()) {
      newErrors.comment = "Comment is required.";
    } else if (reviewData.comment.length > MAX_COMMENT_CHARS) {
      newErrors.comment = `Comment must be at most ${MAX_COMMENT_CHARS} characters.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = { ...reviewData, rating: Number(reviewData.rating) };
      const res = await dispatch(createReview(payload.customerName , payload.service , payload.rating , payload.comment ));
      if (res) router.back();
    } catch (err) {
      console.error("Failed to create review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Create New Review
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6"
        >
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={reviewData.customerName}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.customerName ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Enter customer name"
            />
            {errors.customerName && (
              <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service *
            </label>
            <input
              type="text"
              value={reviewData.service}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, service: e.target.value }))
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.service ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Service (e.g., Makeup, Haircut)"
            />
            {errors.service && (
              <p className="text-red-600 text-sm mt-1">{errors.service}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rating (1-5) *
            </label>
            <select
              value={reviewData.rating}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, rating: e.target.value }))
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.rating ? "border-red-500" : "border-slate-300"
              }`}
            >
              <option value="">Select rating</option>
              <option value="1">1 — Very poor</option>
              <option value="2">2 — Poor</option>
              <option value="3">3 — Average</option>
              <option value="4">4 — Good</option>
              <option value="5">5 — Excellent</option>
            </select>
            {errors.rating && (
              <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Comment *
            </label>
            <textarea
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  comment: e.target.value.slice(0, MAX_COMMENT_CHARS),
                }))
              }
              rows={6}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.comment ? "border-red-500" : "border-slate-300"
              }`}
              placeholder={`Enter comment (max ${MAX_COMMENT_CHARS} characters)`}
            />
            <p className="text-slate-500 text-sm mt-1">
              {reviewData.comment.length}/{MAX_COMMENT_CHARS} characters
            </p>
            {errors.comment && (
              <p className="text-red-600 text-sm mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl font-medium text-white transition-colors ${
                isSubmitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReviewPage;