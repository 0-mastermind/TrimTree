"use client";
import React, { useState } from "react";
import { Upload, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import CropModal from "@/components/admin/landingpage/cropModal";
import { useAppDispatch } from "@/store/store";
import { createSlide } from "@/utils/api/landingpage";

interface SlideData {
  name: string;
  description: string;
  price: string;
  thumbnail: string;
  galleryImages: string[];
}

const MAX_FILE_SIZE_MB = 1; 

const CreateSlidePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [slideData, setSlideData] = useState<SlideData>({
    name: "",
    description: "",
    price: "",
    thumbnail: "",
    galleryImages: ["", "", ""],
  });

  const [files, setFiles] = useState<{
    thumbnail: File | null;
    galleryImages: (File | null)[];
  }>({
    thumbnail: null,
    galleryImages: [null, null, null],
  });

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [outputWidth, setOutputWidth] = useState(500);
  const [currentImageType, setCurrentImageType] = useState<
    "thumbnail" | `gallery-${number}`
  >("thumbnail");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | `gallery-${number}`
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors({
        ...errors,
        image: `File size should not exceed ${MAX_FILE_SIZE_MB} MB.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImage(reader.result as string);
      setCurrentImageType(type);
      setOutputWidth(type === "thumbnail" ? 500 : 800);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (blob: Blob, previewUrl: string) => {
    const file = new File([blob], `${currentImageType}.jpg`, {
      type: "image/jpeg",
    });

    if (currentImageType === "thumbnail") {
      setSlideData((prev) => ({ ...prev, thumbnail: previewUrl }));
      setFiles((prev) => ({ ...prev, thumbnail: file }));
    } else {
      const index = parseInt(currentImageType.split("-")[1]);
      const updatedPreviews = [...slideData.galleryImages];
      updatedPreviews[index] = previewUrl;

      const updatedFiles = [...files.galleryImages];
      updatedFiles[index] = file;

      setSlideData((prev) => ({ ...prev, galleryImages: updatedPreviews }));
      setFiles((prev) => ({ ...prev, galleryImages: updatedFiles }));
    }

    setCropModalOpen(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!slideData.name.trim()) newErrors.name = "Slide name is required.";
    if (!slideData.description.trim())
      newErrors.description = "Description is required.";
    if (!slideData.price.trim()) {
      newErrors.price = "Price is required.";
    } else if (isNaN(Number(slideData.price)) || Number(slideData.price) <= 0) {
      newErrors.price = "Enter a valid numeric price greater than 0.";
    }
    if (!files.thumbnail) newErrors.thumbnail = "Thumbnail image is required.";
    if (files.galleryImages.some((file) => !file))
      newErrors.gallery = "All 3 gallery images are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", slideData.name);
    formData.append("description", slideData.description);
    formData.append("price", slideData.price);
    if (files.thumbnail) formData.append("thumbnail", files.thumbnail);
    files.galleryImages.forEach((file) => {
      if (file) formData.append("gallery", file);
    });

    try {
      const success = await dispatch(createSlide(formData));
      if (success) router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Create New Slide
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-8"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Slide Name *
            </label>
            <input
              type="text"
              value={slideData.name}
              onChange={(e) =>
                setSlideData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Enter slide name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              value={slideData.price}
              onChange={(e) =>
                setSlideData((prev) => ({ ...prev, price: e.target.value }))
              }
              min={0}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.price ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={slideData.description}
              onChange={(e) =>
                setSlideData((prev) => ({
                  ...prev,
                  description: e.target.value.slice(0, 100),
                }))
              }
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Enter slide description (max 100 characters)"
            />
            <p className="text-slate-500 text-sm mt-1">
              {slideData.description.length}/100 characters
            </p>
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Thumbnail Image *
            </label>
            <div className="flex items-center space-x-6">
              <div
                className={`w-32 h-24 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden ${
                  errors.thumbnail
                    ? "border-red-500"
                    : "border-slate-300 bg-slate-100"
                }`}
              >
                {slideData.thumbnail ? (
                  <img
                    src={slideData.thumbnail}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "thumbnail")}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 cursor-pointer inline-flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Thumbnail</span>
                </label>
              </div>
            </div>
            {errors.thumbnail && (
              <p className="text-red-600 text-sm mt-2">{errors.thumbnail}</p>
            )}
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Gallery Images (3 images) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center">
                  <div
                    className={`w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden mb-3 ${
                      errors.gallery
                        ? "border-red-500"
                        : "border-slate-300 bg-slate-100"
                    }`}
                  >
                    {slideData.galleryImages[i] ? (
                      <img
                        src={slideData.galleryImages[i]}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    id={`gallery-${i}`}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, `gallery-${i}`)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`gallery-${i}`}
                    className="bg-slate-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-slate-700 cursor-pointer"
                  >
                    {slideData.galleryImages[i] ? "Change" : "Upload"}
                  </label>
                </div>
              ))}
            </div>
            {errors.gallery && (
              <p className="text-red-600 text-sm mt-2">{errors.gallery}</p>
            )}
          </div>

          {/* Image file size error */}
          {errors.image && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {errors.image}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
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
              {isSubmitting ? "Creating..." : "Create Slide"}
            </button>
          </div>
        </form>
      </div>

      {/* Crop Modal */}
      <CropModal
        image={currentImage}
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onCropApply={handleCroppedImage}
        outputWidth={outputWidth}
      />
    </div>
  );
};

export default CreateSlidePage;
