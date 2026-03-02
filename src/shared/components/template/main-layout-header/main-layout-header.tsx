"use client"

import Link from "next/link"
import { LogOut, Menu } from "lucide-react"

import { DarkModeToggle } from "@shared/components/template/dark-mode-toggle"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu"

import { Button } from "@shared/components/ui/button"
import { Avatar, AvatarFallback } from "@shared/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@shared/components/ui/sheet"
import {useMainLayoutHeader} from "@shared/components/template/main-layout-header/use-main-layout-header";

export function MainLayoutHeader() {
    const {
        handleLogout,
        handleLoginRedirect,
        navLinks,
        isLoggedIn
    } = useMainLayoutHeader()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">

                {/* Left Section */}
                <div className="flex items-center gap-6">
                    <h1 className="font-semibold text-lg whitespace-nowrap">
                        Dota 2 Draft Plan
                    </h1>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`
                                text-sm font-medium text-muted-foreground hover:text-foreground transition-colors
                                ${link.isLoggedIn && !isLoggedIn ? "pointer-events-none opacity-50" : ""}
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">

                    <DarkModeToggle />

                    {/* Desktop User Dropdown */}
                    <div className="hidden md:block">
                        {!isLoggedIn ? (
                            <Button
                                onClick={handleLoginRedirect}
                                variant="outline"
                            >
                                Login
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        {!isLoggedIn ? (
                            <Button
                                onClick={handleLoginRedirect}
                                variant="outline"
                                size="sm"
                            >
                                Login
                            </Button>
                        ): (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>

                                <SheetContent side="right" className="w-64">
                                    <div className="flex flex-col gap-6 mt-6">

                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className="text-sm px-2 mx-auto font-medium"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}

                                        <div className="w-42 mx-auto">
                                            <Button
                                                variant="outline"
                                                onClick={handleLogout}
                                                className="mt-4"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </Button>
                                        </div>

                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    )
}