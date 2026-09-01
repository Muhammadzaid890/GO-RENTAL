"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "EN" | "UR";
export type AreaUnit = "Sq. Yards" | "Marla" | "Sq. Ft";
export type Currency = "PKR" | "USD" | "AED";

interface PreferencesContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  unit: AreaUnit;
  setUnit: (u: AreaUnit) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInPkr: number | string) => string;
  formatArea: (areaInSqYards: number | string) => string;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    HOME: "HOME",
    PROPERTIES: "PROPERTIES",
    MAPS: "MAPS",
    AREAS: "AREAS",
    AGENTS: "AGENTS",
    POST_PROPERTY: "POST PROPERTY",
    PREFERENCES: "PREFERENCES",
    SAVE_PREFERENCES: "SAVE PREFERENCES",
    HERO_TITLE: "FIND YOUR LUXURY RENTAL IN DHA KARACHI",
    HERO_SUB: "VERIFIED RENTAL HOMES, APARTMENTS, PENTHOUSES & COMMERCIAL PROPERTIES",
    ALL_PHASES: "ALL PHASES",
    ALL_TYPES: "ALL PROPERTY TYPES",
    MIN_PRICE: "MIN RENT",
    MAX_PRICE: "MAX RENT",
    SEARCH_NOW: "SEARCH RENTALS",
    ALL_ADS: "ALL RENTAL LISTINGS",
    BOOSTED_BADGE: "FEATURED",
    BEDS: "BEDS",
    BATHS: "BATHS",
    VIEW_DETAILS: "VIEW DETAILS",
    WHATSAPP_CHAT: "WHATSAPP",
    CALL_AGENT: "CALL AGENT",
    NO_PROPERTIES: "NO RENTAL PROPERTIES FOUND MATCHING YOUR CRITERIA.",
    PER_MONTH: "/ month",
    FLAT: "FLAT / APARTMENT",
    HOUSE: "HOUSE / VILLA",
    OFFICE: "COMMERCIAL OFFICE",
    PENTHOUSE: "LUXURY PENTHOUSE",
    UPPER_PORTION: "UPPER PORTION",
    LOWER_PORTION: "LOWER PORTION",
  },
  UR: {
    HOME: "ہوم",
    PROPERTIES: "پراپرٹیز",
    MAPS: "نقشہ جات",
    AREAS: "علاقے",
    AGENTS: "ایجنٹس",
    POST_PROPERTY: "اشتہار لگائیں",
    PREFERENCES: "ترجیحات",
    SAVE_PREFERENCES: "محفوظ کریں",
    HERO_TITLE: "ڈی ایچ اے کراچی میں اپنا پسندیدہ رینٹل گھر تلاش کریں",
    HERO_SUB: "تصدیق شدہ مکانات، فلیٹس، پینٹ ہاؤسز اور کمرشل پراپرٹیز کرائے پر دستیاب",
    ALL_PHASES: "تمام فیزز",
    ALL_TYPES: "تمام پراپرٹی اقسام",
    MIN_PRICE: "کم سے کم کرایہ",
    MAX_PRICE: "زیادہ سے زیادہ کرایہ",
    SEARCH_NOW: "تلاش کریں",
    ALL_ADS: "تمام رینٹل پراپرٹیز",
    BOOSTED_BADGE: "نمایاں",
    BEDS: "کمرے",
    BATHS: "باتھ روم",
    VIEW_DETAILS: "تفصیلات دیکھیں",
    WHATSAPP_CHAT: "واٹس ایپ",
    CALL_AGENT: "کال کریں",
    NO_PROPERTIES: "آپ کی تلاش کے مطابق کوئی پراپرٹی نہیں ملی۔",
    PER_MONTH: "/ ماہانہ",
    FLAT: "فلیٹ / اپارٹمنٹ",
    HOUSE: "مکمل مکان / ولا",
    OFFICE: "دفتر / کمرشل",
    PENTHOUSE: "پینٹ ہاؤس",
    UPPER_PORTION: "اوپری پورشن",
    LOWER_PORTION: "نچلا پورشن",
  },
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");
  const [unit, setUnitState] = useState<AreaUnit>("Sq. Yards");
  const [currency, setCurrencyState] = useState<Currency>("PKR");

  useEffect(() => {
    // Remove dark class if present previously
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("pref_theme");

    const savedLang = (localStorage.getItem("pref_lang") as Language) || "EN";
    const savedUnit = (localStorage.getItem("pref_unit") as AreaUnit) || "Sq. Yards";
    const savedCurr = (localStorage.getItem("pref_curr") as Currency) || "PKR";

    setLanguageState(savedLang);
    setUnitState(savedUnit);
    setCurrencyState(savedCurr);
  }, []);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem("pref_lang", l);
  };

  const setUnit = (u: AreaUnit) => {
    setUnitState(u);
    localStorage.setItem("pref_unit", u);
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("pref_curr", c);
  };

  const formatPrice = (priceInPkr: number | string) => {
    const numericPrice = Number(priceInPkr) || 0;
    if (currency === "USD") {
      return `$ ${Math.round(numericPrice / 279).toLocaleString()}`;
    }
    if (currency === "AED") {
      return `AED ${Math.round(numericPrice / 76).toLocaleString()}`;
    }
    return `PKR ${numericPrice.toLocaleString()}`;
  };

  const formatArea = (areaInSqYards: number | string) => {
    const numericArea = Number(areaInSqYards) || 0;
    if (unit === "Marla") {
      return `${(numericArea / 25).toFixed(1)} Marla`;
    }
    if (unit === "Sq. Ft") {
      return `${Math.round(numericArea * 9).toLocaleString()} Sq. Ft`;
    }
    return `${numericArea.toLocaleString()} Sq. Yds`;
  };

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        unit,
        setUnit,
        currency,
        setCurrency,
        formatPrice,
        formatArea,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}