"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Clock,
  RotateCw,
  CheckCircle,
  Send,
  MessageCircle,
  Sparkles,
  Inbox,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getMessages, markMessageRead, saveMessages } from "@/lib/adminMessages";
import { CustomerMessage } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminMessagesPage() {
  const router = useRouter();
  const { adminUser } = useAdminAuth();

  // Load from shared store (populated after mount)
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [filter, setFilter] = useState<"All" | "Unread" | "Read" | "Replied">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // On mount: load messages from shared localStorage store
  useEffect(() => {
    const loaded = getMessages();
    setMessages(loaded);
    setSelectedMessageId(loaded[0]?.id || "");
  }, []);

  useEffect(() => {
    if (!adminUser) {
      router.push("/admin/login");
    }
  }, [adminUser, router]);

  if (!adminUser) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const reloaded = getMessages();
      setMessages(reloaded);
      setIsRefreshing(false);
    }, 400);
  };

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (filter === "Unread" && m.status !== "unread") return false;
    if (filter === "Read" && m.status !== "read") return false;
    if (filter === "Replied" && m.status !== "replied") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      if (!matchName && !matchSubject && !matchEmail && !matchMsg) return false;
    }
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  const handleSelectMessage = (msg: CustomerMessage) => {
    setSelectedMessageId(msg.id);
    setReplySuccess("");
    setIsMobileDetailOpen(true);
    // If unread, mark as read — persists to shared store
    if (msg.status === "unread") {
      const updated = markMessageRead(msg.id);
      setMessages(updated);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setIsSendingReply(true);

    setTimeout(() => {
      const updated = messages.map((m) =>
        m.id === selectedMessage.id
          ? { ...m, status: "replied" as const, replyText: replyText.trim(), repliedAt: new Date().toISOString() }
          : m
      );
      saveMessages(updated); // persist to shared store
      setMessages(updated);
      setIsSendingReply(false);
      setReplySuccess(`Email reply dispatched to ${selectedMessage.email}!`);
      setReplyText("");
    }, 700);
  };

  const handleToggleStatus = (id: string, newStatus: "unread" | "read") => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m));
    saveMessages(updated); // persist to shared store
    setMessages(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      {/* Top Admin Header with Role Switcher */}
      <AdminHeader />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <AdminSidebar />

        {/* Messages Content Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-61px)]">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                CUSTOMER MESSAGES
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time inbox for customer inquiries and Contact Us submissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Sync Active Pill */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>LIVE SYNC ACTIVE</span>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-miki-pink" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* 2-Column Messages Inbox & Viewer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: Inbox List & Filter Tabs */}
            <div className={`lg:col-span-5 p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4 ${isMobileDetailOpen ? "hidden lg:block" : "block"}`}>
              {/* Inbox Header & Unread Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-900">Inbox ({messages.length})</h2>
                </div>

                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {unreadCount} Unread
                  </span>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Filter Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-center">
                {(["All", "Unread", "Read", "Replied"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilter(tab)}
                    className={`py-1.5 rounded-lg transition-colors cursor-pointer text-[11px] ${
                      filter === tab
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60 font-black"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Message List Items */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No messages found.
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isSelected = msg.id === selectedMessage?.id;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "bg-rose-50/50 border-rose-200 shadow-xs"
                            : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                            {msg.name}
                          </h4>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              msg.status === "unread"
                                ? "bg-slate-900 text-white shadow-xs"
                                : msg.status === "replied"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {msg.subject}
                        </p>

                        <p className="text-[11px] text-slate-500 truncate">
                          {msg.message}
                        </p>

                        <p className="text-[10px] text-slate-400 pt-1">
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right 7 Cols: Message Content Viewer & Reply Box */}
            <div className={`lg:col-span-7 p-4 sm:p-6 lg:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6 ${!isMobileDetailOpen ? "hidden lg:block" : "block"}`}>
              {selectedMessage ? (
                <>
                  {/* Mobile Back to Inbox Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileDetailOpen(false)}
                    className="lg:hidden inline-flex items-center gap-1.5 text-xs font-bold text-miki-pink hover:text-miki-rose pb-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Inbox</span>
                  </button>

                  {/* Top Header of Selected Message */}
                  <div className="border-b border-slate-100 pb-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {selectedMessage.subject}
                        </h2>
                        <p className="text-xs text-slate-600 font-semibold mt-1">
                          From: {selectedMessage.name}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-[11px] text-slate-400">
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                        <span
                          className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            selectedMessage.status === "unread"
                              ? "bg-slate-900 text-white"
                              : selectedMessage.status === "replied"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {selectedMessage.status}
                        </span>
                      </div>
                    </div>

                    {/* Sender Contact Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-miki-pink" />
                        <span>{selectedMessage.email}</span>
                      </span>

                      {selectedMessage.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{selectedMessage.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer Message Body Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed min-h-[100px]">
                    {selectedMessage.message}
                  </div>

                  {/* Existing Reply if already replied */}
                  {selectedMessage.replyText && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-700">
                        <CheckCheck className="w-4 h-4" /> Sent Reply:
                      </p>
                      <p className="text-slate-700">{selectedMessage.replyText}</p>
                      {selectedMessage.repliedAt && (
                        <p className="text-[10px] text-slate-400 pt-1">
                          Sent on {formatDate(selectedMessage.repliedAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        SEND EMAIL REPLY TO {selectedMessage.email.toUpperCase()}
                      </label>

                      {selectedMessage.phone && (
                        <a
                          href={`https://wa.me/94${selectedMessage.phone.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Reply
                        </a>
                      )}
                    </div>

                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write your response to ${selectedMessage.name}...`}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink resize-none"
                    />

                    {replySuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{replySuccess}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleStatus(
                            selectedMessage.id,
                            selectedMessage.status === "read" ? "unread" : "read"
                          )
                        }
                        className="text-slate-400 hover:text-slate-700 text-xs font-semibold underline cursor-pointer"
                      >
                        Mark as {selectedMessage.status === "read" ? "Unread" : "Read"}
                      </button>

                      <button
                        type="submit"
                        disabled={isSendingReply || !replyText.trim()}
                        className="bg-miki-pink hover:bg-miki-rose disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSendingReply ? "Sending..." : "Send Email Reply"}</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-20 text-slate-400 text-xs">
                  Select a message from the left to view details and reply.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
