"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PaidReceipts() {
  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ["paidReceipts"],
    queryFn: async () => {
      const res = await axios.get("/api/getPaidReceipts");
      if (res.data?.success) {
        return res.data.data || [];
      }
      toast.error(res.data?.message || "Failed to fetch paid receipts");
      return [];
    },
  });

  if (isLoading) {
    return (
      <p className="text-gray-600 text-center mt-10">
        Loading paid receipts...
      </p>
    );
  }

  return (
    <main className="md:p-6 min-h-screen">
      {/* Heading */}
      <header className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Paid Receipts Overview
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Here are the receipts where customers have submitted proof of payment.
        </p>
      </header>

      {/* Receipts */}
      {receipts.length === 0 ? (
        <p className="text-gray-500 text-center">No paid receipts found.</p>
      ) : (
        <section className="space-y-6 md:space-y-8 flex flex-col items-center">
          {receipts.map((receipt) => (
            <ReceiptCard key={receipt._id} receipt={receipt} />
          ))}
        </section>
      )}
    </main>
  );
}

// ----- Receipt Card Component -----
function ReceiptCard({ receipt }) {
  const [showImage, setShowImage] = useState(false);

  return (
    <article className="w-full max-w-5xl bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Header */}
      <header className="p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-start gap-3 border-b border-gray-200">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Receipt #{receipt._id?.slice(-6) || "N/A"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            User:{" "}
            <span className="font-medium">
              {receipt.userId?.name || receipt.userId?.email || "Unknown User"}
            </span>
          </p>
          <p className="text-xs md:text-sm text-gray-400 mt-0.5">
            Uploaded on{" "}
            {receipt.createdAt
              ? new Date(receipt.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : "N/A"}
          </p>
        </div>
        <span className="self-start md:self-center px-3 md:px-4 py-1 text-xs md:text-sm font-medium rounded-full bg-green-100 text-green-800">
          PAID
        </span>
      </header>

      {/* Order Details */}
      <section className="p-4 md:p-5">
        <h3 className="font-medium text-gray-800 mb-3 text-sm md:text-base">
          Order Details
        </h3>
        {receipt.orderId?.items?.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 py-2 text-gray-600 border-b border-gray-100 text-sm"
          >
            <div className="col-span-1 md:col-span-6">
              {item.products?.productName || "Unknown Product"}
            </div>
            <div className="col-span-1 md:col-span-3 text-center">
              {item.quantity}
            </div>
            <div className="col-span-2 md:col-span-3 text-right font-medium">
              $
              {item.products?.productPrice
                ? item.products.productPrice * item.quantity
                : 0}
            </div>
          </div>
        ))}
        <div className="flex justify-end font-semibold text-gray-900 mt-3 text-sm md:text-base">
          Total: ${receipt.orderId?.totalAmount || 0}
        </div>
      </section>

      {/* Receipt Proof */}
      <section className="p-4 md:p-5 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2 text-sm md:text-base">
          Payment Proof
        </h3>
        {receipt.receiptUrl ? (
          <div className="space-y-3">
            {/* SEO-friendly link */}
            <Link
              href={receipt.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline text-sm"
            >
              View Receipt in another tab
            </Link>

            {/* Toggle image on the same page */}
            <button
              onClick={() => setShowImage(!showImage)}
              className="text-sm md:text-base text-white bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showImage ? "Hide Receipt" : "Show Receipt"}
            </button>

            {showImage && (
              <div className="mt-3">
                <Image
                  src={receipt.receiptUrl}
                  alt={`Receipt proof for ${receipt._id}`}
                  width={900}
                  height={400}
                  className="rounded-lg md:rounded-xl border border-gray-200 shadow"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No receipt uploaded.</p>
        )}
      </section>
    </article>
  );
}
