"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const router = useRouter();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", session?.user?.id],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/order_Status_check?userId=${session?.user?.id}`
        );
        return res.data.data ? [res.data.data] : [];
      } catch (err) {
        console.error("Order fetch error:", err);
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  async function handleUpload(orderId) {
    if (!receiptFile) {
      toast.error("Please select a receipt screenshot first!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("receipt_image", receiptFile);

      const uploadRes = await axios.post("/api/upload_receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!uploadRes.data?.url) {
        throw new Error("Upload failed, no URL returned");
      }

      const receiptUrl = uploadRes.data.url;

      await axios.post("/api/store-receipt", {
        orderId,
        userId: session?.user?.id,
        receiptUrl,
      });

      toast.success("Receipt uploaded successfully!");
      toast.success("Thank you! Your order will be processed within 24-48 hours.", {
        duration: 8000,
      });

      setReceiptFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err.response?.data?.error || "Failed to upload receipt. Please try again."
      );
    } finally {
      setLoading(false);
      setReceiptFile(null);
      router.push("/products");
    }
  }

  if (isLoading) return <p className="text-center mt-10">Loading order...</p>;
  if (error) {
    console.error("Error fetching order:", error);
    return <p className="text-center text-red-500">Error fetching order</p>;
  }

  if (!orders || orders.length === 0) {
    return <p className="text-center mt-10">No active orders found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 relative z-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Checkout
      </h1>

      {orders.map((order) => (
        <div key={order._id} className="mb-10">
          {/* Products */}
          <div className="grid gap-4 sm:gap-6">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border rounded-2xl p-4 shadow-sm"
              >
                <Image
                  src={item.products.productImage[0]}
                  alt={item.products.productName}
                  width={100}
                  height={100}
                  className="rounded-lg object-contain w-full sm:w-[100px] h-[180px] sm:h-[100px]"
                />
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-semibold">
                    {item.products.productName}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.products.productDescription}
                  </p>
                  <p className="mt-1 text-sm">
                    Quantity:{" "}
                    <span className="font-medium">{item.quantity}</span>
                  </p>
                </div>
                <p className="text-base sm:text-lg font-bold">
                  ${item.products.productPrice}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 p-4 sm:p-6 border rounded-2xl shadow-md bg-gray-50">
            <div className="flex justify-between mb-2 text-base sm:text-lg">
              <span>Subtotal</span>
              <span>${order.totalAmount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg sm:text-xl border-t pt-2">
              <span>Total</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>

          {/* Bank Details & Contact */}
          <div className="mt-8 p-4 sm:p-6 border rounded-2xl shadow-md bg-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Payment Instructions
            </h2>
            <p className="mb-2 text-sm sm:text-base">
              Please transfer the total amount to the following bank account:
            </p>
            <ul className="mb-4 space-y-1 text-gray-700 text-sm sm:text-base">
              <li>
                <strong>Bank Name:</strong> ABC Bank
              </li>
              <li>
                <strong>Account Holder:</strong> Admin Name
              </li>
              <li>
                <strong>Account Number:</strong> 1234 5678 9101
              </li>
              <li>
                <strong>IBAN:</strong> PK12ABCD000123456789
              </li>
              <li>
                <strong>SWIFT Code:</strong> ABCDPKKA
              </li>
            </ul>
            <p className="mb-2 text-sm sm:text-base">
              After payment, kindly share the receipt with us.
            </p>

            {/* Receipt Upload Form */}
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpload(order._id);
              }}
            >
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Upload Receipt Screenshot
              </label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                className="block w-full text-sm mb-4 border border-gray-300 rounded-lg px-3 py-2 
                           focus:outline-none focus:ring-2 focus:ring-black 
                           file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg 
                           file:border-0 file:bg-black file:text-white 
                           file:cursor-pointer hover:file:bg-gray-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow 
                           hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Uploading..." : "Upload Receipt"}
              </button>
            </form>

            <h3 className="text-base sm:text-lg font-semibold mt-6 mb-2">
              Contact Details
            </h3>
            <ul className="space-y-1 text-gray-700 text-sm sm:text-base">
              <li>
                <strong>Email:</strong> admin@example.com
              </li>
              <li>
                <strong>Phone:</strong> +92 300 1234567
              </li>
              <li>
                <strong>WhatsApp:</strong> +92 300 1234567
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
