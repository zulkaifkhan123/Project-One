"use client";

import { useSession } from "next-auth/react";
import UserProfile from "../../../components/userprofile";
import AdminDashboard from "../../../components/(admin)/adminDasboard";

const ADMIN_EMAIL = "zulkaifkhan183@gmail.com";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user?.email) {
    return <div>No session found</div>;
  }

  const isAdmin = session.user.email === ADMIN_EMAIL;

  return isAdmin ? <AdminDashboard /> : <UserProfile />;
}
