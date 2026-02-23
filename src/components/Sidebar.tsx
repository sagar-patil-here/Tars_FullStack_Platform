"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Search, User, MessageSquare } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const { user } = useUser();
  const users = useQuery(api.users.getUsers);
  const [search, setSearch] = useState("");

  // Filter users: exclude self and match search
  const filteredUsers = users?.filter((u) => {
    const isMe = u.clerkId === user?.id;
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase());
    return !isMe && matchesSearch;
  });

  return (
    <aside className="w-full md:w-80 border-r border-slate-800 bg-slate-950 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-100">
          <MessageSquare className="w-5 h-5 text-sky-500" />
          <span>Tars<span className="text-sky-400">Chat</span></span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Search */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Suggested Users
        </div>
        
        {filteredUsers === undefined ? (
          // Loading skeleton
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-24" />
                <div className="h-3 bg-slate-800 rounded w-16" />
              </div>
            </div>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-8 text-slate-500 text-sm">
            No users found.
          </div>
        ) : (
          filteredUsers.map((u) => (
            <button
              key={u._id}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-900 transition-colors text-left group"
              onClick={() => {
                // We will handle navigation to chat here later
                console.log("Start chat with:", u.name);
              }}
            >
              {u.image ? (
                <img src={u.image} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                  {u.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Click to start chatting
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
