"use client";
import { Sidebar } from "@/components/Sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-slate-950">
        {children}
      </div>
    </div>
  );
}
