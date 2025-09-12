"use client";

import { useState } from "react";
import { CheckCircle, XCircle, X, Download } from "lucide-react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AccountApproval() {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingUsers"],
    queryFn: async () => {
      const res = await axios.get("/api/pendingUsers");
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch users");
      }
      return res.data.data;
    },
  });

  // ✅ Single mutation for approve/suspend (PUT request with status)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }) => {
      const res = await axios.put("/api/changeStatus", { userId, status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["changeStatus"]); // refresh list
    },
  });

  const [modal, setModal] = useState({
    isOpen: false,
    userId: null,
    action: "",
  });

  const confirmAction = (userId, action) =>
    setModal({ isOpen: true, userId, action });

  const handleConfirm = () => {
    updateStatusMutation.mutate({
      userId: modal.userId,
      status: modal.action,
    });
    setModal({ isOpen: false, userId: null, action: "" });
  };

  const handleCancel = () =>
    setModal({ isOpen: false, userId: null, action: "" });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    suspended: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-0 min-h-30">
      {/* Main heading */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">
          User Account Approvals
        </h1>
        <p className="text-gray-600 mt-2">
          Review newly registered users and approve or suspend their accounts.
        </p>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading users...</p>
      // ) : isError ? (
      //   <p className="text-red-500 text-center">Error fetching users.</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center">No users pending approval.</p>
      ) : (
        <div className="space-y-4 flex flex-col items-center">
          {users.map((user) => (
            <div
              key={user._id}
              className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {user.business_name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${statusColors[user.account_status]}`}
                >
                  {user.account_status.toUpperCase()}
                </span>
              </div>

              {/* User Details */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
                <p>
                  <span className="font-medium text-gray-600">Email:</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Email-Verified:
                  </span>{" "}
                  {user.isVerified ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Phone:</span>{" "}
                  {user.phone_number}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Website:</span>
                  <a
                    href={user.website}
                    target="_blank"
                    className="text-blue-600 underline ml-1"
                  >
                    {user.website}
                  </a>
                </p>
                <p>
                  <span className="font-medium text-gray-600">Billing:</span>{" "}
                  {user.billing_address}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Shipping:</span>{" "}
                  {user.shipping_address}
                </p>

                {/* Business files */}
                <div className="col-span-2 flex gap-4 mt-2">
                  {user.tax_id && (
                    <a
                      href={user.tax_id}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-1 text-blue-600 underline"
                    >
                      Tax ID <Download size={16} />
                    </a>
                  )}
                  {user.business_licence && (
                    <a
                      href={user.business_licence}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 underline"
                    >
                      Business Licence <Download size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex gap-3 justify-end border-t border-gray-200">
                <button
                  onClick={() => confirmAction(user._id, "approved")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => confirmAction(user._id, "suspended")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                >
                  <XCircle size={16} /> Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-96">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm{" "}
                {modal.action.charAt(0).toUpperCase() + modal.action.slice(1)}
              </h3>
              <button onClick={handleCancel}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="mb-4 text-gray-700">
              Are you sure you want to {modal.action} this user account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white text-sm transition ${
                  modal.action === "approved"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {modal.action.charAt(0).toUpperCase() + modal.action.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
