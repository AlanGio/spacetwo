"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toSlug } from "../lib/url-utils";

interface ProjectFile {
  id: number;
  image: string;
  type: string;
  orientation: string;
}

interface ProjectCardData {
  id: number;
  title: string;
  fileCount: number;
  lastUpdated: string;
  isLive: boolean;
  files: ProjectFile[];
}

interface ProjectListItemProps {
  project: ProjectCardData;
  index: number;
  projectName: string;
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
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const thumbnailVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    },
  },
};

export default function ProjectListItem({
  project,
  index,
  projectName,
}: ProjectListItemProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleProjectClick = async () => {
    setIsNavigating(true);

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Navigate to project detail page
    if (projectName) {
      router.push(`/project/${toSlug(projectName)}/${project.id}`);
    }
  };

  return (
    <motion.div
      className={`group cursor-pointer touch-manipulation ${
        isNavigating ? "opacity-60" : ""
      }`}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      custom={index}
      onClick={handleProjectClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors">
        {/* Mobile: Top row with thumbnail and title */}
        <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
          {/* Thumbnail */}
          <div
            className="relative w-16 sm:w-24 h-12 sm:h-16 rounded-lg flex-shrink-0 overflow-hidden"
            style={{
              background:
                "linear-gradient(238.99deg, rgba(49, 88, 107, 0.3) -14.89%, rgba(141, 110, 42, 0.3) 124.21%)",
            }}
          >
            <motion.div
              variants={thumbnailVariants}
              whileHover="hover"
              className="w-full h-full p-1"
            >
              <div className="grid grid-cols-2 gap-0.5 sm:gap-1 h-full">
                {project.files.slice(0, 4).map((file, fileIndex) => (
                  <div
                    key={file.id}
                    className="relative overflow-hidden rounded-sm"
                  >
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
            <h3 className="text-white font-medium text-base sm:text-lg truncate group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            {/* Mobile: Show file count under title */}
            <p className="text-[#827989] text-xs sm:hidden mt-1">
              {project.files.length} files
            </p>
          </div>

          {/* Live Status - Always visible */}
          <div className="flex-shrink-0">
            {project.isLive && (
              <div className="px-2 sm:px-3 py-1 bg-[#666666] rounded-full text-xs text-white font-medium flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#26c940] rounded-full"></div>
                <span className="hidden sm:inline">LIVE</span>
                <span className="sm:hidden">●</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Bottom row with meta info (hidden on mobile) */}
        <div className="hidden sm:flex sm:items-center sm:gap-6">
          {/* File Count - Desktop only */}
          <div className="flex-shrink-0 text-[#827989] text-sm min-w-[60px] text-center">
            {project.files.length} files
          </div>

          {/* Last Updated - Desktop only */}
          <div className="flex-shrink-0 text-[#827989] text-sm min-w-[120px] text-right">
            Updated {project.lastUpdated}
          </div>
        </div>

        {/* Mobile: Last updated info */}
        <div className="sm:hidden flex items-center justify-between">
          <p className="text-[#827989] text-xs">
            Updated {project.lastUpdated}
          </p>

          {/* Loading indicator */}
          {isNavigating && (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Desktop: Loading indicator */}
        {isNavigating && (
          <div className="hidden sm:block flex-shrink-0">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
