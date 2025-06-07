"use client";
import { useState, useEffect } from "react";
import { getActiveLocations } from "@/lib/locations";
import type { Location } from "@/types/database";

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function LocationSelect({
  value,
  onChange,
  placeholder = "장소를 선택하세요",
  required = false,
  disabled = false,
  className = "",
}: LocationSelectProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getActiveLocations();
      setLocations(data);
    } catch (error) {
      console.error("Error loading locations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled || loading}
      className={`w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-slate-50 text-slate-800 ${className}`}
    >
      <option value="">
        {loading ? "장소를 불러오는 중..." : placeholder}
      </option>
      {locations.map((location) => (
        <option key={location.id} value={location.id}>
          {location.emoji} {location.name}
        </option>
      ))}
    </select>
  );
}
