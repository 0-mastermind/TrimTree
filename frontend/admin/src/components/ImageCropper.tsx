"use client";
import React, { useState } from "react";
import CropModal from "./CropModal";
import { Trash2 } from "lucide-react";
import Image from "next/image";

type ImageCropperProps = {
  imageSrc?: string;
  aspect?: number;
  onImageCropped?: (file: File, url: string) => void;
};

export default function ImageCropper({
  imageSrc,
  aspect = 3 / 2,
  onImageCropped,
}: ImageCropperProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setTempImage(url);
      setModalOpen(true);

      e.target.value = "";
    }
  };

  // Save cropped image
  const handleCropComplete = (file: File, url: string) => {
    const buffer = () => selectedFile;
    buffer();
    setSelectedFile(file);
    setCroppedUrl(url);
    // setTempImage(null);

    if (onImageCropped) {
      onImageCropped(file, url);
    }
  };

  const handleImageRemove = () => {
    setCroppedUrl(null);
  };

  return (
    <div className="space-y-4">
      {/* Image preview */}
      {croppedUrl ? (
        <div className="relative w-70 h-70 md:w-90 md:h-90 rounded-lg border border-black/40 overflow-hidden">
          <Image layout="fill" src={croppedUrl} alt="Cropped" className="object-cover" />
          <span
            className="absolute right-2 bottom-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 cursor-pointer"
            title="click to remove image"
            onClick={handleImageRemove}>
            <Trash2 size={18} />
          </span>
        </div>
      ) : imageSrc ? (
        <div className="relative w-70 h-70 md:w-90 md:h-90 rounded-lg border border-black/40 overflow-hidden">
          <Image layout="fill" src={imageSrc} alt="Cropped" className="object-cover" />
          <span
            className="absolute right-2 bottom-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 cursor-pointer"
            title="click to remove image"
            onClick={handleImageRemove}
            >
            <Trash2 size={18} />
          </span>
        </div>
      ) : (
        <div className="w-70 h-70 md:w-90 md:h-90 flex items-center justify-center border rounded-lg text-gray-400">
          No image selected
        </div>
      )}

      {/* Upload button */}
      <label className="btn btn-outline btn-sm cursor-pointer">
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {/* Crop Modal */}
      {modalOpen && tempImage && (
        <CropModal
          imageSrc={tempImage}
          aspect={aspect}
          onClose={() => {
            setModalOpen(false);
            setTempImage(null);
          }}
          onCropComplete={(file, url) => {
            handleCropComplete(file, url);
            setModalOpen(false);
            setTempImage(null);
          }}
        />
      )}
    </div>
  );
}
