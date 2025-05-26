"use client"

import Image from "next/image"
import { motion } from "framer-motion"

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

interface ProjectListItemProps {
  project: ProjectCardData
  index: number
}

const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
}

const thumbnailVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    },
  },
}

export default function ProjectListItem({ project, index }: ProjectListItemProps) {
  return (
    <motion.div
      className="group cursor-pointer"
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      custom={index}
    >
      <div className="flex items-center gap-6 p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors">
        {/* Thumbnail */}
        <div
          className="relative w-24 h-16 rounded-lg flex-shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(238.99deg, rgba(49, 88, 107, 0.3) -14.89%, rgba(141, 110, 42, 0.3) 124.21%)",
          }}
        >
          <motion.div variants={thumbnailVariants} whileHover="hover" className="w-full h-full p-1">
            <div className="grid grid-cols-2 gap-1 h-full">
              {project.files.slice(0, 4).map((file, fileIndex) => (
                <div key={file.id} className="relative overflow-hidden rounded-sm">
                  <Image
                    src={file.image || "/placeholder.svg"}
                    alt={`Project file ${fileIndex + 1}`}
                    width={50}
                    height={30}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Project Title */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-lg truncate">{project.title}</h3>
        </div>

        {/* Live Status */}
        <div className="flex-shrink-0">
          {project.isLive && (
            <div className="px-3 py-1 bg-[#666666] rounded-full text-xs text-white font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-[#26c940] rounded-full"></div>
              LIVE
            </div>
          )}
        </div>

        {/* File Count */}
        <div className="flex-shrink-0 text-[#827989] text-sm min-w-[60px] text-center">
          {project.files.length} files
        </div>

        {/* Last Updated */}
        <div className="flex-shrink-0 text-[#827989] text-sm min-w-[120px] text-right">
          Updated {project.lastUpdated}
        </div>
      </div>
    </motion.div>
  )
}
