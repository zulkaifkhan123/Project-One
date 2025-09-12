"use client";

import { useSession, signOut } from "next-auth/react";
import { User, Mail, Phone, Globe, MapPin, Building2 } from "lucide-react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  // if (status === "loading") return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (!session) return <p className="text-center py-10 text-red-500">You are not logged in.</p>;

  const user = session.user;

  return (
    <div className=" bg-gray-100 flex justify-center items-start pt-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-8 text-white flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl font-bold uppercase">
            {user.username?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-sm opacity-80">{user.email}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Personal Info</h2>

            <div className="flex items-center gap-3">
              <User className="text-gray-500" />
              <span className="text-gray-600">{user.username}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" />
              <span className="text-gray-600">{user.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-gray-500" />
              <span className="text-gray-600">{user.phone_number || "Not Provided"}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-gray-500" />
              <span className="text-gray-600">{user.shipping_address || "Not Provided"}</span>
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Business Info</h2>

            <div className="flex items-center gap-3">
              <Building2 className="text-gray-500" />
              <span className="text-gray-600">{user.business_name || "Not Provided"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="text-gray-500" />
              <span className="text-gray-600">{user.website || "Not Provided"}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">
                Account Status:{" "}
                <span className={user.account_status === "approved" ? "text-green-600" : "text-red-600"}>
                  {user.account_status || "pending"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">
                Email Verified:{" "}
                <span className={user.isVerified ? "text-green-600" : "text-red-600"}>
                  {user.isVerified ? "Yes" : "No"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer / Sign Out */}
        <div className="p-6 border-t border-gray-200 text-center">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-2 rounded-lg bg-black cursor-pointer text-white font-semibold hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
