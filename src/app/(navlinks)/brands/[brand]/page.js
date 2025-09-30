"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Search, Tag, Package, ExternalLink, Store, Boxes } from "lucide-react";

const fetchBrands = async () => {
  const res = await axios.get("/api/Brand");
  return res.data.data;
};

export default function BrandDetailPage() {
  const { brand } = useParams();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  if (isLoading) {
    return <p className="text-center mt-20">Loading brand details...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-600 mt-20">Error: {error.message}</p>
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

  const filteredProducts =
    currentBrand?.products?.filter((product) =>
      product?.productName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="container mx-auto px-3 py-5 text-black">
      <div className="w-full rounded-2xl shadow-xl p-6 sm:p-10 mb-12 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full bg-white text-black text-3xl sm:text-4xl font-bold shadow-lg">
          {currentBrand?.brandName?.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-extrabold">
            {currentBrand?.brandName}
          </h1>
          <p className="mt-3 text-sm sm:text-base opacity-90 leading-relaxed">
            {currentBrand?.brandDescription}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mt-6 text-xs sm:text-sm">
            <span className="bg-white text-black px-4 py-2 rounded-full font-semibold shadow flex items-center gap-2">
              <Package size={16} /> {currentBrand?.productCount || 0} Products
            </span>
            {currentBrand?.brandWebsite && (
              <Link
                href={currentBrand.brandWebsite}
                target="_blank"
                className="bg-white text-black px-4 py-2 rounded-full font-semibold shadow flex items-center gap-2 hover:bg-gray-100 transition"
              >
                Visit Website <ExternalLink size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <div className="relative w-full sm:w-3/4 md:w-1/2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border w-full px-12 py-3 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
          />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
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
              className="rounded-xl shadow-md border bg-white hover:shadow-lg transition cursor-pointer overflow-hidden"
            >
              {product.productImage?.length > 0 && (
                <Image
                  src={product.productImage[0]}
                  alt={product.productName}
                  width={400}
                  height={400}
                  className="rounded-t-md object-contain w-full h-40 sm:h-44"
                />
              )}

              <div className="p-4 space-y-2">
                <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Package size={16} className="text-gray-600" />
                  {product.productName}
                </h2>

                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                  {product.productDescription}
                </p>

                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <Store size={14} className="text-gray-500" />
                  {currentBrand.brandName || "Unknown Brand"}
                </div>

                <div className="flex justify-between items-center pt-2 border-t text-xs sm:text-sm">
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
        <p className="text-gray-500 mt-10 text-center text-sm sm:text-lg">
          No products found for your search.
        </p>
      )}
    </div>
  );
}
