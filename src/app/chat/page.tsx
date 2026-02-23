import { UserButton } from "@clerk/nextjs";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-sky-400 to-indigo-500 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">
            Tars<span className="text-sky-400">Chat</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
          </div>
          <UserButton />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
              className="text-slate-400"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to Tars Chat!</h2>
          <p className="text-slate-400">
            You are successfully signed in. This is the main chat area where your conversations will appear.
          </p>
          <div className="pt-4">
            <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-sky-500/20">
              Start a Conversation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
