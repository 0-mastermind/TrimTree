"use client";
import React, { useEffect, useState } from "react";
import { Upload, Edit2, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import CropModal from "@/components/admin/landingpage/cropModal";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { fetchSlideById, updateSlide } from "@/utils/api/landingpage";
import Image from "next/image";

const MAX_FILE_SIZE_MB = 1;

const EditSlidePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const slide = useAppSelector(
    (state: RootState) => state.landingPage.selectedSlide
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [slideData, setSlideData] = useState({
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

  useEffect(() => {
    dispatch(fetchSlideById(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (slide) {
      setSlideData({
        name: slide.name || "",
        description: slide.description || "",
        price: String(slide.price || ""),
        thumbnail: slide.thumbnail?.url || "",
        galleryImages: slide.gallery?.map((g) => g.url).slice(0, 3) || [
          "",
          "",
          "",
        ],
      });
    }
  }, [slide]);

  // IMAGE HANDLER (with size validation)
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

  // VALIDATION
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", slideData.name);
    formData.append("description", slideData.description);
    formData.append("price", slideData.price);

    if (files.thumbnail) formData.append("thumbnail", files.thumbnail);
    files.galleryImages.forEach(
      (file) => file && formData.append("gallery", file)
    );

    try {
      const success = await dispatch(updateSlide(id as string, formData));
      if (success) {
        setIsEditing(false);
        router.back();
      }
    } catch (error) {
      console.error("Error updating slide:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (slide) {
      setSlideData({
        name: slide.name || "",
        description: slide.description || "",
        price: String(slide.price || ""),
        thumbnail: slide.thumbnail?.url || "",
        galleryImages: slide.gallery?.map((g) => g.url).slice(0, 3) || [
          "",
          "",
          "",
        ],
      });
      setFiles({ thumbnail: null, galleryImages: [null, null, null] });
      setErrors({});
      setIsEditing(false);
    }
  };

  if (!slide)
    return (
      <div className="flex items-center justify-center h-screen text-slate-600">
        Loading slide...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Edit Slide</h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              <Edit2 className="w-5 h-5" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-slate-500 text-white px-6 py-3 rounded-xl hover:bg-slate-600"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
              <button
                form="edit-slide-form"
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? "Saving..." : "Save"}</span>
              </button>
            </div>
          )}
        </div>

        {/* FORM */}
        <form
          id="edit-slide-form"
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
                setSlideData((p) => ({ ...p, name: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-slate-300"
              } ${!isEditing ? "bg-slate-100 cursor-not-allowed" : ""}`}
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
                setSlideData((p) => ({ ...p, price: e.target.value }))
              }
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.price ? "border-red-500" : "border-slate-300"
              } ${!isEditing ? "bg-slate-100 cursor-not-allowed" : ""}`}
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
                setSlideData((p) => ({
                  ...p,
                  description: e.target.value.slice(0, 100),
                }))
              }
              rows={4}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-slate-300"
              } ${!isEditing ? "bg-slate-100 cursor-not-allowed" : ""}`}
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
              Thumbnail Image
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
                  <Image
                    width={1920}
                    height={1080}
                    quality={100}
                    alt={"Thumbnail"}
                    src={slideData.thumbnail}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400" />
                )}
              </div>
              {isEditing && (
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
                    <span>Change Thumbnail</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Gallery Images
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-32 bg-slate-100 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden mb-3">
                    {slideData.galleryImages[i] ? (
                      <Image
                        width={1920}
                        height={1080}
                        quality={100}
                        alt={`Gallery Image ${i + 1}`}
                        src={slideData.galleryImages[i]}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  {isEditing && (
                    <>
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
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image Size Error */}
          {errors.image && (
            <div className="flex items-center text-red-600 text-sm mt-2">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {errors.image}
            </div>
          )}
        </form>
      </div>

      {/* CROP MODAL */}
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

export default EditSlidePage;
