"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Search, User, MessageSquare, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";
import { usePresence } from "@/hooks/usePresence";
import { useUserSync } from "@/hooks/useUserSync";
import { formatTimestamp } from "@/lib/formatTimestamp";

export function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Sync user and send presence heartbeat
  useUserSync();
  usePresence();

  const users = useQuery(api.users.getUsers);
  const conversations = useQuery(api.conversations.getMyConversations);
  const presence = useQuery(api.presence.getPresence);
  const createOrGetConversation = useMutation(api.conversations.createOrGetDirectConversation);

  const [search, setSearch] = useState("");

  // On mobile, hide sidebar when a conversation is open
  const isConversationOpen = pathname !== "/chat";

  const filteredUsers = users?.filter((u) => {
    const isMe = u.clerkId === user?.id;
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase());
    return !isMe && matchesSearch;
  });

  const handleUserClick = async (userId: Id<"users">) => {
    try {
      const conversationId = await createOrGetConversation({ otherUserId: userId });
      setSearch("");
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <aside className={`${isConversationOpen ? "hidden md:flex" : "flex"} w-full md:w-80 border-r border-slate-800 bg-slate-950 flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-100">
          <MessageSquare className="w-5 h-5 text-sky-500" />
          <span>Tars<span className="text-sky-400">Chat</span></span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Search */}
      <div className="p-4 pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-9 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">

        {search ? (
          <>
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search Results
            </div>
            {filteredUsers?.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-sm">
                No users found matching &ldquo;{search.trim()}&rdquo;.
              </div>
            ) : (
              filteredUsers?.map((u) => {
                const isOnline = presence?.[u._id] ?? false;
                return (
                  <button
                    key={u._id}
                    onClick={() => handleUserClick(u._id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-900 transition-colors text-left"
                  >
                    <div className="relative flex-shrink-0">
                      {u.image ? (
                        <img src={u.image} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500">{isOnline ? "Online" : "Offline"}</p>
                    </div>
                  </button>
                );
              })
            )}
          </>
        ) : (
          <>
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
              <span>Conversations</span>
              <PlusCircle
                className="w-4 h-4 text-slate-500 cursor-pointer hover:text-sky-500 transition-colors"
                onClick={() => setSearch(" ")}
              />
            </div>

            {conversations === undefined ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-24" />
                    <div className="h-3 bg-slate-800 rounded w-16" />
                  </div>
                </div>
              ))
            ) : conversations.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-sm">
                No conversations yet. <br />
                Search for a user to start chatting!
              </div>
            ) : (
              conversations.map((c) => {
                const otherUser = c.otherUser;
                const lastMsg = c.lastMessage;
                const isOnline = otherUser ? (presence?.[otherUser._id] ?? false) : false;
                const isActive = pathname === `/chat/${c._id}`;

                return (
                  <Link
                    key={c._id}
                    href={`/chat/${c._id}`}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left group ${
                      isActive ? "bg-slate-800" : "hover:bg-slate-900"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {otherUser?.image ? (
                        <img src={otherUser.image} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                          {c.isGroup ? c.name : otherUser?.name || "Unknown User"}
                        </p>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-600 flex-shrink-0 ml-2">
                            {formatTimestamp(lastMsg.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">
                          {lastMsg ? lastMsg.body : "No messages yet"}
                        </p>
                        {c.unreadCount > 0 && (
                          <span className="ml-2 flex-shrink-0 bg-sky-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </>
        )}
      </div>
    </aside>
  );
}
