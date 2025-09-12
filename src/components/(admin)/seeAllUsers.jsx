"use client";

import { useState } from "react";
import { Users, Mail, Phone, Globe, MapPin } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function UsersList() {
  const [search, setSearch] = useState("");
  
  // ✅ Fetch users from API
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axios.get("/api/getAllUsers");
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch users");
      }
      return res.data.data; // should be array of users
    },
  });

  // ✅ Filter users by search term (ID, username, email, business_name, etc.)
  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      user._id?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.business_name?.toLowerCase().includes(term) ||
      user.phone_number?.toLowerCase().includes(term) ||
      user.billing_address?.toLowerCase().includes(term) ||
      user.shipping_address?.toLowerCase().includes(term) ||
      user.website?.toLowerCase().includes(term) ||
      user.account_status?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6">
      <div className="flex flex-col items-start mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-6 h-6 text-black" />
          <h2 className="text-xl font-bold">Users Management</h2>
        </div>
        <p className="text-gray-600">
          See all users in one place. View user details, track account status,
          and perform administrative actions such as suspension.
        </p>
      </div>

      {/* ✅ Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by ID, Name, Email, Business, Phone, etc."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* ✅ Loading & Error States */}
      {isLoading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : isError ? (
        <p className="text-red-500">Error fetching users.</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
                  <p>
                    <strong>User-ID:</strong> {user._id}
                  </p>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-black" /> {user.email}
                  </p>
                  <p>
                    <strong>Business:</strong> {user.business_name}
                  </p>
                  <p>
                    <strong>Email Verified :</strong>{" "}
                    {user.isVerified ? "Yes" : "No"}
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-black" />{" "}
                    {user.phone_number}
                  </p>
                  <p>
                    <strong>Tax ID:</strong>{" "}
                    <a
                      href={user.tax_id}
                      download
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      See_it_here
                    </a>
                  </p>
                  <p>
                    <strong>Licence:</strong>{" "}
                    <a
                      href={user.business_licence}
                      download
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      See_it_here
                    </a>
                  </p>
                  {user.website && (
                  <p className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-black" />{" "}
                    <a
                      href={user.website}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </p>
                  )}
                  {!user.website && (
                    <p className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-black" />{" "}
                    N/A
                  </p>
                  )}
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-black" />{" "}
                    {user.billing_address}
                  </p>
                  <p>
                    <strong>Shipping:</strong> {user.shipping_address}
                  </p>
                  <p>
                    <strong>Account-Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        user.account_status === "approved"
                          ? "bg-green-500"
                          : user.account_status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {user.account_status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
