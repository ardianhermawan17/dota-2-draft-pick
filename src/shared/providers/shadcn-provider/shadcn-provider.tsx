'use client'

import React from "react"
import { ThemeProvider } from "@shared/providers/theme-provider"
import {Toaster} from "@shared/components/ui/sonner";
import { TooltipProvider } from "@shared/components/ui/tooltip";

export const ShadcnProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                {children}
            </TooltipProvider>
            <Toaster/>
        </ThemeProvider>
    )
}