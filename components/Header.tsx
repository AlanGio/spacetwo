"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeaderProps {
  currentView: "community" | "project"
  selectedProject: string | null
  onBackToCommunity: () => void
  onChatToggle?: () => void
  onUsersToggle?: () => void
  onAddToggle?: () => void
  isChatOpen?: boolean
  isUsersOpen?: boolean
  isAddOpen?: boolean
}

export default function Header({
  currentView,
  selectedProject,
  onBackToCommunity,
  onChatToggle,
  onUsersToggle,
  onAddToggle,
  isChatOpen,
  isUsersOpen,
  isAddOpen,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#222222] border-b border-[#333333] flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white" onClick={onBackToCommunity}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-[#827989] ml-2">
            {currentView === "project" ? selectedProject : "Spacetwo Community"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`${isAddOpen ? "text-white bg-[#333333]" : "text-[#827989] hover:text-white"}`}
          onClick={onAddToggle}
        >
          <Image src="/icons/add_box.svg" alt="Add" width={20} height={20} className="w-5 h-5" />
        </Button>
        {currentView === "project" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className={`${isChatOpen ? "text-white bg-[#333333]" : "text-[#827989] hover:text-white"}`}
              onClick={onChatToggle}
            >
              <Image src="/icons/chat.svg" alt="Chat" width={20} height={20} className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${isUsersOpen ? "text-white bg-[#333333]" : "text-[#827989] hover:text-white"}`}
              onClick={onUsersToggle}
            >
              <Image src="/icons/users.svg" alt="Users" width={20} height={20} className="w-5 h-5" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
