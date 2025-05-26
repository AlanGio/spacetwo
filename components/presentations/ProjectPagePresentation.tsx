"use client"

import Header from "../Header"
import Sidebar from "../Sidebar"
import ProjectView from "../ProjectView"
import ChatPanel from "../ChatPanel"
import UsersPanel from "../UsersPanel"
import AddNewPanel from "../AddNewPanel"
import type { Project, SidebarProfile } from "../../lib/data-service"

interface ProjectPagePresentationProps {
  projectName: string
  sidebarProfiles: SidebarProfile[]
  currentProjects: Project[]
  onSidebarClick: (profile: SidebarProfile) => void
  onBackToCommunity: () => void
  isChatOpen: boolean
  isUsersOpen: boolean
  isAddOpen: boolean
  onChatToggle: () => void
  onUsersToggle: () => void
  onAddToggle: () => void
}

export default function ProjectPagePresentation({
  projectName,
  sidebarProfiles,
  currentProjects,
  onSidebarClick,
  onBackToCommunity,
  isChatOpen,
  isUsersOpen,
  isAddOpen,
  onChatToggle,
  onUsersToggle,
  onAddToggle,
}: ProjectPagePresentationProps) {
  const isPanelOpen = isChatOpen || isUsersOpen || isAddOpen

  return (
    <div className="h-screen bg-[#111111] text-white flex flex-col overflow-hidden">
      <Header
        currentView="project"
        selectedProject={projectName}
        onBackToCommunity={onBackToCommunity}
        onChatToggle={onChatToggle}
        onUsersToggle={onUsersToggle}
        onAddToggle={onAddToggle}
        isChatOpen={isChatOpen}
        isUsersOpen={isUsersOpen}
        isAddOpen={isAddOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar profiles={sidebarProfiles} selectedProject={projectName} onProfileClick={onSidebarClick} />

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${isPanelOpen ? "w-2/3" : "w-full"}`}
          >
            <ProjectView selectedProject={projectName} currentProjects={currentProjects} />
          </div>

          {/* Chat Panel */}
          {isChatOpen && (
            <div className="w-1/3 flex-shrink-0">
              <ChatPanel projectName={projectName} isOpen={isChatOpen} onClose={() => onChatToggle()} />
            </div>
          )}

          {/* Users Panel */}
          {isUsersOpen && (
            <div className="w-1/3 flex-shrink-0">
              <UsersPanel projectName={projectName} isOpen={isUsersOpen} onClose={() => onUsersToggle()} />
            </div>
          )}

          {/* Add New Panel */}
          {isAddOpen && (
            <div className="w-1/3 flex-shrink-0">
              <AddNewPanel
                projectName={projectName}
                isOpen={isAddOpen}
                onClose={() => onAddToggle()}
                availableProjects={currentProjects}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
