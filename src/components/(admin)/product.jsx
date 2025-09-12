"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch brands using TanStack Query (React Query)
  const { data: brands = [], isLoading: loadingBrands, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await axios.get("/api/Brand");
      // return array when successful, otherwise return empty array
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    },
    onSuccess: (data) => {
      console.log("Brands fetched successfully:", data);
    },
    onError: (err) => {
      console.error("Error fetching brands:", err);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const files = data.productImage || [];
      if (files.length < 3 || files.length > 5) {
        alert("Please upload between 3 and 5 images.");
        setIsSubmitting(false);
        return;
      }

      // Step 1: Upload images
      const imageFormData = new FormData();
      files.forEach((file) => {
        imageFormData.append("productImage", file);
      });

      const geturls = await axios.post("/api/upload", imageFormData);

      if (!geturls.data?.urls) {
        throw new Error("Failed to upload product images");
      }

      console.log("Uploaded image URLs:", geturls.data.urls);

      // Step 2: Create product with uploaded URLs
      
      const formData = {
        productName: data.productName,
        productDescription: data.productDescription,
        productPrice: data.productPrice,
        productQuantity: data.productQuantity,
        brand: data.brand,
        productImage: geturls.data.urls,
      };

      const res = await axios.post("/api/product", formData);

      if (res.status !== 201)
        throw new Error(res.data.message || "Failed to add product");

      alert("Product added successfully!");
      reset();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
        Add New Product
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        encType="multipart/form-data"
      >
        {/* Product Name */}
        <div>
          <label className="block mb-2 font-medium">Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            {...register("productName", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.productName && (
            <p className="text-red-500 text-sm mt-1">
              Product name is required
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="number"
            placeholder="Enter price"
            {...register("productPrice", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.productPrice && (
            <p className="text-red-500 text-sm mt-1">Price is required</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-2 font-medium">Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            {...register("productQuantity", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.productQuantity && (
            <p className="text-red-500 text-sm mt-1">Quantity is required</p>
          )}
        </div>

        {/* Brand Select */}
        <div>
          <label className="block mb-2 font-medium">Brand</label>
          {loadingBrands ? (
            <p className="text-gray-500 text-sm">Loading brands...</p>
          ) : (
            <select
              {...register("brand", { required: true })}
              defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
            >
              <option value="" disabled>
                Select a brand
              </option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          )}
          {errors.brand && (
            <p className="text-red-500 text-sm mt-1">Brand is required</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Product Description</label>
          <textarea
            placeholder="Enter product description"
            {...register("productDescription", { required: true })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          {errors.productDescription && (
            <p className="text-red-500 text-sm mt-1">Description is required</p>
          )}
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Product Images (min 3, max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setValue("productImage", files, { shouldValidate: true });
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer hover:file:bg-gray-900"
          />

          {errors.productImage && (
            <p className="text-red-500 text-sm mt-1">
              Please upload 3 to 5 images
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-4 flex justify-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white py-3 px-6 rounded-lg text-base font-medium tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
