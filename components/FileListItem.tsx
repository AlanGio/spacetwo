"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FileImage, Video, Palette, Clock, Users } from "lucide-react";
import { toSlug } from "../lib/url-utils";

interface DetailFile {
  id: string;
  name: string;
  type: "image" | "video" | "design";
  preview: string;
  lastEdited: string;
  collaborators: {
    id: number;
    avatar: string;
    name: string;
  }[];
  additionalCollaborators?: number;
}

interface FileListItemProps {
  file: DetailFile;
  projectName: string;
  onRemove?: (fileId: string) => void;
}

const fileItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
  hover: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const getFileIcon = (type: string) => {
  switch (type) {
    case "image":
      return <FileImage className="w-4 h-4" />;
    case "video":
      return <Video className="w-4 h-4" />;
    case "design":
      return <Palette className="w-4 h-4" />;
    default:
      return <FileImage className="w-4 h-4" />;
  }
};

const getFileTypeColor = (type: string) => {
  switch (type) {
    case "image":
      return "text-blue-400";
    case "video":
      return "text-red-400";
    case "design":
      return "text-purple-400";
    default:
      return "text-gray-400";
  }
};

const FileListItem: React.FC<FileListItemProps> = ({
  file,
  projectName,
  onRemove,
}) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    setIsNavigating(true);
    router.push(`/project/${toSlug(projectName)}/file/${file.id}`);
  };

  return (
    <motion.div
      className={`group cursor-pointer touch-manipulation ${
        isNavigating ? "opacity-60" : ""
      }`}
      variants={fileItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors relative">
        {/* Thumbnail */}
        <div className="relative w-16 sm:w-24 h-12 sm:h-16 rounded-lg flex-shrink-0 overflow-hidden">
          <Image
            src={file.preview || "/placeholder.svg"}
            alt={file.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
            <div className="w-6 sm:w-7 h-6 sm:h-7 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
              {getFileIcon(file.type)}
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm sm:text-base truncate">
            {file.name}
          </h3>
          <p className="text-[#827989] text-xs sm:text-sm">{file.lastEdited}</p>
        </div>

        {/* Remove Button */}
        {onRemove && (
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#333333] rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(file.id);
            }}
          >
            <svg
              className="w-4 h-4 text-[#827989] hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Loading Spinner */}
        {isNavigating && (
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="w-6 sm:w-8 h-6 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileListItem;
