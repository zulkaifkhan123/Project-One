"use client";

import React, { useState, useRef } from "react";
import { Info, Shield, FileText, Mail , FileQuestionMark } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { data: session } = useSession();
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false); // changed from brands
  const closeTimeout = useRef(null);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const companyLinks = [
    { href: "/about", icon: <Info />, title: "About", desc: "Who we are" },
    { href: "/faq", icon: <FileQuestionMark />, title: "FAQ", desc: "Have some questions" },
    { href: "/terms", icon: <FileText />, title: "Terms & Conditions", desc: "Our agreement" },
    { href: "/contact", icon: <Mail />, title: "Contact", desc: "Get in touch" },
  ];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/brands", label: "Brands" },
    { href: "/products", label: "Products" },
    { href: "/company", label: "Company" },
    { href: "/cart", label: "Cart" },
  ];

  const handleMouseEnter = (menu) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    if (menu === "company") setIsCompanyOpen(true);
    if (menu === "products") setIsProductsOpen(true);
  };

  const handleMouseLeave = (menu) => {
    closeTimeout.current = setTimeout(() => {
      if (menu === "company") setIsCompanyOpen(false);
      if (menu === "products") setIsProductsOpen(false);
    }, 200);
  };

  return (
    <div>
      <nav id="navbar" className="p-4 shadow-sm bg-white/80 bg-opacity-20 backdrop-blur-md relative z-50">

        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-black text-2xl font-bold">Wholesale Store</h1>

          {/* Navigation Menu */}
          <div className="space-x-6 flex items-center relative">
            {navLinks.map((link) =>
              link.label === "Company" ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("company")}
                  onMouseLeave={() => handleMouseLeave("company")}
                >
                  <button
                    className={`font-medium cursor-pointer transition-colors duration-200 ${
                      pathname.startsWith("/about") ||
                      pathname.startsWith("/privacy-policy") ||
                      pathname.startsWith("/terms") ||
                      pathname.startsWith("/contact")
                        ? "text-gray-900"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    Company
                  </button>

                  {isCompanyOpen && (
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
                      onMouseEnter={() => handleMouseEnter("company")}
                      onMouseLeave={() => handleMouseLeave("company")}
                    >
                      {companyLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition"
                        >
                          <span className="text-lg">{link.icon}</span>
                          <div>
                            <div className="font-medium">{link.title}</div>
                            <div className="text-sm text-gray-500">{link.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(link.href) ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  {"Profile" || session.user.username }
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
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
