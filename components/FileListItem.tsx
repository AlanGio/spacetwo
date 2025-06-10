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

const FileListItem: React.FC<FileListItemProps> = ({ file, projectName }) => {
  const router = useRouter();
  const [navigatingFileId, setNavigatingFileId] = useState<string | null>(null);

  const handleFileClick = async (fileId: string) => {
    setNavigatingFileId(fileId);
    await new Promise((resolve) => setTimeout(resolve, 200));
    router.push(`/project/${toSlug(projectName)}/file/${fileId}`);
  };

  const isNavigating = navigatingFileId === file.id;

  return (
    <motion.div
      variants={fileItemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      className={`group cursor-pointer touch-manipulation ${
        isNavigating ? "opacity-60" : ""
      }`}
      onClick={() => handleFileClick(file.id)}
    >
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-[#1a1a1a] transition-all duration-200 border border-transparent hover:border-[#333333]">
        {/* File Preview */}
        <div className="relative w-12 sm:w-16 h-12 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#222222]">
          {file.preview ? (
            <Image
              src={file.preview}
              alt={file.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#333333] to-[#222222]">
              <div className={`${getFileTypeColor(file.type)}`}>
                {getFileIcon(file.type)}
              </div>
            </div>
          )}

          {/* File Type Badge */}
          <div className="absolute top-1 right-1">
            <div
              className={`w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center ${getFileTypeColor(
                file.type
              )}`}
            >
              {getFileIcon(file.type)}
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
            {/* File Name */}
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium text-sm sm:text-base truncate group-hover:text-blue-400 transition-colors">
                {file.name}
              </h4>

              {/* Mobile: Show type and last edited */}
              <div className="sm:hidden flex items-center gap-2 mt-1">
                <span
                  className={`text-xs capitalize ${getFileTypeColor(
                    file.type
                  )}`}
                >
                  {file.type}
                </span>
                <span className="text-[#827989] text-xs">•</span>
                <div className="flex items-center gap-1 text-[#827989] text-xs">
                  <Clock className="w-3 h-3" />
                  {file.lastEdited}
                </div>
              </div>
            </div>

            {/* Desktop: Metadata */}
            <div className="hidden sm:flex sm:items-center sm:gap-6">
              {/* File Type */}
              <div
                className={`flex items-center gap-1 text-xs capitalize ${getFileTypeColor(
                  file.type
                )}`}
              >
                {getFileIcon(file.type)}
                {file.type}
              </div>

              {/* Last Edited */}
              <div className="flex items-center gap-1 text-[#827989] text-xs">
                <Clock className="w-3 h-3" />
                {file.lastEdited}
              </div>
            </div>
          </div>

          {/* Collaborators */}
          <div className="flex items-center gap-2 mt-2 sm:mt-3">
            <div className="flex -space-x-2">
              {file.collaborators.slice(0, 3).map((collaborator, index) => (
                <div
                  key={collaborator.id}
                  className="relative"
                  style={{ zIndex: 3 - index }}
                >
                  <Image
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    width={24}
                    height={24}
                    className="w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 border-[#111111] object-cover"
                  />
                </div>
              ))}

              {file.additionalCollaborators &&
                file.additionalCollaborators > 0 && (
                  <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#333333] border-2 border-[#111111] flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      +{file.additionalCollaborators}
                    </span>
                  </div>
                )}
            </div>

            <div className="flex items-center gap-1 text-[#827989] text-xs">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">
                {file.collaborators.length +
                  (file.additionalCollaborators || 0)}{" "}
                collaborator
                {file.collaborators.length +
                  (file.additionalCollaborators || 0) !==
                1
                  ? "s"
                  : ""}
              </span>
              <span className="sm:hidden">
                {file.collaborators.length +
                  (file.additionalCollaborators || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isNavigating && (
          <div className="flex-shrink-0">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileListItem;
