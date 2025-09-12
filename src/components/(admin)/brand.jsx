"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

export default function AddBrandForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const res = await axios.post("/api/Brand", {
        brandName: data.brandName,
        brandDescription: data.brandDescription,
        brandWebsite: data.brandWebsite,
      });

      if (res.data.success) {
        reset();
        alert("Brand added successfully!");
      } else {
        alert(res.data.message || "Failed to add brand");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
        Add New Brand
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block mb-2 font-medium">Brand Name</label>
          <input
            type="text"
            placeholder="Enter brand name"
            {...register("brandName", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.brandName && (
            <p className="text-red-500 text-sm mt-1">Brand Name is required</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Brand Website</label>
          <input
            type="url"
            placeholder="https://example.com"
            {...register("brandWebsite")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Brand Description</label>
          <textarea
            placeholder="Enter brand description"
            {...register("brandDescription", { required: true })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          ></textarea>
          {errors.brandDescription && (
            <p className="text-red-500 text-sm mt-1">Description is required</p>
          )}
        </div>

        <div className="md:col-span-2 flex justify-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white py-3 px-6 rounded-lg text-base font-medium tracking-wide
                       hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            {isSubmitting ? "Adding..." : "Add Brand"}
          </button>
        </div>
      </form>
    </div>
  );
}
