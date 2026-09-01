"use client";

import { useState, useEffect } from "react";
import {
  getAllUsers,
  updateAgentCredits,
  toggleBanUser,
  deleteUserAccount,
} from "@/actions/admin";
import {
  Users,
  Search,
  Coins,
  Sparkles,
  Ban,
  CheckCircle2,
  Trash2,
  Building2,
  Phone,
  Mail,
  Plus,
  X,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function AdminAgentsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Status message states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Credit Recharge Modal State
  const [selectedUserForCredit, setSelectedUserForCredit] = useState<any | null>(null);
  const [creditType, setCreditType] = useState<"AD" | "BOOST">("AD");
  const [creditsToAdd, setCreditsToAdd] = useState<number>(5);

  const loadData = async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Toggle Ban Handler
  const handleToggleBan = async (userId: string, currentStatus: boolean, userName: string) => {
    const confirmPrompt = currentStatus
      ? `ARE YOU SURE YOU WANT TO UNBAN ${userName}?`
      : `ARE YOU SURE YOU WANT TO SUSPEND/BAN ${userName}?`;

    if (!confirm(confirmPrompt)) return;

    setActionLoadingId(userId);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await toggleBanUser(userId);
    if (res.success) {
      setSuccessMsg(`USER STATUS UPDATED: ${res.isBanned ? "BANNED" : "ACTIVE"}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: res.isBanned } : u))
      );
    } else {
      setErrorMsg(res.error || "FAILED TO UPDATE BAN STATUS.");
    }
    setActionLoadingId(null);
  };

  // 2. Delete User Handler
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`WARNING: THIS WILL PERMANENTLY DELETE ${userName} AND ALL THEIR PROPERTIES. PROCEED?`)) {
      return;
    }

    setActionLoadingId(userId);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await deleteUserAccount(userId);
    if (res.success) {
      setSuccessMsg("USER ACCOUNT DELETED SUCCESSFULLY.");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      setErrorMsg(res.error || "FAILED TO DELETE USER.");
    }
    setActionLoadingId(null);
  };

  // 3. Recharge Credits (Ad or Boost)
  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForCredit || creditsToAdd < 1) return;

    setActionLoadingId(selectedUserForCredit.id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await updateAgentCredits(selectedUserForCredit.id, creditsToAdd, creditType);
    if (res.success) {
      setSuccessMsg(`ADDED ${creditsToAdd} ${creditType} CREDITS TO ${selectedUserForCredit.name}!`);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === selectedUserForCredit.id) {
            return {
              ...u,
              wallet: {
                ...u.wallet,
                adCredits:
                  creditType === "AD"
                    ? (u.wallet?.adCredits || 0) + creditsToAdd
                    : u.wallet?.adCredits || 0,
                boostCredits:
                  creditType === "BOOST"
                    ? (u.wallet?.boostCredits || 0) + creditsToAdd
                    : u.wallet?.boostCredits || 0,
              },
            };
          }
          return u;
        })
      );
      setSelectedUserForCredit(null);
    } else {
      setErrorMsg(res.error || "FAILED TO ADD CREDITS.");
    }
    setActionLoadingId(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#1A1F1C] tracking-tight">
              AGENTS & REGISTERED USERS
            </h1>
            <span className="px-2.5 py-0.5 bg-stone-200 text-stone-700 text-xs font-black rounded-lg">
              {users.length} TOTAL
            </span>
          </div>
          <p className="text-xs font-bold uppercase text-stone-400">
            CONTROL ACCOUNTS, ASSIGN AD & BOOST CREDITS, & MANAGE DIRECTORY ACCESS
          </p>
        </div>
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
            placeholder="SEARCH BY NAME, EMAIL, OR PHONE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-[#657A68]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-black uppercase outline-none focus:border-[#657A68] appearance-none cursor-pointer"
          >
            <option value="ALL">ALL ROLES</option>
            <option value="AGENT">AGENTS ONLY</option>
            <option value="CLIENT">CLIENTS ONLY</option>
            <option value="ADMIN">ADMINS</option>
          </select>
          <Filter className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-16 text-center text-xs font-black uppercase text-stone-400">
          LOADING USER DIRECTORY...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
          <Users className="w-10 h-10 text-stone-300 mx-auto" />
          <div className="text-sm font-black uppercase text-[#1A1F1C]">
            NO USERS FOUND
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const isSelf = user.role === "ADMIN";
            const isItemLoading = actionLoadingId === user.id;

            return (
              <div
                key={user.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs transition-all ${
                  user.isBanned
                    ? "border-red-300 bg-red-50/20"
                    : "border-stone-200/90"
                }`}
              >
                {/* User Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm uppercase shrink-0 ${
                      user.role === "ADMIN"
                        ? "bg-[#1A1F1C] text-white"
                        : user.role === "AGENT"
                        ? "bg-[#657A68]/20 text-[#657A68]"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {user.name.charAt(0)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-black uppercase text-[#1A1F1C] truncate">
                        {user.name}
                      </h3>

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          user.role === "ADMIN"
                            ? "bg-stone-900 text-white"
                            : user.role === "AGENT"
                            ? "bg-[#657A68] text-white"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {user.role}
                      </span>

                      {user.isBanned && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#E53935] text-white">
                          SUSPENDED / BANNED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-stone-500 flex-wrap">
                      <div className="flex items-center gap-1 lowercase">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 uppercase">
                        <Building2 className="w-3 h-3 text-[#657A68]" />
                        <span>{user._count?.properties || 0} ADS POSTED</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credits & Action Buttons */}
                <div className="flex items-center gap-2.5 self-end md:self-center shrink-0 flex-wrap">
                  {/* Ad & Boost Credits Counters */}
                  <div className="flex items-center bg-[#FBFBF9] border border-stone-200 rounded-xl p-1 gap-1.5 shadow-2xs">
                    {/* Ad Credits */}
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-black uppercase text-stone-800 bg-white rounded-lg border border-stone-100"
                      title="Available Ad Credits"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>{user.wallet?.adCredits || 0} ADS</span>
                    </div>

                    {/* Boost Credits */}
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-black uppercase text-[#657A68] bg-[#657A68]/10 rounded-lg border border-[#657A68]/20"
                      title="Available Boost Credits"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#657A68]" />
                      <span>{user.wallet?.boostCredits || 0} BOOSTS</span>
                    </div>

                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => setSelectedUserForCredit(user)}
                        className="px-2.5 py-1.5 bg-[#1A1F1C] hover:bg-stone-800 text-white rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1"
                        title="Recharge Credits"
                      >
                        <Plus className="w-3 h-3 text-emerald-400" />
                        <span>ADD</span>
                      </button>
                    )}
                  </div>

                  {/* Actions for Non-Admin accounts */}
                  {!isSelf && (
                    <>
                      {/* Ban / Unban Button */}
                      <button
                        type="button"
                        disabled={isItemLoading}
                        onClick={() => handleToggleBan(user.id, user.isBanned, user.name)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer disabled:opacity-50 ${
                          user.isBanned
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                        title={user.isBanned ? "Unban Account" : "Suspend / Ban Account"}
                      >
                        {user.isBanned ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Ban className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete Account */}
                      <button
                        type="button"
                        disabled={isItemLoading}
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete User Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Credit Recharge Modal with AD & BOOST Tabs */}
      {selectedUserForCredit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 border border-stone-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    creditType === "AD"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-[#657A68]/20 text-[#657A68]"
                  }`}
                >
                  {creditType === "AD" ? (
                    <Coins className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-[#1A1F1C]">
                    GRANT {creditType} CREDITS
                  </h3>
                  <p className="text-[10px] font-bold uppercase text-stone-400">
                    FOR {selectedUserForCredit.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForCredit(null)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Credit Type Selection (AD CREDITS vs BOOST CREDITS) */}
            <div className="grid grid-cols-2 p-1 bg-[#FBFBF9] border border-stone-200 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setCreditType("AD")}
                className={`py-2 rounded-lg text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  creditType === "AD"
                    ? "bg-[#1A1F1C] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>AD CREDITS</span>
              </button>
              <button
                type="button"
                onClick={() => setCreditType("BOOST")}
                className={`py-2 rounded-lg text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  creditType === "BOOST"
                    ? "bg-[#657A68] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>BOOST CREDITS</span>
              </button>
            </div>

            <form onSubmit={handleRechargeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                  AMOUNT TO ADD
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[1, 3, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCreditsToAdd(preset)}
                      className={`py-2 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                        creditsToAdd === preset
                          ? "bg-[#1A1F1C] text-white border-[#1A1F1C]"
                          : "bg-[#FBFBF9] border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={creditsToAdd}
                  onChange={(e) => setCreditsToAdd(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-[#657A68]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForCredit(null)}
                  className="py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-black uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#1A1F1C", color: "#ffffff" }}
                  className="py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 cursor-pointer shadow-md"
                >
                  CONFIRM ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}