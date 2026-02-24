"use client";

import Link from "next/link";
import { MessageSquare, Users, Zap, Shield, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

function RedirectIfSignedIn() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/chat");
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-sky-500/30">
      <RedirectIfSignedIn />

      {/* Background Gradient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-gradient-to-tr from-sky-400 to-indigo-500 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span>Tars<span className="text-sky-400">Chat</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link 
                href="/sign-in" 
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-sky-500 px-6 font-medium text-white transition-all duration-300 hover:bg-sky-600 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)]"
              >
                <span className="relative flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/chat" 
                className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-sky-500 px-6 font-medium text-white transition-all duration-300 hover:bg-sky-600 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)]"
              >
                <span className="relative flex items-center gap-2">
                  Go to Chat <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-sky-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Live Real-time Messaging
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 max-w-4xl mx-auto leading-tight">
            Connect instantly with <br/>
            <span className="text-sky-400">zero latency.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of communication. Built with Next.js, Convex, and Clerk for a seamless, secure, and lightning-fast chat experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <SignedOut>
              <Link 
                href="/sign-up" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                Start Chatting Now
              </Link>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/chat" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                Go to Chat
              </Link>
            </SignedIn>
            <Link 
              href="https://github.com/sagar-patil-here/Tars_FullStack_Platform" 
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 text-white border border-slate-800 font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              View Source
            </Link>
          </div>

          {/* Chat Interface Mockup */}
          <div className="relative max-w-5xl mx-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl overflow-hidden group hover:border-slate-700 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Mockup Header */}
            <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-900/80">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto text-xs font-medium text-slate-500">tars-chat-app</div>
            </div>

            {/* Mockup Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 h-[400px] md:h-[500px]">
              {/* Sidebar Mockup */}
              <div className="hidden md:block border-r border-slate-800 p-4 space-y-4 bg-slate-900/30">
                <div className="h-8 bg-slate-800 rounded-md w-full animate-pulse" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-slate-800 rounded w-20" />
                      <div className="h-2 bg-slate-800/50 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Area Mockup */}
              <div className="col-span-3 p-6 flex flex-col h-full relative">
                <div className="flex-1 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AI</div>
                    <div className="space-y-1">
                      <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-slate-300 max-w-md">
                        Hey there! Welcome to Tars Chat. How can I help you today?
                      </div>
                      <div className="text-xs text-slate-600">10:23 AM</div>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold text-white">SP</div>
                    <div className="space-y-1">
                      <div className="bg-sky-600 rounded-2xl rounded-tr-none px-4 py-2 text-sm text-white max-w-md shadow-lg shadow-sky-500/20">
                        Just testing out this amazing real-time chat interface! The UI looks incredible.
                      </div>
                      <div className="text-xs text-slate-600 text-right">10:24 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AI</div>
                    <div className="space-y-1">
                      <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-slate-300 max-w-md">
                        Glad you like it! It&#39;s built with the latest tech stack for optimal performance.
                      </div>
                      <div className="text-xs text-slate-600">10:25 AM</div>
                    </div>
                  </div>
                </div>

                {/* Input Area Mockup */}
                <div className="mt-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent -top-10 pointer-events-none" />
                  <div className="bg-slate-900 border border-slate-700 rounded-full px-4 py-3 flex items-center gap-4 shadow-lg">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                    <div className="flex-1 h-2 bg-slate-800 rounded w-full" />
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-sky-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950 relative z-0">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose Tars Chat?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built for speed, security, and scalability. Everything you need in a modern chat application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Instant Delivery",
                desc: "Powered by Convex for sub-millisecond latency. Messages appear instantly across all devices."
              },
              {
                icon: <Shield className="w-6 h-6 text-green-400" />,
                title: "Secure & Private",
                desc: "End-to-end authentication via Clerk ensures your conversations remain private and secure."
              },
              {
                icon: <Users className="w-6 h-6 text-purple-400" />,
                title: "User Discovery",
                desc: "Find and connect with other users effortlessly. Real-time presence indicators show who's online."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900 group">
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-100">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 bg-slate-950 relative z-0">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-sky-500/10 p-1.5 rounded-lg">
              <MessageSquare className="w-4 h-4 text-sky-500" />
            </div>
            <span>Tars<span className="text-sky-400">Chat</span></span>
          </div>
          
          <div className="text-slate-500 text-sm">
            &copy; 2026 Tars Chat Application. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="https://github.com/sagar-patil-here/Tars_FullStack_Platform" target="_blank" className="text-slate-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
