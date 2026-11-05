"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { LogOut, ChevronDown, ShieldCheck, LayoutDashboard, Building2 } from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "diaspora"
      ? "Diaspora Investor"
      : user.role === "owner"
      ? "Property Owner"
      : "Home Seeker";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#1A1A1A] p-1.5 pr-3 text-left hover:border-[#333333] transition-colors"
        aria-expanded={isOpen}
      >
        <div className="relative size-8 overflow-hidden rounded-lg bg-[#262626]">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs font-bold text-white">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="hidden sm:block text-xs">
          <p className="font-semibold text-white leading-tight">{user.name}</p>
          <p className="text-[10px] text-[#703BF7] font-medium">{roleLabel}</p>
        </div>
        <ChevronDown className="size-3 text-[#999999]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#262626] bg-[#1A1A1A] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="border-b border-[#262626] p-3">
            <p className="text-sm font-bold text-white">{user.name}</p>
            <p className="text-xs text-[#999999] truncate">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#703BF7]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#946CF9]">
              <ShieldCheck className="size-3" />
              {roleLabel}
            </div>
          </div>

          <div className="py-1">
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#999999] hover:bg-[#262626] hover:text-white transition-colors"
              >
                <LayoutDashboard className="size-3.5 text-[#703BF7]" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/properties"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#999999] hover:bg-[#262626] hover:text-white transition-colors"
            >
              <Building2 className="size-3.5 text-[#703BF7]" />
              Browse Properties
            </Link>
          </div>

          <div className="border-t border-[#262626] pt-1">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
