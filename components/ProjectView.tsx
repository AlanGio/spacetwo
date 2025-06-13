"use client";

import { ChevronDown, Grid3X3, List, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectListItem from "./ProjectListItem";
import {
  uploadFiles,
  revokeObjectURLs,
  type UploadedFile,
} from "@/lib/file-service";
import { CustomToast, CustomToastContainer } from "./ui/toast";

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
  lastUpdatedTimestamp: number;
  likes: number;
  comments: number;
  isLive: boolean;
  files: ProjectFile[];
}

interface ProjectViewProps {
  selectedProject: string | null;
  currentProjects: ProjectCardData[];
}

type SortOption = "Last modified" | "Most Liked" | "Most Commented";

const sortOptions: SortOption[] = [
  "Last modified",
  "Most Liked",
  "Most Commented",
];

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

// Helper function to convert time strings to timestamps for sorting
const getTimestampFromString = (timeString: string): number => {
  const now = Date.now();

  if (timeString.includes("mins ago")) {
    const minutes = Number.parseInt(timeString.match(/(\d+)/)?.[0] || "0");
    return now - minutes * 60 * 1000;
  } else if (timeString.includes("hour")) {
    const hours = Number.parseInt(timeString.match(/(\d+)/)?.[0] || "0");
    return now - hours * 60 * 60 * 1000;
  } else if (timeString.includes("day")) {
    const days = Number.parseInt(timeString.match(/(\d+)/)?.[0] || "0");
    return now - days * 24 * 60 * 60 * 1000;
  }

  return now;
};

export default function ProjectView({
  selectedProject,
  currentProjects,
}: ProjectViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("Last modified");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState<CustomToast[]>([]);
  const dragCounter = useRef(0);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Enhance projects with mock data for sorting
  const enhancedProjects: ProjectCardData[] = currentProjects.map(
    (project) => ({
      ...project,
      lastUpdatedTimestamp: getTimestampFromString(project.lastUpdated),
      likes: Math.floor(Math.random() * 150) + 20,
      comments: Math.floor(Math.random() * 40) + 5,
    })
  );

  // Sort projects based on selected option
  const sortedProjects = [...enhancedProjects].sort((a, b) => {
    switch (sortBy) {
      case "Last modified":
        return b.lastUpdatedTimestamp - a.lastUpdatedTimestamp;
      case "Most Liked":
        return b.likes - a.likes;
      case "Most Commented":
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setIsDropdownOpen(false);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Global drag enter");
    if (e.dataTransfer?.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Global drag leave");

    // Only set dragging to false if we're leaving the window
    if (e.relatedTarget === null) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const addToast = useCallback((toast: Omit<CustomToast, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drop event triggered");
    setIsDragging(false);

    if (!e.dataTransfer?.files.length) return;

    const files = Array.from(e.dataTransfer.files);
    console.log(
      "Dropped files:",
      files.map((f) => f.name)
    );

    setIsUploading(true);
    try {
      const result = await uploadFiles(files);

      if (result.success) {
        addToast({
          type: "success",
          title: "Files uploaded successfully",
          description: `${result.files.length} file${
            result.files.length === 1 ? "" : "s"
          } uploaded`,
        });

        console.log("Uploaded files:", result.files);
      }

      if (result.errors.length > 0) {
        result.errors.forEach((error) => {
          addToast({
            type: "error",
            title: `Failed to upload ${error.fileName}`,
            description: error.error,
          });
        });
      }

      setTimeout(() => {
        revokeObjectURLs(result.files);
      }, 5000);
    } catch (error) {
      addToast({
        type: "error",
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    // Add event listeners to the document
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      // Clean up event listeners
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, []); // Empty dependency array since we don't use any external values

  return (
    <div className="flex flex-col h-full" ref={dropZoneRef}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#333333] bg-[#111111] flex-shrink-0">
        {/* Sort Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="text-[#827989] hover:text-white hover:bg-transparent flex items-center gap-2 text-sm sm:text-base p-2 sm:p-3"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
            {isDropdownOpen && (
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
            key={sortedProjects.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {sortedProjects.length}{" "}
            {sortedProjects.length === 1 ? "project" : "projects"}
          </motion.span>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1.5 sm:p-2 ${
              viewMode === "grid"
                ? "text-white bg-[#333333]"
                : "text-[#827989] hover:text-white"
            }`}
            onClick={() => setViewMode("grid")}
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
            onClick={() => setViewMode("list")}
          >
            <List className="w-3 sm:w-4 h-3 sm:h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {/* Drag & Drop Overlay */}
        <AnimatePresence>
          {(isDragging || isUploading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="border-2 border-dashed border-[#444444] rounded-xl p-12 bg-[#1a1a1a]/50">
                <div className="text-center">
                  <Upload
                    className={`w-16 h-16 text-[#827989] mx-auto mb-6 ${
                      isUploading ? "animate-bounce" : ""
                    }`}
                  />
                  <p className="text-white text-xl font-medium mb-2">
                    {isUploading ? "Uploading files..." : "Drop files here"}
                  </p>
                  <p className="text-[#827989] text-sm">
                    Supported formats: PNG, JPG, GIF, SVG
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key={`grid-${selectedProject}-${sortBy}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sortedProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    projectName={selectedProject || ""}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-${selectedProject}-${sortBy}`}
                className="space-y-3 sm:space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {sortedProjects.map((project, index) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    index={index}
                    projectName={selectedProject || ""}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
      <CustomToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
