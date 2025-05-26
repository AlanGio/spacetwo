"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProjectPagePresentation from "../components/presentations/ProjectPagePresentation"
import { dataService, type Project, type SidebarProfile } from "../lib/data-service"
import { toSlug } from "../lib/url-utils"

interface ProjectPageContainerProps {
  projectName: string
}

export default function ProjectPageContainer({ projectName }: ProjectPageContainerProps) {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isUsersOpen, setIsUsersOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [sidebarProfiles, setSidebarProfiles] = useState<SidebarProfile[]>([])
  const [currentProjects, setCurrentProjects] = useState<Project[]>([])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [profiles, projects] = await Promise.all([
          dataService.getSidebarProfiles(),
          dataService.getProjectsByName(projectName),
        ])

        setSidebarProfiles(profiles)
        setCurrentProjects(projects)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
        setLoading(false)
      }
    }

    fetchData()
  }, [projectName])

  const handleSidebarClick = (profile: SidebarProfile) => {
    router.push(`/project/${toSlug(profile.name)}`)
  }

  const handleBackToCommunity = () => {
    router.push("/")
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
          <p className="text-[#827989]">Loading project...</p>
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
    <ProjectPagePresentation
      projectName={projectName}
      sidebarProfiles={sidebarProfiles}
      currentProjects={currentProjects}
      onSidebarClick={handleSidebarClick}
      onBackToCommunity={handleBackToCommunity}
      isChatOpen={isChatOpen}
      isUsersOpen={isUsersOpen}
      isAddOpen={isAddOpen}
      onChatToggle={handleChatToggle}
      onUsersToggle={handleUsersToggle}
      onAddToggle={handleAddToggle}
    />
  )
}
