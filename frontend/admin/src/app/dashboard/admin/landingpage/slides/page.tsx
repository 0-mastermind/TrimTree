"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Image as ImageIcon,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { deleteSlideById, fetchSlides } from "@/utils/api/landingpage";
import {
  removeSlide,
  setSelectedSlide,
} from "@/store/features/landingpage/landingPage.slice";
import { Slide } from "@/types/global";

const Page = () => {
  const router = useRouter();
  const slides = useSelector((state: RootState) => state.landingPage.slides);
  const dispatch = useAppDispatch();

  // 👇 NEW: track which slides are being deleted
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);

  const handleDelete = async (_id: string) => {
    // prevent double-clicks
    if (deletingIds.includes(_id)) return;

    setDeletingIds((prev) => [...prev, _id]);
    try {
      const res = await dispatch(deleteSlideById(_id));
      if (res) dispatch(removeSlide(_id));
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      // remove ID from list once done
      setDeletingIds((prev) => prev.filter((id) => id !== _id));
    }
  };

  const handleEdit = (slideId: string, slide: Slide) => {
    dispatch(setSelectedSlide(slide));
    router.push(`slides/edit/${slideId}`);
  };

  const handleAddSlide = () => {
    router.push("slides/new");
  };

  // Modal logic (unchanged)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (images: string[], startIndex = 0) => {
    const filtered = images.filter(Boolean);
    if (filtered.length === 0) return;
    setModalImages(filtered);
    setCurrentIndex(Math.min(Math.max(startIndex, 0), filtered.length - 1));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
    setCurrentIndex(0);
  };

  const showPrev = () => {
    setCurrentIndex((i) =>
      modalImages.length ? (i - 1 + modalImages.length) % modalImages.length : 0
    );
  };

  const showNext = () => {
    setCurrentIndex((i) =>
      modalImages.length ? (i + 1) % modalImages.length : 0
    );
  };

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    },
    [isModalOpen, modalImages]
  );

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [isModalOpen, onKeyDown]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manage Slides</h1>
          <button
            onClick={handleAddSlide}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Slide</span>
          </button>
        </div>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {slides.map((slide) => {
            const isDeleting = deletingIds.includes(slide._id);

            return (
              <div
                key={slide._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative h-64 bg-slate-200">
                  <img
                    src={slide.thumbnail?.url}
                    alt={slide.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() =>
                      openModal(
                        [
                          slide.thumbnail?.url,
                          ...(slide.gallery?.map((g: any) => g.url) ?? []),
                        ].filter(Boolean),
                        0
                      )
                    }
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
                      {slide.name}
                    </h3>
                    <span className="text-lg font-bold text-green-600 ml-2 whitespace-nowrap">
                      {slide.price}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {slide.description}
                  </p>

                  {/* Gallery Preview */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Gallery Images:
                    </p>
                    <div className="flex space-x-2">
                      {slide.gallery?.map((image: any, index: number) => (
                        <div
                          key={index}
                          className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() =>
                            openModal(
                              [
                                slide.thumbnail?.url,
                                ...(slide.gallery?.map((g: any) => g.url) ?? []),
                              ].filter(Boolean),
                              Math.min(index + 1, slide.gallery?.length ?? 0)
                            )
                          }
                        >
                          <img
                            src={image.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(slide._id, slide)}
                      className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(slide._id)}
                      disabled={isDeleting}
                      className={`flex items-center space-x-2 px-4 py-2 text-slate-700 transition-colors rounded-lg ${
                        isDeleting
                          ? "opacity-60 cursor-not-allowed bg-slate-100"
                          : "hover:text-red-600"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {isDeleting ? "Deleting..." : "Delete"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {slides.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No slides yet
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first slide to showcase products or services on the
              homepage
            </p>
            <button
              onClick={handleAddSlide}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Create First Slide
            </button>
          </div>
        )}
      </div>

      {/* Modal remains same */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>
            {modalImages.length > 1 && (
              <>
                <button
                  onClick={showPrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={showNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <div className="flex items-center justify-center">
              <img
                src={modalImages[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-lg bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
