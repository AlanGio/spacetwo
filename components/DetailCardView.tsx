"use client"

import { useState } from "react"
import { ChevronDown, Grid3X3, List, ImageIcon, Play } from "lucide-react"
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

export default function DetailCardView({ projectName, cardId, projectData }: DetailCardViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isPresentationOpen, setIsPresentationOpen] = useState(false)
  const [navigatingFileId, setNavigatingFileId] = useState<number | null>(null)
  const router = useRouter()

  const files: DetailFile[] =
    projectData?.files.map((file, index) => ({
      id: Number.parseInt(file.id),
      name: `File ${index + 1}`,
      type: index % 3 === 0 ? "image" : index % 3 === 1 ? "video" : "design",
      preview: file.image,
      lastEdited: `Edited ${Math.floor(Math.random() * 5) + 1} ${Math.random() > 0.5 ? "hours" : "minutes"} ago`,
      collaborators: [
        { id: 1, avatar: `https://picsum.photos/seed/user${index}1/100/100`, name: "User 1" },
        { id: 2, avatar: `https://picsum.photos/seed/user${index}2/100/100`, name: "User 2" },
      ],
      additionalCollaborators: Math.floor(Math.random() * 4),
    })) || []

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
        <Button variant="ghost" className="text-[#827989] hover:text-white flex items-center gap-2">
          Last modified
          <ChevronDown className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xs text-[#827989]"
            key={files.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {files.length} {files.length === 1 ? "file" : "files"}
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
                key="grid-view"
                className="grid grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {files.map((file, index) => (
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
                      className={`relative rounded-lg overflow-hidden mb-3 transition-all duration-300 ${
                        navigatingFileId === file.id ? "scale-95 opacity-70" : ""
                      }`}
                      style={{
                        background:
                          "linear-gradient(238.99deg, rgba(49, 88, 107, 0.3) -14.89%, rgba(141, 110, 42, 0.3) 124.21%)",
                      }}
                    >
                      <div className="aspect-[4/5] relative">
                        <Image src={file.preview || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                        {/* File Type Icon */}
                        <div className="absolute bottom-3 left-3">
                          <div className="w-8 h-8 bg-[#333333] rounded flex items-center justify-center text-white">
                            {getFileIcon(file.type)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="space-y-2">
                      <h3 className="text-white font-medium text-sm">{file.name}</h3>
                      <p className="text-[#827989] text-xs">{file.lastEdited}</p>

                      {/* Collaborators */}
                      <div className="flex items-center gap-1">
                        {file.collaborators.slice(0, 3).map((collaborator, idx) => (
                          <Image
                            key={collaborator.id}
                            src={collaborator.avatar || "/placeholder.svg"}
                            alt={collaborator.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-full object-cover border border-[#333333]"
                            style={{ marginLeft: idx > 0 ? "-4px" : "0" }}
                          />
                        ))}
                        {file.additionalCollaborators && (
                          <div className="w-5 h-5 bg-[#333333] rounded-full flex items-center justify-center text-xs text-[#827989] ml-1">
                            +{file.additionalCollaborators}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list-view"
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {files.map((file, index) => (
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
    </motion.div>
  )
}
