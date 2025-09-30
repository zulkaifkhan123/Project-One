"use client";

import { use } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Star, StarHalf, StarOff, Truck, Heart, Tag } from "lucide-react";
import Link from "next/link";

export default function ProductPage({ params }) {
  const { product: productSlug } = use(params);

  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/product");
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
      return [];
    },
    enabled: !!session,
  });

  const { data: userOrder, isLoading: orderLoading } = useQuery({
    queryKey: ["userOrder", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const res = await axios.get(
        `/api/order_Status_check?userId=${session.user.id}`
      );
      return res.data?.data || null;
    },
    enabled: !!session?.user?.id,
  });

  if (status === "loading")
    return <p className="text-center mt-20">Checking login...</p>;
  if (!session)
    return (
      <p className="text-center mt-20">
        Please{" "}
        <Link className="text-blue-600 underline" href="/login">
          Login
        </Link>{" "}
        to see product details
      </p>
    );
  if (isLoading || orderLoading)
    return <p className="text-center mt-20">Loading...</p>;
  if (isError)
    return <p className="text-center mt-20">Something went wrong.</p>;

  const products = productsData || [];
  const product = products.find(
    (p) => p.slug?.toLowerCase() === productSlug?.toLowerCase()
  );
  if (!product) return <p className="text-center mt-20">No product found.</p>;

  const mainImage = selectedImage || product.productImage?.[0];
  const rating = 4.2;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  const hasActiveOrder =
    userOrder &&
    (userOrder.status === "pending" || userOrder.status === "approved");

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const res = await axios.post("/api/cart", {
        userId: session.user.id,
        productId: product._id,
        quantity,
      });

      if (res.data.success) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error("Failed to add to cart: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-white py-8 px-4 sm:px-6 lg:px-10 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Image Gallery */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="border border-gray-200 rounded-lg overflow-hidden w-full h-[300px] sm:h-[350px] relative shadow">
            {mainImage && (
              <Image
                priority
                title={product.productName || "Product Image"}
                src={mainImage}
                alt={product.productName || "Product Image"}
                quality={100}
                width={500}
                height={500}
                className="object-contain w-full h-full"
              />
            )}
          </div>
          <div className="flex mt-4 gap-3 overflow-x-auto w-full pb-2">
            {product.productImage?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 flex-shrink-0 border rounded-lg cursor-pointer overflow-hidden transition ${
                  img === mainImage ? "border-black border-2" : "border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.productName || "Product"}-${idx}`}
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:col-span-2 flex flex-col space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            {product.productName}
          </h1>

          {product.brand && (
            <p className="text-gray-700 text-sm">
              Brand:{" "}
              <span className="font-semibold">{product.brand.brandName}</span>
              {product.brand.brandWebsite && (
                <a
                  href={product.brand.brandWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline text-blue-600"
                >
                  Visit Website
                </a>
              )}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-4">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${product.productPrice}
            </p>
            <div className="flex items-center space-x-1 text-xs sm:text-sm font-semibold bg-black/5 px-3 py-1 rounded-full">
              <Tag size={16} /> <span>10% OFF</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-400" />
            ))}
            {halfStar && <StarHalf size={16} className="text-yellow-400" />}
            {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
              <StarOff key={i} size={16} className="text-yellow-200" />
            ))}
            <span className="ml-2 text-sm text-gray-800">{rating} / 5</span>
          </div>

          {/* Availability */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                product.productQuantity > 0
                  ? "border-black text-black"
                  : "border-gray-400 text-gray-400"
              }`}
            >
              {product.productQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold border border-black flex items-center gap-1">
              <Truck size={16} /> <span>Free delivery 3-5 days</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Qty:</span>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.productQuantity || 1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 border border-gray-400 rounded px-2 py-1 text-sm"
                disabled={hasActiveOrder}
              />
            </div>

            {hasActiveOrder ? (
              <button
                className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed text-sm"
                disabled
              >
                You already have an order
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.productQuantity === 0}
                  className="flex-1 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/70 transition text-sm"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                
              </>
            )}

            
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Product Description
            </h2>
            <p className="text-sm leading-6 text-gray-700">
              {product.productDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
