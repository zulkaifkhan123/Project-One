"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Store,
  Tag,
  Boxes,
  Package,
  Menu,
  X,
} from "lucide-react";

const fetchProducts = async () => {
  const res = await axios.get("/api/product");
  const response = res.data;
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productsPerPage = 9;
  const router = useRouter();

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const brands = [
    ...new Set(products.map((p) => p.brand?.brandName).filter(Boolean)),
  ];

  let filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const matchesSearch = product.productName
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const matchesBrand =
          selectedBrands.length === 0 ||
          selectedBrands.includes(product.brand?.brandName);
        const matchesAvailability =
          availability === ""
            ? true
            : availability === "in"
            ? product.productQuantity > 0
            : product.productQuantity === 0;
        return matchesSearch && matchesBrand && matchesAvailability;
      })
    : [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.productPrice - b.productPrice;
    if (sortBy === "Price: High to Low") return b.productPrice - a.productPrice;
    if (sortBy === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Search</h3>
        <div className="flex items-center px-3 py-2 border rounded-lg">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none text-sm"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Brands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {brands.length === 0 ? (
            <li className="text-gray-400 text-xs">No brands available</li>
          ) : (
            brands.map((brand) => (
              <li key={brand}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  {brand}
                </label>
              </li>
            ))
          )}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Availability</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === "in"}
                onChange={() => setAvailability("in")}
              />
              In Stock
            </label>
          </li>
          <li>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === "out"}
                onChange={() => setAvailability("out")}
              />
              Out of Stock
            </label>
          </li>
          <li>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === ""}
                onChange={() => setAvailability("")}
              />
              All
            </label>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Sort By</h3>
        <div className="flex items-center px-3 py-2 border rounded-lg">
          <SlidersHorizontal className="mr-2 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-sm"
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => {
          setSearch("");
          setSortBy("Newest");
          setSelectedBrands([]);
          setAvailability("");
          setCurrentPage(1);
        }}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mt-10 mb-14 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
          Discover Our Premium Products
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
          We bring you a carefully selected range of high-quality products
          designed to meet your needs.
        </p>
      </div>

      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-lg"
        >
          <Menu size={18} /> Filters
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-1/4 shadow-md rounded-xl p-5 h-full">
          <FiltersContent />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className={`w-72 bg-white h-full shadow-lg p-5 transform transition-transform duration-500 ${
                mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <button
                className="flex items-center gap-2 text-gray-600 mb-4"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X size={20} /> Close
              </button>
              <FiltersContent />
            </div>
          </div>
        )}

        <section className="w-full md:w-3/4">
          {isLoading && (
            <p className="text-center text-gray-500">Loading products...</p>
          )}
          {isError && (
            <p className="text-center text-red-500">
              Failed to load products. Try again later.
            </p>
          )}

          {!isLoading && !isError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    onClick={() =>
                      router.replace(
                        `/products/${decodeURIComponent(product.slug)}`
                      )
                    }
                    key={product._id}
                    className="rounded-xl hover:shadow-lg transition cursor-pointer overflow-hidden group bg-white"
                  >
                    {product.productImage?.length > 0 && (
                      <Image
                        src={product.productImage[0]}
                        alt={product.productName}
                        width={400}
                        height={300}
                        priority
                        className="object-contain w-full h-45 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-4 space-y-3">
                      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                        <Package size={16} className="text-indigo-600" />
                        {product.productName}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.productDescription}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 gap-1">
                        <Store size={14} className="text-gray-400" />
                        {product.brand?.brandName || "Unknown Brand"}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t text-sm">
                        <span className="flex items-center gap-1 font-semibold text-gray-800">
                          <Tag size={14} className="text-indigo-600" /> $
                          {product.productPrice}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Boxes size={14} className="text-gray-400" />{" "}
                          {product.productQuantity} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {sortedProducts.length === 0 && (
                  <p className="text-gray-400 col-span-full text-center">
                    No products found.
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    {"<"}
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    {">"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
