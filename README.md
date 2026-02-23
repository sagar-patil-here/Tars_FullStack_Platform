# Tars Chat Application

A real-time, full-stack chat application built for the Tars Full Stack Engineer Internship Coding Challenge. This project demonstrates a modern, scalable approach to building real-time messaging using Next.js, Convex, and Clerk.

## 🚀 Tech Stack

- **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database:** [Convex](https://convex.dev/) (Real-time database + backend functions)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Why this stack?

1.  **Next.js App Router:** Provides a robust framework for server-side rendering, routing, and optimizing performance.
2.  **Convex:** Replaces the traditional API + Database + WebSocket layer. It offers end-to-end type safety and reactive, real-time updates out of the box, which is critical for a chat app.
3.  **Clerk:** Handles complex authentication flows (sign-in, sign-up, session management) securely and integrates seamlessly with both Next.js and Convex.
4.  **Tailwind CSS:** Allows for rapid UI development with a utility-first approach, ensuring a consistent and responsive design.

## 📂 Project Architecture

The project follows a standard Next.js App Router structure, with a clear separation between frontend UI, backend logic, and shared utilities.

```
tars-chat-app/
├── convex/                 # Backend logic (Database schema & functions)
│   ├── schema.ts           # Database schema definition
│   ├── users.ts            # User-related backend functions
│   ├── conversations.ts    # Chat logic
│   └── messages.ts         # Message handling
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Authentication routes (sign-in, sign-up)
│   │   ├── chat/           # Main chat application routes
│   │   ├── layout.tsx      # Root layout with Providers
│   │   └── page.tsx        # Landing page
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions and types
│   └── middleware.ts       # Clerk authentication middleware
├── public/                 # Static assets
└── ...config files         # (next.config.ts, tailwind.config.ts, etc.)
```

## 🛠️ Setup & Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd tars-chat-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Clerk and Convex keys:

    ```bash
    # Clerk Keys (from Clerk Dashboard)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    # Clerk URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat

    # Convex URL (automatically added by npx convex dev)
    NEXT_PUBLIC_CONVEX_URL=https://...
    ```

4.  **Run Development Server:**
    Start both the Next.js frontend and Convex backend:

    ```bash
    npm run dev
    npx convex dev
    ```

    The app will be available at `http://localhost:3000`.

## 🚀 Deployment

This application is designed to be deployed on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the Environment Variables (from your `.env.local`) to the Vercel project settings.
4.  Deploy! Vercel will automatically build the Next.js app.
5.  For Convex, run `npx convex deploy` to push your backend functions to production.

## ✨ Features (Planned/Implemented)

- [x] **Authentication:** Secure sign-up/login with Clerk.
- [x] **Landing Page:** Professional, responsive landing page.
- [ ] **Real-time Messaging:** Instant message delivery using Convex subscriptions.
- [ ] **User Discovery:** Search and find other users to chat with.
- [ ] **1-on-1 Chats:** Private conversations.
- [ ] **Typing Indicators:** Real-time "User is typing..." status.
- [ ] **Online Status:** See who is currently online.
- [ ] **Read Receipts:** Unread message counts.

---

Built with ❤️ by [Sagar](https://sagar-patil.vercel.app)
