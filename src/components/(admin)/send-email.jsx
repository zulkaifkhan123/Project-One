"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, User, FileText, Send } from "lucide-react";

export default function AdminEmailSender({ users }) {
  const [selectedUser, setSelectedUser] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendEmail(e) {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Please enter both subject and message.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/Emails", {
        userId: selectedUser,
        subject,
        message,
      });

      if (res.status === 200) {
        toast.success("Email sent successfully!");
        setSubject("");
        setMessage("");
        setSelectedUser("all");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error(
        err.response?.data?.error || "Failed to send email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-8">
        <Mail className="w-7 h-7 text-black" />
        <h2 className="text-2xl font-bold text-gray-900">Send Email</h2>
      </div>

      <form onSubmit={handleSendEmail} className="space-y-6">
        {/* Subject + Recipient Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipient */}
          <div>
            <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              Recipient
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
            >
              <option value="all">All Users</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter email subject"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 text-gray-600" />
            Message
          </label>
          <textarea
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="Write your message..."
          ></textarea>
        </div>

        {/* Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-xl shadow hover:bg-gray-800 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
