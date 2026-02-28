"use client";

import { PostHogProvider } from "@/lib/posthog/provider";
import { SpeedInsights } from '@vercel/speed-insights/next';
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PostHogProvider>
                {children}
            </PostHogProvider>
            <SpeedInsights/>
        </>
    )
}