"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getCachedLocations } from "@/lib/locations";
import type { Location } from "@/types/database";

interface LocationSearchProps {
  onLocationSelect: (locationId: string | null) => void;
  selectedLocation: string | null;
  campus?: "신촌" | "송도";
}

export default function LocationSearch({
  onLocationSelect,
  selectedLocation,
  campus,
}: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const loadLocations = useCallback(async () => {
    try {
      const data = await getCachedLocations();
      const campusFiltered = campus
        ? data.filter((loc) => loc.campus === campus)
        : data;
      setLocations(campusFiltered);
      setFilteredLocations(campusFiltered);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  }, [campus]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (selectedLocation) {
      const location = locations.find((loc) => loc.id === selectedLocation);
      setSearchTerm(location?.name || "");
    } else {
      setSearchTerm("");
    }
  }, [selectedLocation, locations]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = locations.filter((location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchTerm, locations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId);
    setSearchTerm(location?.name || "");
    setIsOpen(false);
    onLocationSelect(locationId);
  };

  const handleClear = () => {
    setSearchTerm("");
    onLocationSelect(null);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (selectedLocation) {
              onLocationSelect(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="건물명을 검색하세요..."
          className={`w-full px-4 py-3 pl-12 pr-10 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white text-slate-800 shadow-lg ${
            selectedLocation ? "border-sky-500 bg-sky-50" : "border-slate-300"
          }`}
        />

        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg
            className={`w-5 h-5 ${
              selectedLocation ? "text-sky-600" : "text-slate-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            <>
              {searchTerm && !selectedLocation && (
                <button
                  onClick={handleClear}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 text-slate-600"
                >
                  <span className="text-sky-600">전체 보기</span>
                </button>
              )}
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors ${
                    selectedLocation === location.id
                      ? "bg-sky-50 border-l-4 border-sky-500"
                      : ""
                  }`}
                >
                  <span className="text-2xl">{location.emoji}</span>
                  <div>
                    <div
                      className={`font-medium ${
                        selectedLocation === location.id
                          ? "text-sky-800"
                          : "text-slate-800"
                      }`}
                    >
                      {location.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {location.description}
                    </div>
                  </div>
                  {selectedLocation === location.id && (
                    <div className="ml-auto">
                      <svg
                        className="w-5 h-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-slate-500">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
