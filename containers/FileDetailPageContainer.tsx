"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FileDetailPagePresentation from "../components/presentations/FileDetailPagePresentation"
import { dataService, type FileDetail, type SidebarProfile } from "../lib/data-service"
import { toSlug } from "../lib/url-utils"

interface FileDetailPageContainerProps {
  fileId: string
  projectName?: string
}

export default function FileDetailPageContainer({ fileId, projectName }: FileDetailPageContainerProps) {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isUsersOpen, setIsUsersOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [sidebarProfiles, setSidebarProfiles] = useState<SidebarProfile[]>([])
  const [fileData, setFileData] = useState<FileDetail | null>(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const profiles = await dataService.getSidebarProfiles()

        // Use different method based on whether we have project context
        const file = projectName
          ? await dataService.getFileByProjectAndId(projectName, fileId)
          : await dataService.getFileById(fileId)

        setSidebarProfiles(profiles)
        setFileData(file)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
        setLoading(false)
      }
    }

    fetchData()
  }, [fileId, projectName])

  const handleSidebarClick = (profile: SidebarProfile) => {
    router.push(`/project/${toSlug(profile.name)}`)
  }

  const handleBackToCommunity = () => {
    if (projectName) {
      router.push(`/project/${toSlug(projectName)}`)
    } else {
      router.push("/")
    }
  }

  const handleChatToggle = () => {
    if (isUsersOpen) setIsUsersOpen(false)
    if (isAddOpen) setIsAddOpen(false)
    setIsChatOpen(!isChatOpen)
  }

  const handleUsersToggle = () => {
    if (isChatOpen) setIsChatOpen(false)
    if (isAddOpen) setIsAddOpen(false)
    setIsUsersOpen(!isUsersOpen)
  }

  const handleAddToggle = () => {
    if (isChatOpen) setIsChatOpen(false)
    if (isUsersOpen) setIsUsersOpen(false)
    setIsAddOpen(!isAddOpen)
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#111111] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-[#827989]">Loading file...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-[#111111] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#5865f2] rounded hover:bg-[#4752c4]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <FileDetailPagePresentation
      fileId={fileId}
      projectName={projectName}
      fileData={fileData}
      sidebarProfiles={sidebarProfiles}
      onSidebarClick={handleSidebarClick}
      onBackToCommunity={handleBackToCommunity}
      isChatOpen={isChatOpen}
      isUsersOpen={isUsersOpen}
      isAddOpen={isAddOpen}
      isLiked={isLiked}
      onChatToggle={handleChatToggle}
      onUsersToggle={handleUsersToggle}
      onAddToggle={handleAddToggle}
      onLikeToggle={() => setIsLiked(!isLiked)}
    />
  )
}
