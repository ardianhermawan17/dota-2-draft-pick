import {useAppDispatch, useAppSelector} from "@shared/config/redux/hooks";
import {logout} from "@feature/auth/stores/auth-slice";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useMemo} from "react";
import {resetEntities} from "@feature/entities/stores/entities-slice";

export const useMainLayoutHeader = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    const { userId, status } = useAppSelector(
        (state) => state.auth
    );
    const isLoggedIn = useMemo(() => {
        if (status === "loading") {
            return false;
        }
        return !!userId;
    }, [userId, status]);

    const handleLogout = () => {
        dispatch(resetEntities());
        dispatch(logout());
        toast.success("Logged out successfully");
        // Redirect after success
        router.replace("/");
    }

    const handleLoginRedirect = () => {
        router.push("/auth");
    };

    const navLinks = [
        { name: "Static Draft", href: "/static-draft", isLoggedIn: true },
        { name: "Live Draft", href: "/live-draft", isLoggedIn: true },
        { name: "Draft History", href: "/draft-history", isLoggedIn: true },
    ]


    return {
        handleLogout,
        handleLoginRedirect,
        navLinks,
        isLoggedIn
    };
}