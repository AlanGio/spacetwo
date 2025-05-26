"use client"

import { motion, AnimatePresence } from "framer-motion"
import Navigation from "./Navigation"
import CommunityCard from "./CommunityCard"

interface CommunityCardData {
  id: number
  image: string
  title: string
  author: string
  avatar: string
  likes: number
  comments: number
  appIcon: string
  category: string
}

interface CommunityViewProps {
  navigationItems: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
  filteredCards: CommunityCardData[]
}

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
}

export default function CommunityView({
  navigationItems,
  activeFilter,
  onFilterChange,
  filteredCards,
}: CommunityViewProps) {
  return (
    <>
      <Navigation
        items={navigationItems}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        itemCount={filteredCards.length}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="grid grid-cols-3 gap-6 mb-18"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {filteredCards.length > 0 ? (
                <>
                  {filteredCards[0] && (
                    <CommunityCard
                      card={filteredCards[0]}
                      className="col-span-1"
                      index={0}
                      activeFilter={activeFilter}
                    />
                  )}
                  {filteredCards[1] && (
                    <CommunityCard
                      card={filteredCards[1]}
                      className="col-span-2"
                      index={1}
                      activeFilter={activeFilter}
                    />
                  )}
                  {filteredCards.slice(2).map((card, index) => (
                    <CommunityCard
                      key={card.id}
                      card={card}
                      className="col-span-1"
                      index={index + 2}
                      activeFilter={activeFilter}
                    />
                  ))}
                </>
              ) : (
                <motion.div
                  className="col-span-3 text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <p className="text-[#827989] text-lg">No items found for "{activeFilter}"</p>
                  <p className="text-[#827989] text-sm mt-2">Try selecting a different category</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
