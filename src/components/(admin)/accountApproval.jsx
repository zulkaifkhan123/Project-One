"use client";

import { CheckCircle, XCircle, Download } from "lucide-react";
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

  // ✅ Single mutation for approve/suspend (directly updates status)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }) => {
      const res = await axios.put("/api/changeStatus", { userId, status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingUsers"]); // refresh list
    },
  });

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
      ) : isError ? (
        <p className="text-red-500 text-center">Error fetching users.</p>
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
              <div className="p-3 flex justify-between items-center border-b border-gray-200">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm p-3">
                <p>
                  <span className="font-medium text-gray-600"><b>Email : </b></span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    <b>Email Verified : </b>
                  </span>{" "}
                  {user.isVerified ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-medium text-gray-600"><b>Phone : </b></span>{" "}
                  {user.phone_number}
                </p>
                <p>
                  <span className="font-medium text-gray-600"><b>Website : </b></span>{" "}
                  {user.website ? (
                  <a
                    href={user.website}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {user.website}
                  </a>

                  ) : (
                    "N/A"
                  )}
                </p>
                <p className="md:col-span-2">
                  <span className="font-medium text-gray-600"><b>Billing Address : </b></span>{" "}
                  {user.billing_address}
                </p>
                <p className="md:col-span-2">
                  <span className="font-medium text-gray-600"><b>Shipping Address : </b></span>{" "}
                  {user.shipping_address}
                </p>

                {/* Business files */}
                <div className="md:col-span-2 flex flex-wrap gap-4 mt-1">
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
              <div className="p-3 flex gap-3 justify-end border-t border-gray-200">
                <button
                  onClick={() =>
                    updateStatusMutation.mutate({
                      userId: user._id,
                      status: "approved",
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() =>
                    updateStatusMutation.mutate({
                      userId: user._id,
                      status: "suspended",
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                >
                  <XCircle size={16} /> Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
