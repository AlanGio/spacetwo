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
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
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
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    y: -2,
    scale: 1.01,
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
    scale: 1.05,
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
        return <Play className="w-3 h-3" />
      case "design":
        return <div className="w-3 h-3 bg-[#5865f2] rounded flex items-center justify-center text-xs text-white">F</div>
      default:
        return <ImageIcon className="w-3 h-3" />
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
        className={`bg-[#1a1a1a] rounded-xl p-4 transition-all duration-300 hover:bg-[#222222] border border-[#333333] hover:border-[#444444] ${
          isNavigating ? "opacity-70 scale-95" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Square Thumbnail */}
          <div
            className="relative w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden"
            style={{
              background: "linear-gradient(238.99deg, rgba(49, 88, 107, 0.3) -14.89%, rgba(141, 110, 42, 0.3) 124.21%)",
            }}
          >
            <motion.div variants={thumbnailVariants} whileHover="hover" className="w-full h-full">
              <Image
                src={file.preview || "/placeholder.svg"}
                alt={file.name}
                fill
                className="object-cover rounded-lg"
              />
              {/* File Type Icon Overlay */}
              <div className="absolute bottom-1 left-1">
                <div className="w-5 h-5 bg-black/70 backdrop-blur-sm rounded flex items-center justify-center text-white">
                  {getFileIcon(file.type)}
                </div>
              </div>
            </motion.div>
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base truncate mb-1">{file.name}</h3>
            <p className="text-[#827989] text-sm">{file.lastEdited}</p>
          </div>

          {/* Collaborators */}
          <div className="flex-shrink-0">
            <div className="flex items-center -space-x-2">
              {file.collaborators.slice(0, 3).map((collaborator, idx) => (
                <motion.div
                  key={collaborator.id}
                  className="relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                >
                  <Image
                    src={collaborator.avatar || "/placeholder.svg"}
                    alt={collaborator.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#1a1a1a] hover:border-[#333333] transition-colors"
                  />
                </motion.div>
              ))}
              {file.additionalCollaborators && file.additionalCollaborators > 0 && (
                <motion.div
                  className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center text-xs text-[#827989] font-medium border-2 border-[#1a1a1a]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.1 }}
                >
                  +{file.additionalCollaborators}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
