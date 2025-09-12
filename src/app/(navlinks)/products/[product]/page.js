"use client";

import { use } from "react"; // ✅ Needed to unwrap params
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Star, StarHalf, StarOff, Truck, Heart, Tag } from "lucide-react";
import Link from "next/link";

export default function ProductPage({ params }) {
  // ✅ unwrap params properly
  const { product: productSlug } = use(params);

  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // ✅ Fetch all products
  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/product");
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
      return [];
    },
    enabled: !!session,
  });

  // ✅ Fetch single user order (backend returns ONE order object)
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
      <p className="text-center mt-20">Please <Link className="text-blue-600 underline" href="/login">Login</Link> to see product details</p>
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
    <div className="min-h-[80vh] bg-white py-10 flex justify-center">
      <div className="max-w-7xl w-full px-6 grid md:grid-cols-3 gap-12">
        {/* Left: Image Gallery */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="border border-black rounded-lg overflow-hidden w-full h-[350px] relative shadow-lg">
            {mainImage && (
              <Image
                priority
                title={product.productName || "Product Image"}
                src={mainImage}
                alt={product.productName || "Product Image"}
                quality={100}
                width={400}
                height={400}
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
          <div className="flex mt-4 w-100 space-x-5 space-y-5 flex-wrap overflow-x-auto">
            {product.productImage?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 flex-shrink-0 border rounded-lg cursor-pointer overflow-hidden transition ${
                  img === mainImage
                    ? "border-black border-2"
                    : "border-black/30"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.productName || "Product"}-${idx}`}
                  width={80}
                  height={80}
                  priority
                  title={product.productName || "Product Image"}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:col-span-2 flex flex-col space-y-4 sticky top-20">
          <h1 className="text-4xl font-extrabold leading-tight">
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
                  className="ml-2 underline"
                  title={`Visit ${product.brand.brandWebsite}`}
                >
                  Visit Website
                </a>
              )}
            </p>
          )}

          <div className="flex items-center space-x-6">
            <p className="text-3xl font-bold">${product.productPrice}</p>
            <div className="flex items-center space-x-1 text-sm font-semibold bg-black/5 px-2 py-1 rounded-full">
              <Tag size={18} /> <span>10% OFF</span>
            </div>
          </div>

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

          <div className="flex items-center space-x-2 mt-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                product.productQuantity > 0 ? "border-black" : "border-black/50"
              } ${
                product.productQuantity > 0 ? "text-black" : "text-black/50"
              }`}
            >
              {product.productQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold border border-black flex items-center space-x-1">
              <Truck size={16} /> <span>Free delivery 3-5 days</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Quantity:</span>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.productQuantity || 1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 border border-black rounded px-2 py-1 text-sm"
                disabled={hasActiveOrder}
              />
            </div>

            {hasActiveOrder ? (
              <button
                className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
                disabled
              >
                You cannot add new products. You already have an order.
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.productQuantity === 0}
                  className="flex-1 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/70 transition shadow-md text-sm"
                >
                  {addingToCart ? "Adding To Cart..." : "Add to Cart"}
                </button>
                <button className="flex-1 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/70 transition shadow-md text-sm">
                  Buy Now
                </button>
              </>
            )}

            <button className="px-4 py-2 border border-black rounded hover:bg-black/5 shadow-sm">
              <Heart size={18} />
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-3">Product Description</h2>
            <p className="text-sm leading-7 text-gray-800">
              {product.productDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
