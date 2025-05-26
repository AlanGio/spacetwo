"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ImageIcon, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { toSlug } from "../lib/url-utils"
import { useState } from "react"

interface DetailFile {
  id: number
  name: string
  type: "image" | "video" | "design"
  preview: string
  lastEdited: string
  collaborators: {
    id: number
    avatar: string
    name: string
  }[]
  additionalCollaborators?: number
}

interface FileListItemProps {
  file: DetailFile
  index: number
  projectName?: string
}

const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    x: 8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

const thumbnailVariants = {
  hover: {
    scale: 1.08,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

export default function FileListItem({ file, index, projectName }: FileListItemProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />
      case "design":
        return <div className="w-4 h-4 bg-[#5865f2] rounded flex items-center justify-center text-xs text-white">F</div>
      default:
        return <ImageIcon className="w-4 h-4" />
    }
  }

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Video"
      case "design":
        return "Design"
      default:
        return "Image"
    }
  }

  const handleFileClick = async () => {
    if (isNavigating) return

    setIsNavigating(true)

    // Add a small delay for the animation to be visible
    await new Promise((resolve) => setTimeout(resolve, 150))

    if (projectName) {
      router.push(`/project/${toSlug(projectName)}/file/${file.id}`)
    } else {
      router.push(`/file/${file.id}`)
    }
  }

  return (
    <motion.div
      className={`group cursor-pointer ${isNavigating ? "pointer-events-none" : ""}`}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      custom={index}
      onClick={handleFileClick}
    >
      <div
        className={`flex items-center gap-6 p-4 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 ${
          isNavigating ? "bg-[#1a1a1a] opacity-70" : ""
        }`}
      >
        {/* Thumbnail */}
        <div
          className="relative w-24 h-16 rounded-lg flex-shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(238.99deg, rgba(49, 88, 107, 0.3) -14.89%, rgba(141, 110, 42, 0.3) 124.21%)",
          }}
        >
          <motion.div variants={thumbnailVariants} whileHover="hover" className="w-full h-full">
            <Image src={file.preview || "/placeholder.svg"} alt={file.name} fill className="object-cover rounded-lg" />
            {/* File Type Icon Overlay */}
            <div className="absolute bottom-2 left-2">
              <div className="w-6 h-6 bg-[#333333] rounded flex items-center justify-center text-white">
                {getFileIcon(file.type)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* File Name */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-lg truncate">{file.name}</h3>
          <p className="text-[#827989] text-sm">{getFileTypeLabel(file.type)}</p>
        </div>

        {/* Collaborators */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-1">
            {file.collaborators.slice(0, 3).map((collaborator, idx) => (
              <Image
                key={collaborator.id}
                src={collaborator.avatar || "/placeholder.svg"}
                alt={collaborator.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover border border-[#333333]"
                style={{ marginLeft: idx > 0 ? "-4px" : "0" }}
              />
            ))}
            {file.additionalCollaborators && (
              <div className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-xs text-[#827989] ml-1">
                +{file.additionalCollaborators}
              </div>
            )}
          </div>
        </div>

        {/* File Type Badge */}
        <div className="flex-shrink-0 text-[#827989] text-sm min-w-[60px] text-center">
          {getFileTypeLabel(file.type)}
        </div>

        {/* Last Edited */}
        <div className="flex-shrink-0 text-[#827989] text-sm min-w-[120px] text-right">{file.lastEdited}</div>
      </div>
    </motion.div>
  )
}
