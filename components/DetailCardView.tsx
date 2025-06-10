"use client";

import { useState } from "react";
import {
  ChevronDown,
  Grid3X3,
  List,
  ImageIcon,
  Play,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PresentationMode from "./PresentationMode";
import FileListItem from "./FileListItem";
import { useRouter } from "next/navigation";
import { toSlug } from "../lib/url-utils";

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
};

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
};

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
};

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
};

interface DetailFile {
  id: string;
  name: string;
  type: "image" | "video" | "design";
  preview: string;
  lastEdited: string;
  lastModifiedTimestamp: number;
  likes: number;
  comments: number;
  collaborators: {
    id: number;
    avatar: string;
    name: string;
  }[];
  additionalCollaborators?: number;
}

interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  files: { id: string; image: string }[];
}

interface DetailCardViewProps {
  projectName: string;
  cardId: string;
  projectData?: ProjectCardData;
}

type SortOption = "Last modified" | "Most Liked" | "Most Commented";

const sortOptions: SortOption[] = [
  "Last modified",
  "Most Liked",
  "Most Commented",
];

export default function DetailCardView({
  projectName,
  cardId,
  projectData,
}: DetailCardViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [navigatingFileId, setNavigatingFileId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("Last modified");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Generate files with mock data for sorting - keep original file IDs
  // Use useMemo or keep this stable to prevent re-sorting during navigation
  const baseFiles: DetailFile[] =
    projectData?.files.map((file, index) => {
      // Use file.id as seed for consistent random values
      const seed = Number.parseInt(file.id) || index;
      const randomMinutes = (seed * 37) % 1440; // Deterministic "random" based on file ID
      const randomLikes = ((seed * 73) % 200) + 10;
      const randomComments = ((seed * 41) % 50) + 1;

      return {
        id: file.id,
        name: `File ${file.id}`,
        type: (index % 3 === 0
          ? "image"
          : index % 3 === 1
          ? "video"
          : "design") as "image" | "video" | "design",
        preview: file.image,
        lastEdited: `Edited ${Math.floor(randomMinutes / 60) || 1} ${
          randomMinutes >= 60 ? "hours" : "minutes"
        } ago`,
        lastModifiedTimestamp: Date.now() - randomMinutes * 60 * 1000,
        likes: randomLikes,
        comments: randomComments,
        collaborators: [
          {
            id: 1,
            avatar: `https://picsum.photos/seed/user${file.id}1/100/100`,
            name: "User 1",
          },
          {
            id: 2,
            avatar: `https://picsum.photos/seed/user${file.id}2/100/100`,
            name: "User 2",
          },
        ],
        additionalCollaborators: seed % 4,
      };
    }) || [];

  // Sort files based on selected option - only when not navigating
  const sortedFiles = navigatingFileId
    ? baseFiles // Keep original order during navigation to prevent reordering
    : [...baseFiles].sort((a, b) => {
        switch (sortBy) {
          case "Last modified":
            return b.lastModifiedTimestamp - a.lastModifiedTimestamp;
          case "Most Liked":
            return b.likes - a.likes;
          case "Most Commented":
            return b.comments - a.comments;
          default:
            return 0;
        }
      });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 sm:w-5 h-4 sm:h-5" />;
      case "design":
        return (
          <div className="w-4 sm:w-5 h-4 sm:h-5 bg-[#5865f2] rounded flex items-center justify-center text-xs text-white">
            F
          </div>
        );
      default:
        return <ImageIcon className="w-4 sm:w-5 h-4 sm:h-5" />;
    }
  };

  const handleFileClick = async (fileId: string) => {
    console.log(`Clicking on file: ${fileId} in project: ${projectName}`);

    // Set navigating state immediately to prevent reordering
    setNavigatingFileId(fileId);

    // Navigate immediately without delay to prevent visual glitches
    router.push(`/project/${toSlug(projectName)}/file/${fileId}`);
  };

  const handleSortChange = (option: SortOption) => {
    // Don't allow sorting changes during navigation
    if (navigatingFileId) return;

    setSortBy(option);
    setIsDropdownOpen(false);
  };

  // Convert files for presentation mode
  const presentationFiles = projectData?.files || [];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#333333] bg-[#111111] flex-shrink-0">
        <h1 className="text-lg sm:text-2xl font-semibold text-white truncate pr-4">
          {projectData?.title || "Project Details"}
        </h1>
        <button
          className="p-0 border-0 bg-transparent hover:opacity-80 transition-opacity flex-shrink-0"
          onClick={() => setIsPresentationOpen(true)}
          disabled={!!navigatingFileId} // Disable during navigation
        >
          <Image
            src="/icons/display_mode.svg"
            alt="Display mode"
            width={110}
            height={26}
            className="w-20 sm:w-auto h-5 sm:h-6"
          />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#333333] bg-[#111111] flex-shrink-0">
        {/* Sort Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="text-[#827989] hover:text-white hover:bg-transparent flex items-center gap-2 text-sm sm:text-base p-2 sm:p-3"
            onClick={() =>
              !navigatingFileId && setIsDropdownOpen(!isDropdownOpen)
            } // Disable during navigation
            disabled={!!navigatingFileId}
          >
            <span className="truncate max-w-[120px] sm:max-w-none">
              {sortBy}
            </span>
            <ChevronDown
              className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && !navigatingFileId && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-0 mt-2 w-44 sm:w-48 bg-[#222222] border border-[#333333] rounded-lg shadow-lg z-10"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-[#827989] hover:text-white hover:bg-[#333333] transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-sm sm:text-base"
                    onClick={() => handleSortChange(option)}
                  >
                    <span>{option}</span>
                    {sortBy === option && (
                      <Check className="w-3 sm:w-4 h-3 sm:h-4 text-[#eefe05]" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <motion.span
            className="text-xs text-[#827989] hidden sm:inline"
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
            className={`p-1.5 sm:p-2 ${
              viewMode === "grid"
                ? "text-white bg-[#333333]"
                : "text-[#827989] hover:text-white"
            }`}
            onClick={() => !navigatingFileId && setViewMode("grid")} // Disable during navigation
            disabled={!!navigatingFileId}
          >
            <Grid3X3 className="w-3 sm:w-4 h-3 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1.5 sm:p-2 ${
              viewMode === "list"
                ? "text-white bg-[#333333]"
                : "text-[#827989] hover:text-white"
            }`}
            onClick={() => !navigatingFileId && setViewMode("list")} // Disable during navigation
            disabled={!!navigatingFileId}
          >
            <List className="w-3 sm:w-4 h-3 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Files Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6">
          <motion.div
            key={`${viewMode}-view-${sortBy}`}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                : "space-y-3 sm:space-y-4"
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {sortedFiles.map((file, index) =>
              viewMode === "grid" ? (
                <motion.div
                  key={file.id}
                  className="group cursor-pointer"
                  variants={cardVariants}
                  whileHover={navigatingFileId ? {} : "hover"} // Disable hover during navigation
                  whileTap={navigatingFileId ? {} : "tap"} // Disable tap during navigation
                  custom={index}
                  onClick={() => !navigatingFileId && handleFileClick(file.id)} // Prevent multiple clicks
                  style={{
                    pointerEvents: navigatingFileId ? "none" : "auto", // Disable all interactions during navigation
                  }}
                >
                  <div
                    className={`bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#222222] border border-[#333333] hover:border-[#444444] ${
                      navigatingFileId === file.id ? "opacity-70" : ""
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
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                        <div className="w-7 sm:w-8 h-7 sm:h-8 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                          {getFileIcon(file.type)}
                        </div>
                      </div>

                      {/* Stats Badge - Top Right */}
                      {sortBy !== "Last modified" && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white font-medium">
                            {sortBy === "Most Liked"
                              ? `${file.likes} ♥`
                              : `${file.comments} 💬`}
                          </div>
                        </div>
                      )}

                      {/* Loading overlay for navigating file */}
                      {navigatingFileId === file.id && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-6 sm:w-8 h-6 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start justify-between">
                        {/* File Info */}
                        <div className="flex-1 min-w-0 pr-2 sm:pr-3">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate mb-1">
                            {file.name}
                          </h3>
                          <p className="text-[#827989] text-xs sm:text-sm">
                            {file.lastEdited}
                          </p>
                        </div>

                        {/* Collaborators */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center -space-x-1.5 sm:-space-x-2">
                            {file.collaborators
                              .slice(0, 3)
                              .map((collaborator, idx) => (
                                <motion.div
                                  key={collaborator.id}
                                  className="relative"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 + idx * 0.05 }}
                                  whileHover={{ scale: 1.1, zIndex: 10 }}
                                >
                                  <Image
                                    src={
                                      collaborator.avatar || "/placeholder.svg"
                                    }
                                    alt={collaborator.name}
                                    width={24}
                                    height={24}
                                    className="w-6 sm:w-7 h-6 sm:h-7 rounded-full object-cover border-2 border-[#1a1a1a] hover:border-[#333333] transition-colors"
                                  />
                                </motion.div>
                              ))}
                            {file.additionalCollaborators &&
                              file.additionalCollaborators > 0 && (
                                <motion.div
                                  className="w-6 sm:w-7 h-6 sm:h-7 bg-[#333333] rounded-full flex items-center justify-center text-xs text-[#827989] font-medium border-2 border-[#1a1a1a]"
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
              ) : (
                <FileListItem
                  key={file.id}
                  file={file}
                  projectName={projectName}
                />
              )
            )}
          </motion.div>
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
      {isDropdownOpen && !navigatingFileId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </motion.div>
  );
}
