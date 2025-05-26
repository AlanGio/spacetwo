"use client"

import Header from "../Header"
import Sidebar from "../Sidebar"
import CommunityView from "../CommunityView"
import AddNewPanel from "../AddNewPanel"
import type { CommunityCard, SidebarProfile } from "../../lib/data-service"

interface HomePagePresentationProps {
  navigationItems: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  filteredCards: CommunityCard[]
  sidebarProfiles: SidebarProfile[]
  onSidebarClick: (profile: SidebarProfile) => void
  onBackToCommunity: () => void
  isAddOpen: boolean
  onAddToggle: () => void
}

export default function HomePagePresentation({
  navigationItems,
  activeFilter,
  onFilterChange,
  filteredCards,
  sidebarProfiles,
  onSidebarClick,
  onBackToCommunity,
  isAddOpen,
  onAddToggle,
}: HomePagePresentationProps) {
  return (
    <div className="h-screen bg-[#111111] text-white flex flex-col overflow-hidden">
      <Header
        currentView="community"
        selectedProject={null}
        onBackToCommunity={onBackToCommunity}
        onAddToggle={onAddToggle}
        isAddOpen={isAddOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar profiles={sidebarProfiles} selectedProject={null} onProfileClick={onSidebarClick} />

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${isAddOpen ? "w-2/3" : "w-full"}`}
          >
            <CommunityView
              navigationItems={navigationItems}
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
              filteredCards={filteredCards}
            />
          </div>

          {/* Add New Panel */}
          {isAddOpen && (
            <div className="w-1/3 flex-shrink-0">
              <AddNewPanel isOpen={isAddOpen} onClose={() => onAddToggle()} availableProjects={[]} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
