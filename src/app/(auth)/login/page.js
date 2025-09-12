"use client";

import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const useForm = () => {
  const [data, setData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});

  const register = (name) => ({
    name,
    value: data[name],
    onChange: (e) => setData({ ...data, [name]: e.target.value }),
  });

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!data.identifier) newErrors.identifier = "Email or Username is required";
    if (!data.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) callback(data);
  };

  return { register, handleSubmit, formState: { errors } };
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ identifier, password }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) return toast.error(result.error, { duration: 1500 });

      toast.success("Successfully Signed in", { duration: 1500 });
      router.back();  
    } catch (err) {
      toast.error("Sign-in failed , Internet Server Error", { duration: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-10 bg-white text-black">
      <div className="w-full max-w-md p-8 bg-white rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-3">Login</h1>
        <p className="text-center text-gray-500 mb-8 text-base">Wholesale</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username / Email Field */}
          <div className="mb-4">
            <label className="block mb-2 text-base font-medium">Username / Email</label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <User className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Enter your username or email"
                className={`w-full p-3 text-base outline-none bg-transparent ${errors.identifier ? "border-red-500" : ""}`}
                {...register("identifier")}
              />
            </div>
            {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label className="block mb-2 text-base font-medium">Password</label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md bg-gray-50">
              <Lock className="w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Enter your password"
                className={`w-full p-3 text-base outline-none bg-transparent ${errors.password ? "border-red-500" : ""}`}
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md text-base hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4 text-base">
          Do not have an account?{" "}
          <Link href="/signup" className="text-black font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
