"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CropModalProps {
  image: string;
  open: boolean;
  onClose: () => void;
  onCropApply: (blob: Blob, previewUrl: string) => void;
  outputWidth: number; // 500 for thumbnail, 800 for gallery
}

// Helper function for cropping
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const scale = outputWidth / pixelCrop.width;
  const outputHeight = pixelCrop.height * scale;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/jpeg", 0.9);
  });
};

const CropModal: React.FC<CropModalProps> = ({
  image,
  open,
  onClose,
  onCropApply,
  outputWidth,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(image, croppedAreaPixels, outputWidth);
    const previewUrl = URL.createObjectURL(croppedBlob);
    onCropApply(croppedBlob, previewUrl);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-2xl font-semibold text-slate-900">Crop Image</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Crop Container */}
        <div className="p-6">
          <div className="relative w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden mb-5">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Controls */}
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <ZoomOut className="w-5 h-5 text-slate-600" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <ZoomIn className="w-5 h-5 text-slate-600" />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
