import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/image/cropImage";
import { Loader2, ZoomOut, ZoomIn, Minus, Plus } from "lucide-react";

type CropModalProps = {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File, imageUrl: string) => void;
  aspect?: number;
};

export default function CropModal({
  imageSrc,
  onClose,
  onCropComplete,
  aspect = 3 / 2,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  // Zoom configuration
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 3;
  const DEFAULT_ZOOM = 1;
  const ZOOM_STEP = 0.1;

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const { file, previewUrl } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      setLoading(false);
      onCropComplete(file, previewUrl);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
      setLoading(false);
    }
  };

  // Zoom controls
  const handleZoomOut = () =>
    setZoom((prev) =>
      Math.max(MIN_ZOOM, Number((prev - ZOOM_STEP).toFixed(2)))
    );
  const handleExtraZoomOut = () =>
    setZoom((prev) => Math.max(MIN_ZOOM, Number((prev - 0.5).toFixed(2))));
  const handleZoomIn = () =>
    setZoom((prev) =>
      Math.min(MAX_ZOOM, Number((prev + ZOOM_STEP).toFixed(2)))
    );
  const handleExtraZoomIn = () =>
    setZoom((prev) => Math.min(MAX_ZOOM, Number((prev + 0.5).toFixed(2))));
  const resetZoom = () => setZoom(DEFAULT_ZOOM);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent default form submission behavior
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
      <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Cropper */}
        <div className="relative flex-1 bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
          />
        </div>

        {/* Form to wrap controls and prevent accidental submission */}
        <div onSubmit={handleFormSubmit} className="mt-4">
          {/* Zoom Controls */}
          <div className="md:flex items-center justify-center gap-2 flex-col md:flex-row">
            <div className="flex items-center gap-2">
              {/* Extra Zoom Out */}
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleExtraZoomOut}
                disabled={zoom <= MIN_ZOOM}>
                <Minus className="w-4 h-4" />
              </button>

              {/* Normal Zoom Out */}
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleZoomOut}
                disabled={zoom <= MIN_ZOOM}>
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Reset Zoom */}
              <button 
                type="button" 
                className="btn btn-outline btn-sm" 
                onClick={resetZoom}>
                reset
              </button>

              {/* Normal Zoom In */}
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleZoomIn}
                disabled={zoom >= MAX_ZOOM}>
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Extra Zoom In */}
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleExtraZoomIn}
                disabled={zoom >= MAX_ZOOM}>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 md:mt-0 flex items-center">
              {/* Slider */}
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="range range-xs flex-1 mx-4"
              />

              {/* Zoom Percentage */}
              <span className="text-sm text-gray-500 w-16 text-center">
                {(zoom * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDone}
              disabled={loading}>
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {loading ? "Cropping..." : "Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}