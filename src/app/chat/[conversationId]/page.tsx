"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState, useRef, useEffect, useCallback } from "react";
import { formatTimestamp } from "@/lib/formatTimestamp";
import { ArrowLeft, Send, User, ChevronDown } from "lucide-react";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const conversationId = params.conversationId as Id<"conversations">;

  const messages = useQuery(api.messages.list, { conversationId });
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.conversations.markRead);
  const setTyping = useMutation(api.typing.setTyping);
  const typingUsers = useQuery(api.typing.getTyping, { conversationId });
  const presence = useQuery(api.presence.getPresence);

  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id,
  });

  // Get the other user's info from conversations
  const conversations = useQuery(api.conversations.getMyConversations);
  const currentConversation = conversations?.find((c) => c._id === conversationId);
  const otherUser = currentConversation?.otherUser;
  const isOtherOnline = otherUser ? (presence?.[otherUser._id] ?? false) : false;

  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Mark conversation as read when opening or when new messages arrive
  useEffect(() => {
    if (conversationId && messages && messages.length > 0) {
      markRead({ conversationId }).catch(console.error);
    }
  }, [conversationId, messages, markRead]);

  // Smart auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || !messages) return;
    const container = scrollContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      scrollToBottom();
    } else if (messages.length > 0) {
      setShowScrollButton(true);
    }
  }, [messages, scrollToBottom]);

  // Track scroll position for the "New messages" button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      setShowScrollButton(false);
    }
  };

  // Typing indicator logic
  const handleInputChange = (value: string) => {
    setInput(value);

    if (!isTypingRef.current && value.length > 0) {
      isTypingRef.current = true;
      setTyping({ conversationId, isTyping: true }).catch(console.error);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      setTyping({ conversationId, isTyping: false }).catch(console.error);
    }, 2000);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Stop typing indicator immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    setTyping({ conversationId, isTyping: false }).catch(console.error);

    setInput("");
    try {
      await sendMessage({ conversationId, body: trimmed });
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      setInput(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
        <button
          onClick={() => router.push("/chat")}
          className="md:hidden p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            {otherUser?.image ? (
              <img
                src={otherUser.image}
                alt={otherUser.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-800"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            )}
            {isOtherOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm text-white">
              {otherUser?.name || "Conversation"}
            </p>
            <p className="text-xs text-slate-500">
              {typingUsers && typingUsers.length > 0
                ? `${typingUsers.join(", ")} is typing...`
                : isOtherOnline
                  ? "Online"
                  : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
      >
        {messages === undefined ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-20" />
                  <div className="h-10 bg-slate-800 rounded w-60" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                <Send className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">
                No messages yet. Say hi to start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?._id;

            return (
              <div
                key={msg._id}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
              >
                {!isMe &&
                  (msg.senderImage ? (
                    <img
                      src={msg.senderImage}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-800"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}

                <div className={`max-w-[70%] space-y-1 ${isMe ? "items-end" : ""}`}>
                  {!isMe && (
                    <p className="text-xs text-slate-500 px-1">{msg.senderName}</p>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-sky-600 text-white rounded-tr-none shadow-lg shadow-sky-500/10"
                        : "bg-slate-800 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.body}
                  </div>
                  <p
                    className={`text-[10px] text-slate-600 px-1 ${
                      isMe ? "text-right" : ""
                    }`}
                  >
                    {formatTimestamp(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator dots */}
        {typingUsers && typingUsers.length > 0 && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* New Messages Button */}
      {showScrollButton && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 md:left-auto md:right-8 md:translate-x-0">
          <button
            onClick={scrollToBottom}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 text-white text-xs font-medium rounded-full shadow-lg hover:bg-sky-600 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            New messages
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-sky-500 rounded-full hover:bg-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
