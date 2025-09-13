"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const pathname = usePathname() || "/";
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/brands", label: "Brands" },
    { href: "/products", label: "Products" },
    { href: "/company", label: "Company" },
    { href: "/cart", label: "Cart" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="p-4 shadow-sm bg-white relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-black text-2xl font-bold">Wholesale Store</h1>

        <button
          className="md:hidden ml-3"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>

        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="font-semibold text-black hover:text-gray-900"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-semibold cursor-pointer text-black hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-[64px] right-0 h-full w-72 bg-white text-black shadow-lg z-40 transform transition-transform duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-6">
          <button
            className="self-end mb-4"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={28} />
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`block font-medium text-lg md:text-xl lg:text-2xl ${
                isActive(link.href)
                  ? "text-black font-semibold"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setIsSidebarOpen(false)}
                className="block font-semibold text-lg md:text-xl lg:text-2xl text-black hover:text-gray-900 bg-gray-100 px-3 py-2 rounded"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsSidebarOpen(false);
                }}
                className="block text-left font-semibold text-lg md:text-xl lg:text-2xl text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsSidebarOpen(false)}
                className="block font-medium text-lg md:text-xl lg:text-2xl text-gray-700 hover:text-black"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsSidebarOpen(false)}
                className="block font-medium text-lg md:text-xl lg:text-2xl text-gray-700 hover:text-black"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
