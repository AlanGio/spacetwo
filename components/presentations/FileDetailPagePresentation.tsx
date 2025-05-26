"use client"

import { Play, Heart, MessageCircle, Share, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import Header from "../Header"
import Sidebar from "../Sidebar"
import ChatPanel from "../ChatPanel"
import UsersPanel from "../UsersPanel"
import AddNewPanel from "../AddNewPanel"
import type { FileDetail, SidebarProfile } from "../../lib/data-service"

interface FileDetailPagePresentationProps {
  fileId: string
  projectName?: string
  fileData: FileDetail | null
  sidebarProfiles: SidebarProfile[]
  onSidebarClick: (profile: SidebarProfile) => void
  onBackToCommunity: () => void
  isChatOpen: boolean
  isUsersOpen: boolean
  isAddOpen: boolean
  isLiked: boolean
  onChatToggle: () => void
  onUsersToggle: () => void
  onAddToggle: () => void
  onLikeToggle: () => void
}

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const tagVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
}

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}

export default function FileDetailPagePresentation({
  fileId,
  projectName,
  fileData,
  sidebarProfiles,
  onSidebarClick,
  onBackToCommunity,
  isChatOpen,
  isUsersOpen,
  isAddOpen,
  isLiked,
  onChatToggle,
  onUsersToggle,
  onAddToggle,
  onLikeToggle,
}: FileDetailPagePresentationProps) {
  const isPanelOpen = isChatOpen || isUsersOpen || isAddOpen

  // Handle file not found
  if (!fileData) {
    return (
      <motion.div
        className="h-screen bg-[#111111] text-white flex flex-col overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Header
          currentView="project"
          selectedProject="File Not Found"
          onBackToCommunity={onBackToCommunity}
          onChatToggle={() => {}}
          onUsersToggle={() => {}}
          onAddToggle={() => {}}
          isChatOpen={false}
          isUsersOpen={false}
          isAddOpen={false}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar profiles={sidebarProfiles} selectedProject={projectName || null} onProfileClick={() => {}} />
          <motion.div className="flex-1 flex items-center justify-center" variants={contentVariants}>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">File Not Found</h1>
              <p className="text-[#827989] mb-6">The file you're looking for doesn't exist.</p>
              <Button onClick={onBackToCommunity} className="bg-[#5865f2] hover:bg-[#4752c4] text-white">
                Go Back
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="h-screen bg-[#111111] text-white flex flex-col overflow-hidden"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Header
        currentView="project"
        selectedProject={`${projectName || "Community"} | ${fileData.title}`}
        onBackToCommunity={onBackToCommunity}
        onChatToggle={onChatToggle}
        onUsersToggle={onUsersToggle}
        onAddToggle={onAddToggle}
        isChatOpen={isChatOpen}
        isUsersOpen={isUsersOpen}
        isAddOpen={isAddOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <motion.div variants={sidebarVariants}>
          <Sidebar profiles={sidebarProfiles} selectedProject={projectName || null} onProfileClick={onSidebarClick} />
        </motion.div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${isPanelOpen ? "w-2/3" : "w-full"}`}
          >
            <div className="flex-1 overflow-y-auto">
              <motion.div className="max-w-6xl mx-auto p-8" variants={contentVariants}>
                {/* File Header */}
                <motion.div className="flex items-center justify-between mb-8" variants={contentVariants}>
                  <div className="flex items-center gap-6">
                    <motion.h1
                      className="text-4xl font-bold text-white"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      {fileData.title}
                    </motion.h1>

                    <motion.div
                      className="flex items-center gap-4 text-[#827989]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {fileData.type === "animation" && (
                        <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white">
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      )}
                      <span className="text-sm">Shots</span>
                      <div className="w-6 h-6 rounded-full border border-[#333333]" />
                    </motion.div>
                  </div>

                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Image
                      src={fileData.author.avatar || "/placeholder.svg"}
                      alt={fileData.author.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <Image
                      src="https://picsum.photos/seed/collab1/100/100"
                      alt="Collaborator"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover -ml-3 border-2 border-[#111111]"
                    />
                  </motion.div>
                </motion.div>

                {/* Main Image/Video */}
                <motion.div
                  className="relative rounded-2xl overflow-hidden mb-8 bg-[#111111]"
                  variants={imageVariants}
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={fileData.image || "/placeholder.svg"}
                    alt={fileData.title}
                    fill
                    className="object-cover"
                  />
                  {fileData.type === "animation" && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        size="lg"
                        className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                      >
                        <Play className="w-6 h-6 ml-1" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div className="mb-8" variants={contentVariants}>
                  <p className="text-[#cccccc] text-lg leading-relaxed max-w-4xl">{fileData.description}</p>
                </motion.div>

                {/* Tags */}
                <motion.div
                  className="flex flex-wrap gap-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {fileData.tags.map((tag, index) => (
                    <motion.button
                      key={tag}
                      className="px-4 py-2 bg-transparent border border-[#333333] rounded-full text-[#827989] hover:text-white hover:border-[#666666] transition-colors"
                      variants={tagVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      custom={index}
                      transition={{ delay: 0.7 + index * 0.05 }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Actions */}
                <motion.div
                  className="flex items-center justify-between pt-6 border-t border-[#333333]"
                  variants={contentVariants}
                >
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-2 ${
                        isLiked ? "text-red-500" : "text-[#827989] hover:text-white"
                      }`}
                      onClick={onLikeToggle}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      {fileData.stats.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#827989] hover:text-white flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {fileData.stats.comments}
                    </Button>
                    <span className="text-[#827989] text-sm">{fileData.stats.views} views</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white">
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#827989] hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Author Info */}
                <motion.div
                  className="flex items-center gap-4 mt-8 p-6 bg-[#1a1a1a] rounded-xl"
                  variants={contentVariants}
                >
                  <Image
                    src={fileData.author.avatar || "/placeholder.svg"}
                    alt={fileData.author.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{fileData.author.name}</h3>
                    <p className="text-[#827989]">{fileData.author.username}</p>
                    <p className="text-[#827989] text-sm mt-1">Created {fileData.createdAt}</p>
                  </div>
                  <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white">Follow</Button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Chat Panel */}
          {isChatOpen && (
            <div className="w-1/3 flex-shrink-0">
              <ChatPanel projectName={projectName || "Community"} isOpen={isChatOpen} onClose={() => onChatToggle()} />
            </div>
          )}

          {/* Users Panel */}
          {isUsersOpen && (
            <div className="w-1/3 flex-shrink-0">
              <UsersPanel
                projectName={projectName || "Community"}
                isOpen={isUsersOpen}
                onClose={() => onUsersToggle()}
              />
            </div>
          )}

          {/* Add New Panel */}
          {isAddOpen && (
            <div className="w-1/3 flex-shrink-0">
              <AddNewPanel
                projectName={projectName}
                isOpen={isAddOpen}
                onClose={() => onAddToggle()}
                availableProjects={[]}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
