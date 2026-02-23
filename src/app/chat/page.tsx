"use client";

import { useUserSync } from "@/hooks/useUserSync";

export default function ChatPage() {
  // Sync user to Convex on load
  useUserSync();

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-950">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-500"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to Tars Chat!</h2>
        <p className="text-slate-400">
          Select a user from the sidebar to start a conversation.
        </p>
      </div>
    </div>
  );
}
