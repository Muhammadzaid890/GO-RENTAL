"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createRentalAd } from "@/actions/property";
import { getSessionUser } from "@/actions/auth";
import {
  Home,
  Building2,
  MapPin,
  Coins,
  Maximize2,
  Bed,
  Bath,
  UploadCloud,
  X,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Flame,
  Check,
  Zap,
  Droplets,
  Shield,
  Car,
  Wind,
  Loader2,
  Flame as GasIcon,
} from "lucide-react";

// 1. Property Types Data
const homesTypes = [
  "House",
  "Flat",
  "Upper Portion",
  "Lower Portion",
  "Farm House",
  "Room",
  "Condos",
  "Penthouse",
];

const commercialTypes = [
  "Office",
  "Shop",
  "Warehouse",
  "Factory",
  "Building",
  "Other",
];

// 2. Pakistan Cities
const pakistanCities = [
  { name: "Karachi", active: true },
  { name: "Lahore (Coming Soon)", active: false },
  { name: "Islamabad (Coming Soon)", active: false },
  { name: "Rawalpindi (Coming Soon)", active: false },
  { name: "Faisalabad (Coming Soon)", active: false },
  { name: "Multan (Coming Soon)", active: false },
  { name: "Peshawar (Coming Soon)", active: false },
  { name: "Quetta (Coming Soon)", active: false },
  { name: "Hyderabad (Coming Soon)", active: false },
  { name: "Gwadar (Coming Soon)", active: false },
];

// 3. DHA Phases
const dhaPhases = [
  "Phase 1",
  "Phase 2",
  "Phase 2 Ext",
  "Phase 4",
  "Phase 5",
  "Phase 5 Ext",
  "Phase 6",
  "Phase 7",
  "Phase 7 Ext",
  "Phase 8",
  "Phase 8 (Zone A - D)",
  "Phase 8 (Sahil/Emaar)",
];

// 4. Area Units
const areaUnits = ["Sq. Yard", "Sq. Feet", "Sq. Meters", "Marla", "Kanal"];

// 5. Amenities
const availableAmenities = [
  { id: "electricity", label: "Electricity / Generator", icon: Zap },
  { id: "water", label: "Line Water / Sweet Water", icon: Droplets },
  { id: "gas", label: "Sui Gas", icon: GasIcon },
  { id: "parking", label: "Dedicated Parking", icon: Car },
  { id: "security", label: "24/7 Security Guard", icon: Shield },
  { id: "lift", label: "Elevator / Lift", icon: Building2 },
  { id: "furnished", label: "Fully Furnished", icon: Home },
  { id: "seaview", label: "Sea Facing / View", icon: Wind },
];

