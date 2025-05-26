"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

interface SidebarProfile {
  id: number
  type: "icon" | "text"
  icon?: string
  label?: string
  bg: string
  color: string
  name: string
  projectCount: number
}

interface SidebarProps {
  profiles: SidebarProfile[]
  selectedProject: string | null
  onProfileClick: (profile: SidebarProfile) => void
}

export default function Sidebar({ profiles, selectedProject, onProfileClick }: SidebarProps) {
  return (
    <div className="w-20 bg-[#111111] border-r border-[#333333] flex flex-col items-center py-6 gap-4 flex-shrink-0">
      {profiles.map((profile, index) => (
        <motion.div
          key={profile.id}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer ${
            selectedProject === profile.name ? "ring-2 ring-white" : ""
          }`}
          style={{ backgroundColor: profile.bg, color: profile.color }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onProfileClick(profile)}
        >
          {profile.type === "icon" ? (
            <Image
              src={profile.icon! || "/placeholder.svg"}
              alt="Icon"
              width={20}
              height={20}
              className="w-5 h-5"
              style={{ filter: profile.color === "#ffffff" ? "invert(1)" : "none" }}
            />
          ) : (
            profile.label
          )}
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full border border-[#333333] text-[#827989] hover:text-white hover:border-[#666666] mt-4"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}
