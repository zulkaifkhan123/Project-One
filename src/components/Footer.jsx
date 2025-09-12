"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 rounded-t-2xl bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-lg text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: About */}
        <section aria-labelledby="footer-about">
          <h3
            id="footer-about"
            className="text-lg font-semibold text-black border-b-2 border-yellow-400 inline-block pb-1 mb-4"
          >
            About Us
          </h3>
          <p className="text-sm leading-6">
            We are a modern wholesale platform where dealers can buy
            products for their shops at the best prices. Quality, trust,
            and fast delivery are our top priorities.
          </p>
        </section>

        {/* Column 2: Quick Links */}
        <nav aria-labelledby="footer-quick-links">
          <h3
            id="footer-quick-links"
            className="text-lg font-semibold text-black border-b-2 border-yellow-400 inline-block pb-1 mb-4"
          >
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-sm hover:text-yellow-600 transition">Home</Link></li>
            <li><Link href="/products" className="text-sm hover:text-yellow-600 transition">Products</Link></li>
            <li><Link href="/brands" className="text-sm hover:text-yellow-600 transition">Brands</Link></li>
            <li><Link href="/contact" className="text-sm hover:text-yellow-600 transition">Contact</Link></li>
            <li><Link href="/cart" className="text-sm hover:text-yellow-600 transition">Cart</Link></li>
          </ul>
        </nav>

        {/* Column 3: Customer Service */}
        <nav aria-labelledby="footer-customer-service">
          <h3
            id="footer-customer-service"
            className="text-lg font-semibold text-black border-b-2 border-yellow-400 inline-block pb-1 mb-4"
          >
            Customer Service
          </h3>
          <ul className="space-y-2">
            <li><Link href="/faq" className="text-sm hover:text-yellow-600 transition">FAQ</Link></li>
            <li><Link href="/about" className="text-sm hover:text-yellow-600 transition">About</Link></li>
            <li><Link href="/orders" className="text-sm hover:text-yellow-600 transition">Order Tracking</Link></li>
            <li><Link href="/privacy-policy" className="text-sm hover:text-yellow-600 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-sm hover:text-yellow-600 transition">Terms & Conditions</Link></li>
          </ul>
        </nav>

        {/* Column 4: Social Media */}
        <section aria-labelledby="footer-social">
          <h3
            id="footer-social"
            className="text-lg font-semibold text-black border-b-2 border-yellow-400 inline-block pb-1 mb-4"
          >
            Follow Us
          </h3>
          <ul className="flex gap-4 mt-2">
            <li>
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-yellow-500 hover:text-white transition"
              >
                <Facebook size={20} />
              </Link>
            </li>
            <li>
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-yellow-500 hover:text-white transition"
              >
                <Instagram size={20} />
              </Link>
            </li>
            <li>
              <Link
                href="https://twitter.com"
                aria-label="Twitter"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-yellow-500 hover:text-white transition"
              >
                <Twitter size={20} />
              </Link>
            </li>
            <li>
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-yellow-500 hover:text-white transition"
              >
                <Linkedin size={20} />
              </Link>
            </li>
          </ul>
        </section>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-300 mt-10 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Wholesale Platform. All rights reserved.
      </div>
    </footer>
  );
}
