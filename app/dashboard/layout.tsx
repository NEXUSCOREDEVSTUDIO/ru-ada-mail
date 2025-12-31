"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "./ChatArea";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We are going to implement a layout where Sidebar controlls the main view via Context or URL
    // But since Next.js App Router works best with URL, let's just make the sidebar smarter and maybe use a client component wrapper.
    // Wait, the children here is likely page.tsx.

    // To make a Single Page App feel like WhatsApp Web, we need the state to live high up.
    // Or we stick to Sidebar on left, Child on right.
    // But `children` is static per route unless we manipulate it.

    // Let's modify this: DashboardLayout just provides the structure.
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--app-bg)' }}>
            {/* We will render sidebar inside the page for state sharing or here if we use URL params */}
            {/* Actually, user wants "WhatsApp Web Style".
                 Left: List. Right: Chat.
                 If I put Sidebar here, it persists. 
                 The page.tsx will be the "Right Side".
             */}
            {/* BUT: Sidebar needs to communicate with Page.tsx.
                 Standard Next.js way: Sidebar writes to URL (?chat=123), Page reads URL.
             */}
            {/* We will leave this clean and let page.tsx handle the Full UI to manage state easier given the constraints of 'children' prop passing in layouts */}
            {children}
        </div>
    );
}