export default function PostAdPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Form States
  const [category, setCategory] = useState<"HOMES" | "COMMERCIAL">("HOMES");
  const [selectedType, setSelectedType] = useState("House");
  const [selectedCity, setSelectedCity] = useState("Karachi");
  const [selectedPhase, setSelectedPhase] = useState("Phase 5");
  const [areaSize, setAreaSize] = useState("");
  const [areaUnit, setAreaUnit] = useState("Sq. Yard");
  const [rentPrice, setRentPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("3");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "electricity",
    "water",
  ]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Direct Images Upload State
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  // Admin Exclusive
  const [isPremium, setIsPremium] = useState(false);

  // Statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getSessionUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  // Automated Direct Upload to Cloudinary (Bypasses heavy server payload limits)
  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setErrorMsg("YOU CAN UPLOAD A MAXIMUM OF 5 IMAGES.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");

    const uploadedUrls: string[] = [];
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ek05gf8o";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(`UPLOADING PHOTO ${i + 1} OF ${files.length}...`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          // Fallback if preset is strict
          throw new Error("FAILED TO UPLOAD IMAGE TO CLOUD STORAGE.");
        }

        const data = await uploadRes.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      setImages((prev) => [...prev, ...uploadedUrls].slice(0, 5));
    } catch (uploadErr: any) {
      console.error("Upload error:", uploadErr);
      setErrorMsg(
        "IMAGE UPLOAD FAILED. PLEASE CHECK YOUR INTERNET CONNECTION AND TRY AGAIN."
      );
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !rentPrice || !areaSize) {
      setErrorMsg("PLEASE FILL IN ALL REQUIRED FIELDS.");
      return;
    }

    if (images.length === 0) {
      setErrorMsg("PLEASE UPLOAD AT LEAST 1 PROPERTY PHOTO FROM YOUR DEVICE.");
      return;
    }

    setIsSubmitting(true);

    try {
      const amenitiesText = selectedAmenities
        .map(
          (a) => availableAmenities.find((item) => item.id === a)?.label
        )
        .filter(Boolean)
        .join(", ");

      const fullDescription = `${description.trim()}\n\nAMENITIES: ${
        amenitiesText || "Standard Amenities"
      }`;

      // Clean flat payload
      const res = await createRentalAd({
        title: title.trim().toUpperCase(),
        description: fullDescription,
        rentPrice: Number(rentPrice),
        phase: selectedPhase.toUpperCase(),
        propertyType: selectedType.toUpperCase(),
        bedrooms: category === "HOMES" ? Number(bedrooms) : 0,
        bathrooms: category === "HOMES" ? Number(bathrooms) : 0,
        areaSqYards: Number(areaSize),
        images: [...images],
        isPremium: currentUser?.role === "ADMIN" ? isPremium : false,
      });

      if (!res.success) {
        setErrorMsg(res.error || "FAILED TO POST AD.");
      } else {
        setSuccessMsg("PROPERTY LISTED SUCCESSFULLY!");
        setTimeout(() => {
          router.push("/properties");
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "AN UNEXPECTED ERROR OCCURRED.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-xs font-black uppercase text-stone-400">
        LOADING POST AD PORTAL...
      </div>
    );
  }

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-200/90 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs transition-all cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              POST RENTAL AD
            </h1>
            <p className="text-[11px] font-bold uppercase text-stone-400">
              DHA KARACHI VERIFIED DIRECTORY
            </p>
          </div>
        </div>

        {isAdmin && (
          <span className="px-3 py-1 bg-red-100 border border-red-200 text-[#E53935] text-[10px] font-black uppercase rounded-xl">
            ADMIN PORTAL
          </span>
        )}
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-[#E53935] text-xs font-black uppercase rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-9 rounded-3xl border border-stone-200/90 shadow-sm space-y-8"
      >
        {/* 1. SELECT PROPERTY TYPE */}
        <div className="space-y-3.5">
          <label className="text-xs font-black uppercase text-[#1A1F1C] tracking-wide block">
            1. SELECT PROPERTY TYPE *
          </label>

          {/* Category Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-[#FBFBF9] border border-stone-200 rounded-2xl max-w-md">
            <button
              type="button"
              onClick={() => {
                setCategory("HOMES");
                setSelectedType("House");
              }}
              className={`py-2.5 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                category === "HOMES"
                  ? "bg-white text-[#1A1F1C] shadow-xs border border-stone-200/80"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              <Home className="w-4 h-4 text-[#657A68]" />
              <span>HOMES</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory("COMMERCIAL");
                setSelectedType("Office");
              }}
              className={`py-2.5 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                category === "COMMERCIAL"
                  ? "bg-white text-[#1A1F1C] shadow-xs border border-stone-200/80"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              <Building2 className="w-4 h-4 text-[#657A68]" />
              <span>COMMERCIAL</span>
            </button>
          </div>

          {/* Subtypes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {(category === "HOMES" ? homesTypes : commercialTypes).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`p-3 rounded-2xl border text-xs font-black uppercase text-center transition-all cursor-pointer ${
                  selectedType === t
                    ? "bg-[#657A68]/15 border-[#657A68] text-[#657A68] shadow-2xs"
                    : "bg-[#FBFBF9] border-stone-200/80 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2. SELECT CITY & LOCATION (DHA PHASES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-stone-100">
          {/* City Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-[#1A1F1C]">
              2. SELECT CITY *
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 bg-[#FBFBF9] border border-stone-200 rounded-2xl text-xs font-bold uppercase outline-none focus:border-[#657A68] appearance-none cursor-pointer"
              >
                {pakistanCities.map((c) => (
                  <option key={c.name} value={c.name} disabled={!c.active}>
                    {c.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-[#657A68] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block pl-1">
              * Currently active for Karachi DHA only
            </span>
          </div>

          {/* Location / DHA Phase */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-[#1A1F1C]">
              3. DHA LOCATION / PHASE *
            </label>
            <div className="relative">
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="w-full px-4 py-3 bg-[#FBFBF9] border border-stone-200 rounded-2xl text-xs font-bold uppercase outline-none focus:border-[#657A68] appearance-none cursor-pointer"
              >
                {dhaPhases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-[#657A68] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. AREA SIZE & MONTHLY RENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-stone-100">
          {/* Area Size */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-[#1A1F1C]">
              4. AREA SIZE *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  required
                  placeholder="E.G. 500"
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FBFBF9] border border-stone-200 rounded-2xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
                />
                <Maximize2 className="w-4 h-4 text-[#657A68] absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="px-3 py-3 bg-[#FBFBF9] border border-stone-200 rounded-2xl text-xs font-black uppercase outline-none focus:border-[#657A68] cursor-pointer shrink-0"
              >
                {areaUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Rent */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-[#1A1F1C]">
              5. MONTHLY RENT (PKR) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder="E.G. 250000"
                value={rentPrice}
                onChange={(e) => setRentPrice(e.target.value)}
                className="w-full px-4 py-3 bg-[#FBFBF9] border border-stone-200 rounded-2xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
              />
              <Coins className="w-4 h-4 text-amber-600 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. BEDS & BATHS */}
        {category === "HOMES" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-stone-100">
            {/* Bedrooms */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#1A1F1C]">
                <div className="w-6 h-6 rounded-lg bg-[#657A68]/15 text-[#657A68] flex items-center justify-center">
                  <Bed className="w-3.5 h-3.5" />
                </div>
                <span>6. BEDROOMS</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {["1", "2", "3", "4", "5", "6+"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBedrooms(b.replace("+", ""))}
                    className={`py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                      bedrooms === b.replace("+", "")
                        ? "bg-[#657A68] text-white shadow-2xs"
                        : "bg-[#FBFBF9] border border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#1A1F1C]">
                <div className="w-6 h-6 rounded-lg bg-[#657A68]/15 text-[#657A68] flex items-center justify-center">
                  <Bath className="w-3.5 h-3.5" />
                </div>
                <span>7. BATHROOMS</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {["1", "2", "3", "4", "5", "6+"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBathrooms(b.replace("+", ""))}
                    className={`py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                      bathrooms === b.replace("+", "")
                        ? "bg-[#657A68] text-white shadow-2xs"
                        : "bg-[#FBFBF9] border border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. AMENITIES */}
        <div className="space-y-2.5 pt-4 border-t border-stone-100">
          <label className="text-xs font-black uppercase text-[#1A1F1C] tracking-wide block">
            8. AMENITIES & HIGHLIGHTS
          </label>
          <div className="flex flex-wrap gap-2">
            {availableAmenities.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = selectedAmenities.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#657A68] text-white border-[#657A68] shadow-2xs"
                      : "bg-[#FBFBF9] border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-white" : "text-[#657A68]"
                    }`}
                  />
                  <span>{amenity.label}</span>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. PROPERTY TITLE */}
        <div className="space-y-2 pt-4 border-t border-stone-100">
          <label className="text-xs font-black uppercase text-[#1A1F1C]">
            9. PROPERTY TITLE *
          </label>
          <input
            type="text"
            required
            placeholder="E.G. BRAND NEW 500 SQ YDS FULL HOUSE FOR RENT IN DHA PHASE 6"
            value={title}
            onChange={(e) => setTitle(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[#FBFBF9] border border-stone-200 rounded-2xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
          />
        </div>

        {/* 7. DETAILED DESCRIPTION */}
        <div className="space-y-2 pt-4 border-t border-stone-100">
          <label className="text-xs font-black uppercase text-[#1A1F1C]">
            10. DETAILED DESCRIPTION
          </label>
          <textarea
            rows={4}
            placeholder="MENTION ROAD WIDTH, FIXTURES, BASEMENT/SERVANT QUARTER, FLOOR DETAILS..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-[#FBFBF9] border border-stone-200 rounded-2xl text-xs font-medium outline-none focus:border-[#657A68]"
          />
        </div>

        {/* 8. DIRECT DEVICE PHOTO UPLOAD & PREVIEWS (1 TO 5 PHOTOS) */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-[#1A1F1C]">
              11. PROPERTY PHOTOS (UP TO 5 PHOTOS) *
            </label>
            <span className="text-[10px] font-bold text-stone-400 uppercase">
              {images.length}/5 UPLOADED
            </span>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelect}
            multiple
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          {/* Upload Dropzone Box */}
          {images.length < 5 && (
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed border-stone-300 hover:border-[#657A68] bg-[#FBFBF9] hover:bg-stone-50 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all group ${
                isUploading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#657A68]/15 text-[#657A68] flex items-center justify-center group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#657A68]" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black uppercase text-[#1A1F1C] block">
                  {isUploading
                    ? uploadProgressText || "UPLOADING PHOTOS..."
                    : "CLICK TO UPLOAD FROM DEVICE / MOBILE"}
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">
                  PNG, JPG, WEBP (MAX 4MB EACH)
                </span>
              </div>
            </div>
          )}

          {/* Live Thumbnail Grid with Remove Button */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs group"
                >
                  <Image
                    src={imgSrc}
                    alt={`Upload ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-2 left-2 bg-[#657A68] text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase">
                      COVER PHOTO
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 9. ADMIN EXCLUSIVE: FIRE-RED PREMIUM PROPERTY TOGGLE */}
        {isAdmin && (
          <div className="p-4 bg-red-50/90 border border-red-200 rounded-3xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#E53935]" />
                <span className="text-xs font-black uppercase text-[#E53935] tracking-wider">
                  MARK AS PREMIUM PROPERTY (ADMIN ONLY)
                </span>
              </div>
              <p className="text-[10px] font-bold text-stone-500 uppercase">
                SHOWCASES IN TOP 5 HOMEPAGE SLOTS WITH FIRE-RED BADGE FOR 1 WEEK (7 DAYS).
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E53935]"></div>
            </label>
          </div>
        )}

        {/* 10. SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
          className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-stone-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>PUBLISHING PROPERTY...</span>
          ) : (
            <span>PUBLISH LISTING</span>
          )}
        </button>
      </form>
    </div>
  );
}