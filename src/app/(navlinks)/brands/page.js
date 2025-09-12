"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Globe, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ✅ Fetch brands using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await axios.get("/api/Brand");
      if (res.data.success) {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Failed to fetch brands");
      }
    },
  });

  // Fallbacks
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center text-gray-600">
        Loading brands...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-6 py-12 text-center text-red-500">
        Error fetching brands: {error.message}
      </div>
    );
  }

  const brands = data || [];

  // ✅ Filter brands by search
  const filteredBrands = brands.filter(
    (brand) =>
      brand.brandName.toLowerCase().includes(search.toLowerCase()) ||
      brand.brandDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-black mb-4">
        Shop by Brand
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto text-lg">
        Explore top global and local brands across fashion, technology, food,
        and more. Use the search bar to quickly find your favorite brands and
        learn more about them.
      </p>

      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Brand Grid */}
      {filteredBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBrands.map((brand) => {
            const slug = brand.slug; // ✅ using slug from backend
            const firstLetter = brand.brandName.charAt(0).toUpperCase();

            return (
              <div
                onClick={() => router.push(`/brands/${slug}`)}
                key={brand._id}
                className="cursor-pointer flex flex-col justify-between p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-300 transition bg-white"
              >
                {/* Top Row: Avatar + Brand Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white text-lg font-bold shadow-md">
                    {firstLetter}
                  </div>
                  <h2 className="font-semibold text-xl text-gray-900">
                    {brand.brandName}
                  </h2>
                </div>

                <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
                  {brand.brandDescription}
                </p>

                {/* Bottom: Products + Website + Details */}
                <div className="mt-2 space-y-3 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-black" /> Products:{" "}
                    <span className="font-medium">{brand.productCount}</span>
                  </p>

                  <Link
                    href={brand.brandWebsite}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe size={16} /> Visit Website
                  </Link>

                  <Link
                    href={`/brands/${slug}`}
                    className="inline-block text-sm mt-3 px-4 py-2 rounded-lg bg-gray-100 text-black border hover:border-gray-500 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No brands found for "{search}".
        </p>
      )}
    </div>
  );
}
