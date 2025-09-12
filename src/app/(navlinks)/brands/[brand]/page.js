"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Search, Tag, Package, ExternalLink, Store, Boxes } from "lucide-react";

// ✅ Axios fetch function
const fetchBrands = async () => {
  const res = await axios.get("/api/Brand");
  return res.data.data;
};

export default function BrandDetailPage() {
  const { brand } = useParams(); // ✅ slug from URL
  const router = useRouter();
  const [search, setSearch] = useState("");

  // ✅ TanStack Query with Axios
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  if (isLoading) {
    return <p className="text-center mt-20">Loading brand details...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-600 mt-20">
        Error: {error.message}
      </p>
    );
  }

  const brands = data || [];
  const currentBrand = brands.find(
    (b) => b?.slug?.toLowerCase() === brand?.toLowerCase()
  );

  if (!currentBrand) {
    return (
      <p className="text-center text-red-600 mt-20">
        Brand not found for "{brand}".
      </p>
    );
  }

  // ✅ Filter products by search
  const filteredProducts =
    currentBrand?.products?.filter((product) =>
      product?.productName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="container mx-auto px-0 py-5 text-black">
      {/* Brand Hero Section */}
      <div className="w-full rounded-2xl shadow-xl p-10 mb-12 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black text-4xl font-bold shadow-lg">
          {currentBrand?.brandName?.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold">
            {currentBrand?.brandName}
          </h1>
          <p className="mt-3 text-base opacity-90 leading-relaxed">
            {currentBrand?.brandDescription}
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            <span className="bg-white text-black px-5 py-2 rounded-full font-semibold shadow flex items-center gap-2">
              <Package size={16} /> {currentBrand?.productCount || 0} Products
            </span>
            {currentBrand?.brandWebsite && (
              <Link
                href={currentBrand.brandWebsite}
                target="_blank"
                className="bg-white text-black px-5 py-2 rounded-full font-semibold shadow flex items-center gap-2 hover:bg-gray-100 transition"
              >
                Visit Website <ExternalLink size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <div className="relative w-full md:w-1/2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border w-full px-12 py-3 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Products Section */}
      <h2 className="text-2xl font-bold mb-6">
        {currentBrand?.brandName} Products
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              onClick={() =>
                router.replace(`/products/${decodeURIComponent(product.slug)}`)
              }
              key={product._id}
              className="rounded-xl shadow-sm border bg-white hover:shadow-md transition cursor-pointer overflow-hidden"
            >
              {product.productImage?.length > 0 && (
                <Image
                  src={product.productImage[0]}
                  alt={product.productName}
                  width={400}
                  height={400}
                  className="rounded-md object-contain overflow-hidden w-full h-60"
                />
              )}

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Brand + Name */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Package size={16} className="text-gray-600" />
                    {product.productName}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-3">
                  {product.productDescription}
                </p>

                {/* Brand */}
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <Store size={14} className="text-gray-500" />
                  {currentBrand.brandName || "Unknown Brand"}
                </div>

                {/* Price & Stock */}
                <div className="flex justify-between items-center pt-2 border-t text-sm">
                  <span className="flex items-center gap-1 font-semibold text-gray-800">
                    <Tag size={14} className="text-gray-500" /> $
                    {product.productPrice}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Boxes size={14} className="text-gray-500" />{" "}
                    {product.productQuantity} in stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-10 text-center text-lg">
          No products found for your search.
        </p>
      )}
    </div>
  );
}
