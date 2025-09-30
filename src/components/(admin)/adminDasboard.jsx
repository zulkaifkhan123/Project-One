"use client";

import { useState } from "react";
import {
  Menu,
  X,
  UserCheck,
  Users,
  Building2,
  Banknote,
  Package,
  ClipboardList,
} from "lucide-react";

import BrandForm from "./brand";
import AccountApproval from "./accountApproval";
import AddProductForm from "./product";
import UsersTable from "./seeAllUsers";
import PaidReceipts from "./transcations";
import OrderApproval from "./order-approvals";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("approval");
  const [isOpen, setIsOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "approval":
        return (
          <div className="bg-white rounded-lg mt-6">
            <AccountApproval />
          </div>
        );
      case "brand":
        return (
          <div className="bg-white rounded-lg mt-6">
            <BrandForm />
          </div>
        );
      case "product":
        return (
          <div className="bg-white rounded-lg mt-6">
            <AddProductForm />
          </div>
        );
      case "Users":
        return (
          <div className="bg-white rounded-lg mt-6">
            <UsersTable />
          </div>
        );
      case "transactions":
        return (
          <div className="bg-white rounded-lg mt-6">
            <PaidReceipts />
          </div>
        );
      case "order":
        return (
          <div className="bg-white rounded-lg mt-6">
            <OrderApproval />
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg mt-6">
            Welcome Admin
          </div>
        );
    }
  };

  const menuItems = [
    { key: "approval", label: "Account Approval", icon: <UserCheck size={18} /> },
    { key: "order", label: "Order Approval", icon: <ClipboardList size={18} /> },
    { key: "transactions", label: "Order-Transactions", icon: <Banknote size={18} /> },
    { key: "brand", label: "Brand Management", icon: <Building2 size={18} /> },
    { key: "product", label: "Product Management", icon: <Package size={18} /> },
    { key: "Users", label: "Users", icon: <Users size={18} /> },
  ];

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-white z-40 transform transition-transform duration-500
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex justify-between items-center p-6">
          <h2 className="font-bold text-lg md:text-xl">Admin Dashboard</h2>
        </div>

        <ul className="p-4 space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.key}
              onClick={() => {
                setActivePage(item.key);
                setIsOpen(false); // close on mobile after click
              }}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                activePage === item.key
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-14">
        {/* Menu button always visible on mobile */}
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <button
            className="md:hidden p-2 bg-gray-100 rounded-lg shadow"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {menuItems.find((m) => m.key === activePage)?.label}
          </h1>
        </div>

        <p className="text-gray-500 mt-1 text-sm md:text-base">
          Here you can manage {activePage}. Easily manage and update your store by adding and editing {activePage}.
          This section helps keep your platform organized and ensures customers always have access to the latest information.
        </p>

        {renderPage()}
      </main>
    </div>
  );
}
