"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, Settings } from "lucide-react";

export default function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    // TODO: Implement profile page navigation
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    // TODO: Implement settings page navigation
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Button
        onClick={() => router.push("/login")}
        className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
        size="sm"
      >
        Sign In
      </Button>
    );
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-[#333333] transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#5865f2] flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="text-white text-sm font-medium hidden md:block">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#222222] border border-[#333333] rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-[#333333]">
            <p className="text-white font-medium text-sm">{displayName}</p>
            <p className="text-[#827989] text-xs">{user.email}</p>
          </div>

          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="w-full px-3 py-2 text-left text-white hover:bg-[#333333] transition-colors flex items-center gap-3"
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={handleSettingsClick}
              className="w-full px-3 py-2 text-left text-white hover:bg-[#333333] transition-colors flex items-center gap-3"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <hr className="my-2 border-[#333333]" />

            <button
              onClick={handleSignOut}
              className="w-full px-3 py-2 text-left text-red-400 hover:bg-[#333333] transition-colors flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
