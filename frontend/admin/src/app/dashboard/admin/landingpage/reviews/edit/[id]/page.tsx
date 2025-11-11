"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchReviewById, updateReview } from "@/utils/api/landingpage";
import { useSelector } from "react-redux";

interface ReviewData {
  customerName: string;
  service: string;
  rating: string;
  comment: string;
}

const MAX_COMMENT_CHARS = 250;

const EditReviewPage = () => {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const reviewId = params?.id ?? "";
  const dispatch = useAppDispatch();
  const selectedReview = useSelector(
    (state: RootState) => state.landingPage.selectedReview
  );

  const [reviewData, setReviewData] = useState<ReviewData>({
    customerName: "",
    service: "",
    rating: "",
    comment: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!reviewId) {
      setIsLoading(false);
      return;
    }

    
    const fetchReview = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchReviewById(reviewId));
      } catch (err) {
        console.error("Failed to fetch review:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [dispatch, reviewId]);

  // Populate local form state from selectedReview when it becomes available
  useEffect(() => {
    if (!selectedReview) return;
    if (reviewId && selectedReview._id !== reviewId) return;

    setReviewData({
      customerName: String(selectedReview.customerName ?? ""),
      service: String(selectedReview.service ?? ""),
      rating:
        selectedReview.rating !== undefined && selectedReview.rating !== null
          ? String(selectedReview.rating)
          : "",
      comment: String(selectedReview.comment ?? ""),
    });
  }, [selectedReview, reviewId]);

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
    if (!isEditing) return; // form should not be submittable unless editing enabled
    if (!validateForm()) return;

    if (!reviewId) {
      console.error("Missing review id for update.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: reviewData.customerName,
        service: reviewData.service,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
      };
      const res = await dispatch(
        (updateReview)(reviewId, payload.customerName, payload.service, payload.rating, payload.comment)
      );
      if (res) {
        setIsEditing(false);
        router.back();
      }
    } catch (err) {
      console.error("Failed to update review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-slate-600">Loading review...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Edit Review</h1>
          <button
            type="button"
            onClick={() => setIsEditing((s) => !s)}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              isEditing
                ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
            aria-pressed={isEditing}
            aria-label={isEditing ? "Disable edit mode" : "Enable edit mode"}
          >
            {isEditing ? "Editing" : "Edit"}
          </button>
        </div>

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
              disabled={!isEditing || isSubmitting}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.customerName ? "border-red-500" : "border-slate-300"
              } ${!isEditing ? "bg-slate-50 cursor-not-allowed" : ""}`}
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
              disabled={!isEditing || isSubmitting}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.service ? "border-red-500" : "border-slate-300"
              } ${!isEditing ? "bg-slate-50 cursor-not-allowed" : ""}`}
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
              disabled={!isEditing || isSubmitting}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.rating ? "border-red-500" : "border-slate-300"
              } ${!isEditing ? "bg-slate-50 cursor-not-allowed" : ""}`}
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
              disabled={!isEditing || isSubmitting}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.comment ? "border-red-500" : "border-slate-300"
              } ${!isEditing ? "bg-slate-50 cursor-not-allowed" : ""}`}
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
              disabled={isSubmitting || !isEditing}
              className={`px-8 py-3 rounded-xl font-medium text-white transition-colors ${
                isSubmitting || !isEditing
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewPage;