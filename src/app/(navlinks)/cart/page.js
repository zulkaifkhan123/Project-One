"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = session?.user?.id;
  const [orderId, setOrderId] = useState(null);

  // ✅ Fetch cart
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await axios.get(`/api/cart?userId=${userId}`);
      return res.data?.cart || { items: [] };
    },
    enabled: !!userId,
  });

  // ✅ Fetch existing order
  const { data: order, refetch: refetchOrder } = useQuery({
    queryKey: ["order", userId],
    queryFn: async () => {
      const res = await axios.get(`/api/order_Status_check?userId=${userId}`);
      setOrderId(res.data?.data?._id || null);
      return res.data?.data || null;
    },
    enabled: !!userId,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      await axios.delete(`/api/cart?userId=${userId}&productId=${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", userId]);
    },
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      const items = cart.items.map((item) => ({
        products: item.product?._id,
        quantity: Number(item.quantity),
      }));

      const res = await axios.post("/api/Order", {
        user: userId,
        items,
        totalAmount: totalPrice,
        status: "pending",
        adminNotes: "",
      });

      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Order placed successfully!", {
        duration: 4000,
      });
      queryClient.invalidateQueries(["cart", userId]);
      refetchOrder();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to place order.");
    },
  });

  // ✅ Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `/api/Order?userId=${userId}&orderId=${orderId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Order cancelled successfully");
      queryClient.invalidateQueries(["orders", userId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  // ✅ Safe access with optional chaining
  const totalPrice =
    cart?.items?.reduce((total, item) => {
      const price = item.product?.productPrice || 0;
      return total + price * Number(item.quantity);
    }, 0) || 0;

  // -------------------- Conditional UI -------------------- //

  if (!session) {
    return (
      <p className="text-center mt-20">
        Please{" "}
        <Link className="text-blue-600 underline" href="/login">
          Login
        </Link>{" "}
        to see product details
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart items */}
      <div className="lg:col-span-2 space-y-6 w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Shopping Cart</h1>
        <div className="bg-white rounded-xl shadow-md divide-y">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 w-full"
            >
              <div className="w-full sm:w-40 h-40 relative flex-shrink-0">
                {item.product?.productImage?.[0] && (
                  <Image
                    src={item.product.productImage[0]}
                    alt={item.product?.productName || "Product"}
                    fill
                    className="object-contain rounded-lg"
                  />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.product?.productName || "Unnamed Product"}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.product?.productDescription ||
                    "No description available."}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-gray-800">
                    ${item.product?.productPrice?.toLocaleString() || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    Qty: {Number(item.quantity)}
                  </span>
                </div>
              </div>

              {!order && (
                <button
                  onClick={() => removeMutation.mutate(item.product?._id)}
                  className="text-red-500 hover:text-red-700 transition flex items-center sm:self-start"
                >
                  <Trash2 size={20} className="mr-1" /> Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6 w-full">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-20">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between text-gray-700 text-base mb-2">
            <span>Total Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div>
            <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-3">
              <span>Total Price</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>

            {order?.status === "approved" ? (
              <button
                className="mt-6 w-full text-gray-900 font-semibold py-3 rounded-lg shadow transition bg-yellow-500 hover:bg-yellow-600"
                onClick={() => router.push("/checkout")}
              >
                Checkout
              </button>
            ) : (
              <button
                disabled={
                  !!order || totalPrice < 1000 || orderMutation.isLoading
                }
                onClick={() => orderMutation.mutate()}
                className={`mt-6 w-full font-semibold py-3 rounded-lg shadow transition ${
                  !order && totalPrice >= 1000
                    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    : "bg-gray-300 cursor-not-allowed text-gray-700"
                }`}
                title={
                  order
                    ? "You already have an active order"
                    : totalPrice < 1000
                      ? "Minimum total $1000 required"
                      : ""
                }
              >
                {orderMutation.isLoading ? "Placing Order..." : "Place Order"}
              </button>
            )}

            <p className="mt-3 text-xs text-gray-600 leading-5">
              {order
                ? "You already have placed Order. Wait for admin approval."
                : totalPrice < 1000
                  ? "Minimum total $1000 required!"
                  : ""}
              <br />
              <strong>Note:</strong> Your order will only be processed after
              admin approval. Approval may take up to 24 hours.
            </p>
          </div>

          {/* Order Status */}
          <div className="rounded-xl mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Status
            </h2>

            {order ? (
              <>
                <p>
                  Status: <span className="font-semibold">{order.status}</span>
                </p>

                {order.adminNotes && (
                  <p className="mt-2 text-green-600 font-semibold">
                    {order.adminNotes}
                  </p>
                )}
                <button
                  className="mt-6 w-full text-white font-semibold py-3 rounded-lg shadow transition bg-red-500 hover:bg-red-600"
                  onClick={() => cancelOrderMutation.mutate()}
                  disabled={cancelOrderMutation.isPending}
                >
                  {cancelOrderMutation.isPending
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              </>
            ) : (
              <p className="text-gray-500">No active order.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
