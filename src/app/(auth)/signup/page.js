"use client";
import Link from "next/link";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  Building2,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function RegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
  try {
    console.log("➡️ Signup form submitted with data:", data);
    setLoading(true);

    const formData = new FormData();
    if (data.tax_id?.[0]) {
      console.log("📂 Attaching tax_id file:", data.tax_id[0].name);
      formData.append("tax_id", data.tax_id[0]);
    }
    if (data.business_licence?.[0]) {
      console.log("📂 Attaching business_licence file:", data.business_licence[0].name);
      formData.append("business_licence", data.business_licence[0]);
    }

    console.log("⬆️ Sending formData to /api/signup_uploads ...");

    const uploadRes = await axios.post("/api/signup_uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Upload API response:", uploadRes);

    if (!uploadRes.data) throw new Error("Upload failed - no response data");

    const { taxIdUrl, licenseUrl } = uploadRes.data;
    console.log("✅ Received uploaded file URLs:", { taxIdUrl, licenseUrl });

    console.log("⬆️ Sending signup request with uploaded URLs...");

    const signupRes = await axios.post("/api/signup", {
      ...data,
      tax_id: taxIdUrl,
      business_licence: licenseUrl,
    });

    const responseData = signupRes.data;
    console.log("✅ Signup API response:", responseData);

    if (responseData?.success === true) {
      toast.success(responseData.message, { duration: 4000 });

      const username = responseData?.user?.username || data.username;
      reset();
      console.log("➡️ Redirecting to verification page for:", username);
      router.push(`/email-verification/${encodeURIComponent(username)}`);
    } else {
      console.warn("⚠️ Signup Failed:", responseData);
      toast.error(responseData.message || "Signup failed. Please try again.");
    }
  } catch (err) {
    console.error("❌ Signup error:", err.response?.data || err.message, err);
    toast.error("Signup failed. Please try again.");
  } finally {
    setLoading(false);
    console.log("⏹️ Signup process finished, loading reset.");
  }
};


  // const onSubmit = async (data) => {
  //   try {
  //     setLoading(true);

  //     const formData = new FormData();
  //     if (data.tax_id?.[0]) formData.append("tax_id", data.tax_id[0]);
  //     if (data.business_licence?.[0])
  //       formData.append("business_licence", data.business_licence[0]);

  //     const uploadRes = await axios.post("/api/signup_uploads", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (!uploadRes.data) throw new Error("Upload failed - no response data");

  //     const { taxIdUrl, licenseUrl } = uploadRes.data;

  //     const signupRes = await axios.post("/api/signup", {
  //       ...data,
  //       tax_id: taxIdUrl,
  //       business_licence: licenseUrl,
  //     });

  //     const responseData = signupRes.data;
  //     console.log("Signup response data:", responseData);

  //     if (responseData?.success === true) {
  //       toast.success(responseData.message, { duration: 4000 });

  //       const username = responseData?.user?.username || data.username;
  //       reset();
  //       router.push(`/email-verification/${encodeURIComponent(username)}`);
  //     } else {
  //       console.log("Signup Failed:", responseData);
  //       toast.error(responseData.message || "Signup failed. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Signup error:", err.response?.data || err.message);
  //     toast.error("Signup failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-center py-1 bg-white text-black">
      <div className="w-full max-w-5xl p-8 bg-white rounded-xl">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-3">Register</h1>
        <p className="text-center text-gray-500 mb-8 text-base">
          Create your wholesale store account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-wrap gap-6 justify-between"
          // className="grid grid-cols-3 gap-6"
        >
          {/* Username */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">Username</label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <User className="w-5 h-5 text-gray-500" />
              <input
                {...register("username", {
                  required: true,
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,20}$/,
                    message:
                      "Username must be 3–20 characters (letters, numbers, underscores)",
                  },
                })}
                type="text"
                placeholder="dawood_khan124"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
            {errors.username &&
              (errors.username.message ? (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              ) : (
                <p className="text-red-500 text-sm">Username is required</p>
              ))}
          </div>

          {/* Email */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">Email</label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <Mail className="w-5 h-5 text-gray-500" />
              <input
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                placeholder="jhon222@gmail.com"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">Password</label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <Lock className="w-5 h-5 text-gray-500" />
              <input
                {...register("password", {
                  required: true,
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must be at least 8 characters, include upper/lowercase, number, and special character",
                  },
                })}
                type="password"
                placeholder="Pass@1234"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">Password is required</p>
            )}
          </div>

          {/* Business Name */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">
              Brand/Business Name
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <Building2 className="w-5 h-5 text-gray-500" />
              <input
                {...register("business_name", { required: true })}
                type="text"
                placeholder="Nike , Apple etc"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
            {errors.business_name && (
              <p className="text-red-500 text-sm">Business name is required</p>
            )}
          </div>

          {/* Business License */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">
              Business License
            </label>
            <div className="px-3 border cursor-pointer border-gray-300 rounded-md bg-blue-50">
              <input
                type="file"
                accept="image/*"
                {...register("business_licence", { required: true })}
                className="w-full p-3 cursor-pointer text-base outline-none bg-transparent"
              />
            </div>
            {errors.business_licence && (
              <p className="text-red-500 text-sm">
                Business license is required
              </p>
            )}
          </div>

          {/* Tax ID */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">Tax ID</label>
            <div className="px-3 border border-gray-300 rounded-md bg-blue-50">
              <input
                type="file"
                accept="image/*"
                {...register("tax_id", { required: true })}
                className="w-full p-3 cursor-pointer text-base outline-none bg-transparent"
              />
            </div>
            {errors.tax_id && (
              <p className="text-red-500 text-sm">Tax ID is required</p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">
              Shipping Address
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <MapPin className="w-5 h-5 text-gray-500" />
              <input
                {...register("shipping_address", { required: true })}
                type="text"
                placeholder="123 Main St, Apartment 4B, New York, NY 10001, USA"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
            {errors.shipping_address && (
              <p className="text-red-500 text-sm">
                Shipping address is required
              </p>
            )}
          </div>

          {/* Billing Address */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">
              Billing Address
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <MapPin className="w-5 h-5 text-gray-500" />
              <input
                {...register("billing_address", { required: true })}
                type="text"
                placeholder="billing address (Street, City, State, ZIP, Country)"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
            {errors.billing_address && (
              <p className="text-red-500 text-sm">
                Billing address is required
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">
              Phone Number
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <Phone className="w-5 h-5 text-gray-500" />
              <input
                {...register("phone_number", { required: true })}
                type="text"
                placeholder="+1 234 567 8901"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
            {errors.phone_number && (
              <p className="text-red-500 text-sm">Phone number is required</p>
            )}
          </div>

          {/* Website */}
          <div className="w-full md:w-[48%]">
            <label className="block mb-2 text-base font-medium">
              Website (optional)
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <Globe className="w-5 h-5 text-gray-500" />
              <input
                {...register("website")}
                type="text"
                placeholder="https://www.yourwebsitedomain.com"
                className="w-full p-3 text-base outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex align-center w-full justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-104 cursor-pointer bg-black text-white py-3 rounded-md text-base hover:bg-gray-900 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {/* Signup Option */}
        <p className="text-center text-gray-500 mt-4 text-base">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black cursor-pointer font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
