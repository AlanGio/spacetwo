"use client"

import { ChevronDown, Grid3X3, List, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import ProjectCard from "./ProjectCard"
import ProjectListItem from "./ProjectListItem"

interface ProjectFile {
  id: number
  image: string
  type: string
  orientation: string
}

interface ProjectCardData {
  id: number
  title: string
  fileCount: number
  lastUpdated: string
  lastUpdatedTimestamp: number
  likes: number
  comments: number
  isLive: boolean
  files: ProjectFile[]
}

interface ProjectViewProps {
  selectedProject: string | null
  currentProjects: ProjectCardData[]
}

type SortOption = "Last modified" | "Most Liked" | "Most Commented"

const sortOptions: SortOption[] = ["Last modified", "Most Liked", "Most Commented"]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
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

// Helper function to convert time strings to timestamps for sorting
const getTimestampFromString = (timeString: string): number => {
  const now = Date.now()

  if (timeString.includes("mins ago")) {
    const minutes = Number.parseInt(timeString.match(/(\d+)/)?.[0] || "0")
    return now - minutes * 60 * 1000
  } else if (timeString.includes("hour")) {
    const hours = Number.parseInt(timeString.match(/(\d+)/)?.[0] || "0")
    return now - hours * 60 * 60 * 1000
  } else if (timeString.includes("day")) {
    const days = Number.parseInt(timeString.match(/(\d+)/)?.[0] || "0")
    return now - days * 24 * 60 * 60 * 1000
  }

  return now
}

export default function ProjectView({ selectedProject, currentProjects }: ProjectViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<SortOption>("Last modified")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Enhance projects with mock data for sorting
  const enhancedProjects: ProjectCardData[] = currentProjects.map((project) => ({
    ...project,
    lastUpdatedTimestamp: getTimestampFromString(project.lastUpdated),
    likes: Math.floor(Math.random() * 150) + 20, // Random likes between 20-170
    comments: Math.floor(Math.random() * 40) + 5, // Random comments between 5-45
  }))

  // Sort projects based on selected option
  const sortedProjects = [...enhancedProjects].sort((a, b) => {
    switch (sortBy) {
      case "Last modified":
        return b.lastUpdatedTimestamp - a.lastUpdatedTimestamp
      case "Most Liked":
        return b.likes - a.likes
      case "Most Commented":
        return b.comments - a.comments
      default:
        return 0
    }
  })

  const handleSortChange = (option: SortOption) => {
    setSortBy(option)
    setIsDropdownOpen(false)
  }

  return (
    <>
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
            key={sortedProjects.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {sortedProjects.length} {sortedProjects.length === 1 ? "project" : "projects"}
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

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key={`grid-${selectedProject}-${sortBy}`}
                className="grid grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sortedProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} projectName={selectedProject || ""} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-${selectedProject}-${sortBy}`}
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sortedProjects.map((project, index) => (
                  <ProjectListItem key={project.id} project={project} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />}
    </>
  )
}
