"use client";
import React, { useState } from "react";
import CropModal from "./CropModal";

type ImageCropperProps = {
  imageSrc?: string;  
  aspect?: number;
};

export default function ImageCropper({ imageSrc, aspect = 3 / 2 }: ImageCropperProps) {
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
    }
  };

  // Save cropped image
  const handleCropComplete = (file: File, url: string) => {
    setSelectedFile(file);
    setCroppedUrl(url);
  };

  return (
    <div className="space-y-4">
      {/* Image preview */}
      {croppedUrl ? (
        <img
          src={croppedUrl}
          alt="Cropped"
          className="w-70 h-70 md:w-90 md:h-90 object-cover rounded-lg border border-black/40"
        />
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Default"
          className="w-70 h-70 md:w-90 md:h-90 object-contacoverin rounded-lg border border-black/40"
        />
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
