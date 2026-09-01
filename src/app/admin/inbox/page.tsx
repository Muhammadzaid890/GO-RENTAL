"use client";

import { useState, useEffect } from "react";
import {
  getAllMessages,
  approvePurchaseMessage,
  rejectPurchaseMessage,
  deleteMessage,
} from "@/actions/admin";
import {
  Inbox,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Trash2,
  CheckCircle2,
  XCircle,
  Coins,
  Sparkles,
  Clock,
  Filter,
  AlertCircle,
  UserCheck,
} from "lucide-react";

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    const res = await getAllMessages();
    if (res.success && res.data) {
      setMessages(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Approve Handler
  const handleApprove = async (id: string, userName: string) => {
    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await approvePurchaseMessage(id);
    if (res.success) {
      setSuccessMsg(`APPROVED REQUEST & CREDITS ADDED FOR ${userName}!`);
      setMessages((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "PROCESSED" } : item
        )
      );
    } else {
      setErrorMsg(res.error || "COULD NOT APPROVE REQUEST.");
    }
    setActionLoadingId(null);
  };

  // 2. Reject Handler
  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await rejectPurchaseMessage(id);
    if (res.success) {
      setSuccessMsg("REQUEST MARKED AS REJECTED.");
      setMessages((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "REJECTED" } : item
        )
      );
    } else {
      setErrorMsg(res.error || "FAILED TO REJECT.");
    }
    setActionLoadingId(null);
  };

  // 3. Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("ARE YOU SURE YOU WANT TO PERMANENTLY DELETE THIS MESSAGE?")) {
      return;
    }

    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await deleteMessage(id);
    if (res.success) {
      setSuccessMsg("MESSAGE DELETED.");
      setMessages((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMsg(res.error || "FAILED TO DELETE.");
    }
    setActionLoadingId(null);
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      (msg.user?.name && msg.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (msg.user?.email && msg.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (msg.user?.phone && msg.user.phone.includes(searchQuery)) ||
      msg.bundleName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = messages.filter((m) => m.status === "PENDING").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              PURCHASE REQUESTS & INBOX
            </h1>
            <span className="px-2.5 py-0.5 bg-stone-200 text-stone-700 text-xs font-black rounded-lg">
              {messages.length} TOTAL
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400">
            REVIEW AGENT PACKAGE PURCHASES, AUTO-DISPATCH CREDITS & CONTACT LEADS
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase text-amber-800">
              {pendingCount} PENDING REQUESTS
            </span>
          </div>
        )}
      </div>

      {/* Status Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-[#E53935] text-xs font-black uppercase rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            placeholder="SEARCH BY AGENT NAME, EMAIL, PHONE, OR BUNDLE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-black uppercase outline-none focus:border-[#657A68] appearance-none cursor-pointer"
          >
            <option value="ALL">ALL REQUESTS</option>
            <option value="PENDING">PENDING ONLY</option>
            <option value="PROCESSED">PROCESSED / APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <Filter className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Messages List View */}
      {loading ? (
        <div className="p-16 text-center text-xs font-black uppercase text-stone-400">
          LOADING INBOX MESSAGES...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
          <Inbox className="w-10 h-10 text-stone-300 mx-auto" />
          <div className="text-sm font-black uppercase text-[#1A1F1C]">
            NO PURCHASE REQUESTS FOUND
          </div>
          <p className="text-xs font-bold uppercase text-stone-400">
            NEW AGENT PACKAGE ORDERS WILL APPEAR HERE AUTOMATICALLY.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => {
            const isItemLoading = actionLoadingId === msg.id;
            const formattedPhone = msg.user?.phone
              ? msg.user.phone.replace(/^0/, "92").replace(/\D/g, "")
              : "";
            const whatsappMsg = encodeURIComponent(
              `Assalam o Alaikum ${msg.user?.name || "Agent"}, regarding your purchase request for "${msg.bundleName}" on GO RENTAL DHA.`
            );

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-2xs space-y-4 transition-all ${
                  msg.status === "PENDING"
                    ? "border-amber-300 bg-amber-50/15"
                    : msg.status === "PROCESSED"
                    ? "border-emerald-300 bg-emerald-50/10"
                    : "border-stone-200/70 opacity-80"
                }`}
              >
                {/* Top Strip: User Info & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1A1F1C] text-white flex items-center justify-center font-black text-sm uppercase">
                      {msg.user?.name ? msg.user.name.charAt(0) : "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black uppercase text-[#1A1F1C]">
                          {msg.user?.name || "ANONYMOUS USER"}
                        </h3>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            msg.status === "PENDING"
                              ? "bg-amber-500 text-white"
                              : msg.status === "PROCESSED"
                              ? "bg-emerald-600 text-white"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-stone-500 flex-wrap">
                        {msg.user?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" />
                            {msg.user.phone}
                          </span>
                        )}
                        {msg.user?.email && (
                          <span className="flex items-center gap-1 lowercase">
                            <Mail className="w-3 h-3 text-stone-400" />
                            {msg.user.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-stone-400">
                          <Clock className="w-3 h-3" />
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isItemLoading}
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer disabled:opacity-50 self-end sm:self-auto"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bundle Details Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FBFBF9] rounded-2xl border border-stone-200/80 gap-3">
                  <div>
                    <div className="text-xs font-black uppercase text-stone-900">
                      REQUESTED BUNDLE: {msg.bundleName}
                    </div>
                    <div className="text-[11px] font-bold text-[#657A68] uppercase">
                      PRICE: {msg.bundlePrice}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-black uppercase text-stone-800">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>+{msg.adCredits} ADS</span>
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1.5 bg-[#657A68]/15 border border-[#657A68]/30 rounded-xl text-xs font-black uppercase text-[#657A68]">
                      <Sparkles className="w-3.5 h-3.5 text-[#657A68]" />
                      <span>+{msg.boostCredits} BOOSTS</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  {/* Current User Balance Indicator */}
                  <div className="text-xs font-bold text-stone-400 uppercase">
                    CURRENT BALANCE:{" "}
                    <strong className="text-stone-700">
                      {msg.user?.wallet?.adCredits || 0} Ads • {msg.user?.wallet?.boostCredits || 0} Boosts
                    </strong>
                  </div>

                  {/* Decision Controls & WhatsApp */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    {formattedPhone && (
                      <a
                        href={`https://wa.me/${formattedPhone}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>WHATSAPP</span>
                      </a>
                    )}

                    {msg.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          disabled={isItemLoading}
                          onClick={() => handleReject(msg.id)}
                          className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-black uppercase flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-stone-400" />
                          <span>REJECT</span>
                        </button>

                        <button
                          type="button"
                          disabled={isItemLoading}
                          onClick={() => handleApprove(msg.id, msg.user?.name || "User")}
                          style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
                          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>APPROVE & CREDIT</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}