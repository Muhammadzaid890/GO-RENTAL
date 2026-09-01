"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

const MAX_IMAGES = 5;

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [limitError, setLimitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ek05gf8o";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "gorentaldha";

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimitError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Remaining slots check
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setLimitError(`MAXIMUM ${MAX_IMAGES} IMAGES ALLOWED.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Agar user ne bache hue slot se zyada select kar li
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setLimitError(`ONLY ${remainingSlots} MORE IMAGE(S) CAN BE ADDED. EXTRA FILES SKIPPED.`);
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    onChange([...images, ...uploadedUrls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setLimitError("");
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase text-dark">
          PROPERTY PHOTOS
        </label>
        <span
          className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${
            images.length === MAX_IMAGES
              ? "bg-sage text-white"
              : "bg-stone-100 text-stone-600"
          }`}
        >
          {images.length} / {MAX_IMAGES} UPLOADED
        </span>
      </div>

      {limitError && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold uppercase">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{limitError}</span>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp, image/jpg"
        onChange={handleFiles}
        className="hidden"
        disabled={images.length >= MAX_IMAGES || uploading}
      />

      {/* Upload Action Box (Only enabled if images < 5) */}
      {images.length < MAX_IMAGES ? (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            uploading
              ? "border-sage bg-sage/5 opacity-70 cursor-wait"
              : "border-stone-300 hover:border-sage bg-[#FBFBF9] hover:bg-white"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-sage animate-spin" />
                <span className="text-xs font-bold uppercase text-sage">
                  UPLOADING PHOTOS TO CLOUD...
                </span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase text-dark">
                  CLICK TO SELECT PHOTOS FROM GALLERY / FOLDER
                </span>
                <span className="text-[10px] text-stone-400 font-bold uppercase">
                  MAX {MAX_IMAGES} HIGH-QUALITY IMAGES (PNG, JPG, WEBP)
                </span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl text-center text-xs font-bold uppercase text-stone-500">
          MAXIMUM LIMIT REACHED (5/5 PHOTOS). REMOVE AN IMAGE TO ADD ANOTHER.
        </div>
      )}

      {/* Previews Grid with Delete Icon */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group bg-stone-100 shadow-xs"
            >
              <img
                src={url}
                alt={`Property preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 bg-dark/80 hover:bg-red-600 text-white p-1 rounded-full shadow-xs transition-colors"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}