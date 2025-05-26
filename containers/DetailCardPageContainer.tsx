"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DetailCardView from "../components/DetailCardView"
import { dataService, type SidebarProfile } from "../lib/data-service"
import { toSlug } from "../lib/url-utils"

interface DetailCardPageContainerProps {
  projectName: string
  cardId: string
}

export default function DetailCardPageContainer({ projectName, cardId }: DetailCardPageContainerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [sidebarProfiles, setSidebarProfiles] = useState<SidebarProfile[]>([])
  const [projectData, setProjectData] = useState<{
    id: string
    title: string
    description: string
    image: string
    files: { id: string; image: string }[]
  } | null>(null)

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

        // Find the specific project by cardId
        const project = projects.find((p) => p.id.toString() === cardId)
        if (project) {
          setProjectData({
            id: project.id.toString(),
            title: project.title,
            description: `${project.files.length} files • Last updated ${project.lastUpdated}`,
            image: project.files[0]?.image || "",
            files: project.files.map((f) => ({ id: f.id.toString(), image: f.image })),
          })
        }

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
        setLoading(false)
      }
    }

    fetchData()
  }, [projectName, cardId])

  const handleSidebarClick = (profile: SidebarProfile) => {
    router.push(`/project/${toSlug(profile.name)}`)
  }

  const handleBackToCommunity = () => {
    router.push(`/project/${toSlug(projectName)}`)
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#111111] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-[#827989]">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !projectData) {
    return (
      <div className="h-screen bg-[#111111] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error || "Project not found"}</p>
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
    <div className="h-screen bg-[#111111] text-white flex overflow-hidden">
      <Sidebar profiles={sidebarProfiles} selectedProject={projectName} onProfileClick={handleSidebarClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView="project" selectedProject={projectName} onBackToCommunity={handleBackToCommunity} />
        <DetailCardView projectName={projectName} cardId={cardId} projectData={projectData} />
      </div>
    </div>
  )
}

// Import components
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
