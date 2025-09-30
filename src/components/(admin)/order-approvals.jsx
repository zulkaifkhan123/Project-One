"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

export default function OrderApproval() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/api/pendingOrders");

      if (res.data?.success) {
        toast.success(res.data.message || "Orders fetched");
        return res.data.data || [];
      }

      toast.error(res.data?.message || "Failed to fetch orders");
      return [];
    },
    enabled: !!session?.user,
  });

  // ✅ Mutation for updating order status
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, adminNotes }) => {
      const res = await axios.put("/api/orderStatus", {
        orderId,
        status,
        adminNotes,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Order updated successfully");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating order");
    },
  });

  if (!session) {
    return (
      <p className="text-gray-600 text-center mt-10">
        Please log in to view orders.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-gray-600 text-center mt-10">Loading orders...</p>
    );
  }

  return (
    <div className="md:p-6 min-h-screen">
      {/* Heading */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">
          Approve or Reject Orders
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Review, approve, or reject pending orders and add any necessary admin
          notes.
        </p>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No pending orders to review.</p>
      ) : (
        <div className="space-y-6 md:space-y-8 flex flex-col items-center">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onAction={(status, notes) =>
                updateOrderMutation.mutate({
                  orderId: order._id,
                  status,
                  adminNotes: notes,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ----- Order Card Component -----
function OrderCard({ order, onAction }) {
  const [notes, setNotes] = useState(order.adminNotes || "");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Header */}
      <div className="p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-start gap-3 border-b border-gray-200">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Order #{order._id?.slice(-6) || "N/A"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Customer Email:{" "}
            <span className="font-medium">{order.user?.email || "Unknown"}</span>
          </p>
          <p className="text-xs md:text-sm text-gray-400 mt-0.5">
            Placed on{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <span
          className={`self-start md:self-center px-3 md:px-4 py-1 text-xs md:text-sm font-medium rounded-full ${
            statusColors[order.status] || ""
          }`}
        >
          {order.status?.toUpperCase() || "UNKNOWN"}
        </span>
      </div>

      {/* Items Table */}
      <div className="p-4 md:p-5">
        <h3 className="font-medium text-gray-800 mb-3 text-sm md:text-base">
          Ordered Items
        </h3>

        {/* Table Header (desktop only) */}
        <div className="hidden md:grid grid-cols-12 gap-3 text-gray-700 text-sm font-medium border-b pb-2">
          <div className="col-span-6">Product</div>
          <div className="col-span-3 text-center">Qty</div>
          <div className="col-span-3 text-right">Price</div>
        </div>

        {/* Items */}
        {order.items?.map((item, idx) => (
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
          Total: ${order.totalAmount || 0}
        </div>
      </div>

      {/* Admin Notes & Actions */}
      <div className="p-4 md:p-5 flex flex-col md:flex-row md:justify-between gap-4 md:items-center border-t">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full md:w-2/3 border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200 resize-none"
          placeholder="Add admin notes..."
          rows={2}
        />
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
          <button
            onClick={() => onAction("approved", notes)}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm md:text-base"
          >
            <CheckCircle size={18} /> Approve
          </button>
          <button
            onClick={() => onAction("rejected", notes)}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm md:text-base"
          >
            <XCircle size={18} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
