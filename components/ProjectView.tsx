"use client"

import { ChevronDown, Grid3X3, List } from "lucide-react"
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
  isLive: boolean
  files: ProjectFile[]
}

interface ProjectViewProps {
  selectedProject: string | null
  currentProjects: ProjectCardData[]
}

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

export default function ProjectView({ selectedProject, currentProjects }: ProjectViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333] bg-[#111111] flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white flex items-center gap-2">
            Last modified
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xs text-[#827989]"
            key={currentProjects.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {currentProjects.length} {currentProjects.length === 1 ? "project" : "projects"}
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
                key={`grid-${selectedProject}`}
                className="grid grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {currentProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} projectName={selectedProject || ""} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-${selectedProject}`}
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {currentProjects.map((project, index) => (
                  <ProjectListItem key={project.id} project={project} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
