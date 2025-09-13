"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const router = useRouter();
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
        {/* Logo */}
        <h1 className="text-black text-2xl font-bold">Wholesale Store</h1>

        {/* Desktop Menu */}
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
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="font-medium text-gray-500 hover:text-gray-900"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-medium cursor-pointer text-gray-500 hover:text-gray-900"
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-3"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar + Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-[64px] h-[calc(100%-64px)] w-3/4 sm:w-1/2 
                      bg-gray-900 shadow-xl p-6 flex flex-col transform transition-transform duration-300 
                      ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Close Button */}
          <button
            className="self-end mb-6 text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={28} />
          </button>

          {/* Nav Links */}
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)} // close on click
                className={`block font-medium text-lg px-2 py-2 rounded transition-colors ${
                  isActive(link.href)
                    ? "text-white bg-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
