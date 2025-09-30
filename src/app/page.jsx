"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tag, Boxes , ShoppingBag } from "lucide-react";
import MovingInfoCards from "../components/slider"

// ✅ Fetch products
const fetchProducts = async () => {
  const res = await axios.get("/api/product");
  const response = res.data;

  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

// ✅ Fetch brands
const fetchBrands = async () => {
  const res = await axios.get("/api/Brand");
  if (res.data.success) {
    return res.data.data;
  } else {
    throw new Error(res.data.message || "Failed to fetch brands");
  }
};

export default function HomePage() {
  const router = useRouter();

  // Products query
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Brands query
  const {
    data: brands = [],
    isLoading: isBrandsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["brands-home"],
    queryFn: fetchBrands,
  });

  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  const featuredBrands = Array.isArray(brands) ? brands.slice(0, 8) : [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Our Wholesale Platform
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mb-6">
            Buy quality products in bulk for your shop with the best deals and
            fastest delivery.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
            >
              Shop Now
            </button>
            <button
              onClick={() => router.push("/brands")}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Shop by Brands
            </button>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { title: "Bulk Purchasing", desc: "Get the best wholesale rates." },
          { title: "Trusted Dealers", desc: "Work with verified suppliers." },
          { title: "Fast Delivery", desc: "Reliable and quick shipping." },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
            <p className="text-gray-600">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          {isLoading ? (
            <p className="text-center">Loading products...</p>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10">
              {featuredProducts.map((product) => (
                <div
                  onClick={() =>
                    router.replace(
                      `/products/${decodeURIComponent(product.slug)}`
                    )
                  }
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-45">
                    {product.productImage?.length > 0 && (
                      <Image
                        src={product.productImage[0]}
                        alt={product.productName}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5 space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.productName}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.productDescription}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        <Tag size={16} className="text-gray-500" /> $
                        {product.productPrice}
                      </span>
                      <span className="text-gray-600 flex items-center gap-1">
                        <Boxes size={16} /> {product.productQuantity} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Categories</h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {["Electronics", "Clothing", "Groceries", "Stationery"].map(
            (cat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold">{cat}</h3>
              </div>
            )
          )}
        </div>
      </section>

      {/* Detailed Info Section */}
<section
  className="relative py-20 px-6 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/solid.jpg')" }}
>
  {/* Overlay for better text visibility */}
  <div className="absolute inset-0 bg-black/40"></div>

  <div className="relative max-w-5xl mx-auto text-center text-white">
    <h2 className="text-4xl font-bold mb-6">
      Why Choose Our Wholesale Platform?
    </h2>
    <p className="text-lg leading-relaxed">
      Our platform connects dealers with trusted suppliers, making bulk
      shopping easier than ever. We ensure competitive pricing, secure
      payments, and fast deliveries to help you stock your shop with the
      best products. Whether you are a small retailer or a large
      distributor, we are here to support your business growth.
    </p>
  </div>
</section>


      {/* ✅ Featured Brands Section (Dynamic) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Shop by Brands
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto text-lg">
            Discover products from your favorite brands. Click on any brand card
            to view detailed information about the brand and explore all the
            products available under that brand.
          </p>

          {isBrandsLoading ? (
            <p className="text-center">Loading brands...</p>
          ) : isError ? (
            <p className="text-center text-red-500">
              Error loading brands: {error.message}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {featuredBrands.map((brand) => (
                <div
                  key={brand._id}
                  onClick={() => router.push(`/brands/${brand.slug}`)}
                  className="flex flex-col items-center bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center cursor-pointer"
                >
                  {/* Brand Logo */}
                  {brand.brandLogo ? (
                    <div className="w-28 h-28 mb-4 relative">
                      <Image
                        src={brand.brandLogo}
                        alt={brand.brandName}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-15 h-15 mb-4 flex items-center justify-center bg-gray-200 rounded-full text-xl font-bold">
                      {brand.brandName.charAt(0)}
                    </div>
                  )}

                  {/* Brand Info */}
                  <h3 className="text-xl font-semibold mb-2">
                    {brand.brandName}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {brand.brandDescription ||
                      `Shop with ${brand.brandName} – trusted products.`}
                  </p>
                  <p className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <ShoppingBag size={16} className="text-black" />Available Products :{" "}
                    <span className="font-medium">{brand.productCount}</span>
                  </p>

                  {/* CTA */}
                  <span className="text-red-500 font-medium hover:underline">
                    Explore {brand.brandName} →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <MovingInfoCards/>

    </div>
  );
}
