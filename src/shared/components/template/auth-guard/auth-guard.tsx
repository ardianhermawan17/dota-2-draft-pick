"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {useAppSelector} from "@shared/config/redux/hooks";
import {toast} from "sonner";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const { userId, status } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        const isAuthenticated = !!userId;

        // Allow public routes
        if (pathname === "/" || pathname === "/auth") {
            if (pathname === "/auth" && isAuthenticated) {
                router.replace("/draft-history");
            }
            return;
        }

        // Protect all other routes
        if (!isAuthenticated) {
            router.replace("/auth");
            toast.warning("Please log in to access this page");
        }
    }, [userId, pathname, router]);

    // Optional: prevent flicker while checking
    if (status === "loading") {
        return null;
    }

    return <>{children}</>;
}