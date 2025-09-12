"use client";

import { useState } from "react";
import { UserCheck, Mail , Users , Building2, Banknote , Package, ClipboardList  } from "lucide-react";
import BrandForm from "./brand";
import AccountApproval from "./accountApproval";
import AddProductForm from "./product";
import UsersTable from "./seeAllUsers";
import PaidReceipts from "./transcations";
import OrderApproval from "./order-approvals"
import AdminEmailSender from "./send-email";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("approval");

  const renderPage = () => {
    switch (activePage) {
      case "approval":
        return <div className="p-8 bg-white rounded-lg shadow-sm">
          <AccountApproval />
        </div>;
      case "brand":
        return <div className="p-8 bg-white rounded-lg shadow-sm">
          <BrandForm />
        </div>;
      case "product":
        return <div className="p-8 bg-white rounded-lg shadow-sm">
          <AddProductForm />
        </div>;
      case "Users":
        return <div className="p-8 bg-white rounded-lg shadow-sm">
          <UsersTable />
        </div>;
      case "transactions":
        return <div className="p-8 bg-white rounded-lg shadow-sm">
          <PaidReceipts />
        </div>;
      case "order":
        return <div className="p-8 bg-white rounded-lg shadow-sm">
          <OrderApproval />
        </div>;
      case "Send-Email":
        return <div className="p-8 bg-white rounded-lg shadow-sm">
          <AdminEmailSender />
        </div>;
      default:
        return <div className="p-8 bg-white rounded-lg shadow-sm">Welcome Admin</div>;
    }
  };

  const menuItems = [
    { key: "approval", label: "Account Approval", icon: <UserCheck size={18} /> },
    { key: "order", label: "Order Approval", icon: <ClipboardList size={18} /> },
    { key: "transactions", label: "Order-Transactions", icon: <Banknote size={18} /> },
    { key: "Send-Email", label: "Send Emails", icon: <Mail size={18} /> },
    { key: "brand", label: "Brand Management", icon: <Building2 size={18} /> },
    { key: "product", label: "Product Management", icon: <Package size={18} /> },
    { key: "Users", label: "Users", icon: <Users size={18} /> },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-white h-140 flex flex-col">
        <div className="p-6 pl-8">
          <h2 className="font-bold text-xl">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your platform</p>
        </div>

        <ul className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                activePage === item.key
                  ? "bg-gray-100 black "
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

      </aside>

      
      <main className="flex-1 p-14">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {menuItems.find((m) => m.key === activePage)?.label}
          </h1>
          <p className="text-gray-500 mt-1">
            Here you can manage {activePage}.
            Easily manage and update your store by adding and editing {activePage}. This section helps keep your platform organized and ensures customers always have access to the latest information.
          </p>
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
