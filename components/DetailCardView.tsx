"use client"

import { useState } from "react"
import { ChevronDown, Grid3X3, List, ImageIcon, Play, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import PresentationMode from "./PresentationMode"
import FileListItem from "./FileListItem"
import { useRouter } from "next/navigation"
import { toSlug } from "../lib/url-utils"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.3,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
}

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

interface DetailFile {
  id: number
  name: string
  type: "image" | "video" | "design"
  preview: string
  lastEdited: string
  lastModifiedTimestamp: number
  likes: number
  comments: number
  collaborators: {
    id: number
    avatar: string
    name: string
  }[]
  additionalCollaborators?: number
}

interface ProjectCardData {
  id: string
  title: string
  description: string
  image: string
  files: { id: string; image: string }[]
}

interface DetailCardViewProps {
  projectName: string
  cardId: string
  projectData?: ProjectCardData
}

type SortOption = "Last modified" | "Most Liked" | "Most Commented"

const sortOptions: SortOption[] = ["Last modified", "Most Liked", "Most Commented"]

export default function DetailCardView({ projectName, cardId, projectData }: DetailCardViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isPresentationOpen, setIsPresentationOpen] = useState(false)
  const [navigatingFileId, setNavigatingFileId] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("Last modified")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  // Generate files with mock data for sorting
  const baseFiles: DetailFile[] =
    projectData?.files.map((file, index) => {
      const randomMinutes = Math.floor(Math.random() * 1440) // Random minutes in a day
      const randomLikes = Math.floor(Math.random() * 200) + 10
      const randomComments = Math.floor(Math.random() * 50) + 1

      return {
        id: Number.parseInt(file.id),
        name: `File ${index + 1}`,
        type: (index % 3 === 0 ? "image" : index % 3 === 1 ? "video" : "design") as "image" | "video" | "design",
        preview: file.image,
        lastEdited: `Edited ${Math.floor(randomMinutes / 60) || 1} ${randomMinutes >= 60 ? "hours" : "minutes"} ago`,
        lastModifiedTimestamp: Date.now() - randomMinutes * 60 * 1000,
        likes: randomLikes,
        comments: randomComments,
        collaborators: [
          { id: 1, avatar: `https://picsum.photos/seed/user${index}1/100/100`, name: "User 1" },
          { id: 2, avatar: `https://picsum.photos/seed/user${index}2/100/100`, name: "User 2" },
        ],
        additionalCollaborators: Math.floor(Math.random() * 4),
      }
    }) || []

  // Sort files based on selected option
  const sortedFiles = [...baseFiles].sort((a, b) => {
    switch (sortBy) {
      case "Last modified":
        return b.lastModifiedTimestamp - a.lastModifiedTimestamp
      case "Most Liked":
        return b.likes - a.likes
      case "Most Commented":
        return b.comments - a.comments
      default:
        return 0
    }
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-5 h-5" />
      case "design":
        return <div className="w-5 h-5 bg-[#5865f2] rounded flex items-center justify-center text-xs text-white">F</div>
      default:
        return <ImageIcon className="w-5 h-5" />
    }
  }

  const handleFileClick = async (fileId: number) => {
    setNavigatingFileId(fileId)

    // Add a small delay for the animation to be visible
    await new Promise((resolve) => setTimeout(resolve, 200))

    router.push(`/project/${toSlug(projectName)}/file/${fileId}`)
  }

  const handleSortChange = (option: SortOption) => {
    setSortBy(option)
    setIsDropdownOpen(false)
  }

  // Convert files for presentation mode
  const presentationFiles = projectData?.files || []

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333] bg-[#111111] flex-shrink-0">
        <h1 className="text-2xl font-semibold text-white">{projectData?.title || "Project Details"}</h1>
        <button
          className="p-0 border-0 bg-transparent hover:opacity-80 transition-opacity"
          onClick={() => setIsPresentationOpen(true)}
        >
          <Image src="/icons/display_mode.svg" alt="Display mode" width={110} height={26} className="w-auto h-6" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333] bg-[#111111] flex-shrink-0">
        {/* Sort Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="text-[#827989] hover:text-white hover:bg-transparent flex items-center gap-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {sortBy}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </Button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-0 mt-2 w-48 bg-[#222222] border border-[#333333] rounded-lg shadow-lg z-10"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    className="w-full px-4 py-3 text-left text-[#827989] hover:text-white hover:bg-[#333333] transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                    onClick={() => handleSortChange(option)}
                  >
                    <span>{option}</span>
                    {sortBy === option && <Check className="w-4 h-4 text-[#eefe05]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <motion.span
            className="text-xs text-[#827989]"
            key={sortedFiles.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {sortedFiles.length} {sortedFiles.length === 1 ? "file" : "files"}
          </motion.span>
          <Button
            variant="ghost"
            size="sm"
            className={`${viewMode === "grid" ? "text-white bg-[#333333]" : "text-[#827989] hover:text-white"}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`${viewMode === "list" ? "text-white bg-[#333333]" : "text-[#827989] hover:text-white"}`}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Files Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key={`grid-view-${sortBy}`}
                className="grid grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sortedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    className={`group cursor-pointer ${navigatingFileId === file.id ? "pointer-events-none" : ""}`}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}
                    onClick={() => handleFileClick(file.id)}
                  >
                    <div
                      className={`bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#222222] border border-[#333333] hover:border-[#444444] ${
                        navigatingFileId === file.id ? "scale-95 opacity-70" : ""
                      }`}
                    >
                      {/* Main Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={file.preview || "/placeholder.svg"}
                          alt={file.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* File Type Icon - Bottom Left */}
                        <div className="absolute bottom-3 left-3">
                          <div className="w-8 h-8 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                            {getFileIcon(file.type)}
                          </div>
                        </div>

                        {/* Stats Badge - Top Right */}
                        {sortBy !== "Last modified" && (
                          <div className="absolute top-3 right-3">
                            <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white font-medium">
                              {sortBy === "Most Liked" ? `${file.likes} ♥` : `${file.comments} 💬`}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          {/* File Info */}
                          <div className="flex-1 min-w-0 pr-3">
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
                                    width={28}
                                    height={28}
                                    className="w-7 h-7 rounded-full object-cover border-2 border-[#1a1a1a] hover:border-[#333333] transition-colors"
                                  />
                                </motion.div>
                              ))}
                              {file.additionalCollaborators && file.additionalCollaborators > 0 && (
                                <motion.div
                                  className="w-7 h-7 bg-[#333333] rounded-full flex items-center justify-center text-xs text-[#827989] font-medium border-2 border-[#1a1a1a]"
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
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-view-${sortBy}`}
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sortedFiles.map((file, index) => (
                  <FileListItem key={file.id} file={file} index={index} projectName={projectName} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Presentation Mode */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        files={presentationFiles}
        projectTitle={projectData?.title || "Project"}
      />

      {/* Click outside to close dropdown */}
      {isDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />}
    </motion.div>
  )
}
