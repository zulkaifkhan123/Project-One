"use client";

import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { data: session } = useSession();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [hoverCompany, setHoverCompany] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const companyLinks = [
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About Us" },
    { href: "/terms", label: "Terms&Conditions" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="p-4 shadow-sm bg-white relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center">
          <h1 className="text-black cursor-pointer text-2xl font-bold"
          onClick={() => router.push("/")}
          >Wholesale Store</h1>
        </div>

        {/* Center Section (Desktop) */}
        <div className="hidden md:flex space-x-6 items-center relative">
          <Link
            href="/"
            className={`font-medium transition-colors ${
              isActive("/") ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Home
          </Link>

          <Link
            href="/products"
            className={`font-medium transition-colors ${
              isActive("/products") ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/brands"
            className={`font-medium transition-colors ${
              isActive("/brands") ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Brands
          </Link>

          {/* Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (hoverTimeout) clearTimeout(hoverTimeout);
              setHoverCompany(true);
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => setHoverCompany(false), 200);
              setHoverTimeout(timeout);
            }}
          >
            <span
              className={`cursor-pointer font-medium flex items-center gap-1 ${
                isActive("/company") ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Company
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  hoverCompany ? "rotate-180" : ""
                }`}
              />
            </span>
            {hoverCompany && (
              <div className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-44 py-2 transition-opacity duration-200">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/cart"
            className={`font-medium transition-colors ${
              isActive("/cart") ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Cart
          </Link>
        </div>

        {/* Right Section (Desktop) */}
        <div className="hidden md:flex space-x-6 items-center">
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-3"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Sidebar */}
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

          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`block font-medium text-lg ${
              isActive("/") ? "text-black font-semibold" : "text-gray-700 hover:text-black"
            }`}
          >
            Home
          </Link>

          <Link
            href="/products"
            onClick={() => setIsSidebarOpen(false)}
            className={`block font-medium text-lg ${
              isActive("/products")
                ? "text-black font-semibold"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Products
          </Link>

          {/* Company Dropdown in Mobile */}
          <div>
            <button
              onClick={() => setIsCompanyOpen(!isCompanyOpen)}
              className={`w-full flex justify-between items-center font-semibold text-lg py-2 ${
                isActive("/company")
                  ? "text-black"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              Company
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isCompanyOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isCompanyOpen && (
              <div className="ml-4 mt-2 space-y-3">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block font-medium text-base tracking-wide text-gray-700 hover:text-black"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/cart"
            onClick={() => setIsSidebarOpen(false)}
            className={`block font-medium text-lg ${
              isActive("/cart")
                ? "text-black font-semibold"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Cart
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setIsSidebarOpen(false)}
                className="block font-semibold text-lg text-black hover:text-gray-900 bg-gray-100 px-3 py-2 rounded"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsSidebarOpen(false);
                }}
                className="block text-left font-semibold text-lg text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsSidebarOpen(false)}
                className="block font-medium text-lg text-gray-700 hover:text-black"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsSidebarOpen(false)}
                className="block font-medium text-lg text-gray-700 hover:text-black"
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
