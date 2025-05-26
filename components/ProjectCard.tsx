"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toSlug } from "../lib/url-utils"

interface ProjectFile {
  id: number
  image: string
  type: string
  orientation: string
}

interface ProjectCardData {
  id: number
  title: string
  fileCount: number
  lastUpdated: string
  isLive: boolean
  files: ProjectFile[]
}

interface ProjectCardProps {
  project: ProjectCardData
  index: number
  projectName?: string
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
}

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    },
  },
}

export default function ProjectCard({ project, index, projectName }: ProjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (projectName) {
      router.push(`/project/${toSlug(projectName)}/${project.id}`)
    }
  }

  const getLayoutPattern = (files: ProjectFile[]) => {
    if (files.length === 3) {
      return "three-images"
    } else if (files.length >= 4) {
      return "four-images"
    }
    return "default"
  }

  const layoutPattern = getLayoutPattern(project.files)

  return (
    <motion.div
      key={project.id}
      className="col-span-1"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      custom={index}
    >
      <div className="group cursor-pointer" onClick={() => handleCardClick()}>
        <div
          className="relative rounded-xl p-4 mb-3 h-80"
          style={{
            background: "linear-gradient(238.99deg, rgba(49, 88, 107, 0.3) -14.89%, rgba(141, 110, 42, 0.3) 124.21%)",
          }}
        >
          {project.isLive && (
            <div className="absolute top-3 right-3 z-10">
              <div className="px-3 py-1 bg-[#666666] rounded-full text-xs text-white font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-[#26c940] rounded-full"></div>
                LIVE
              </div>
            </div>
          )}

          {layoutPattern === "three-images" && (
            <div className="grid grid-cols-2 gap-3 h-full overflow-hidden">
              <div className="col-span-1 row-span-2">
                <motion.div variants={imageVariants} whileHover="hover" className="h-full">
                  <Image
                    src={project.files[0]?.image || "/placeholder.svg"}
                    alt="Main project file"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick()
                    }}
                  />
                </motion.div>
              </div>
              <div className="col-span-1 space-y-3">
                <motion.div variants={imageVariants} whileHover="hover" className="h-[calc(50%-4px)]">
                  <Image
                    src={project.files[1]?.image || "/placeholder.svg"}
                    alt="Project file 2"
                    width={200}
                    height={150}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick()
                    }}
                  />
                </motion.div>
                <motion.div variants={imageVariants} whileHover="hover" className="h-[calc(50%-4px)]">
                  <Image
                    src={project.files[2]?.image || "/placeholder.svg"}
                    alt="Project file 3"
                    width={200}
                    height={150}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick()
                    }}
                  />
                </motion.div>
              </div>
            </div>
          )}

          {layoutPattern === "four-images" && (
            <div className="grid grid-cols-2 gap-3 h-full overflow-hidden">
              <div className="col-span-1 row-span-2">
                <motion.div variants={imageVariants} whileHover="hover" className="h-full">
                  <Image
                    src={project.files[0]?.image || "/placeholder.svg"}
                    alt="Main project file"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick()
                    }}
                  />
                </motion.div>
              </div>
              <div className="col-span-1 space-y-3">
                <motion.div variants={imageVariants} whileHover="hover" className="h-[60%]">
                  <Image
                    src={project.files[1]?.image || "/placeholder.svg"}
                    alt="Project file 2"
                    width={200}
                    height={180}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick()
                    }}
                  />
                </motion.div>
                <div className="grid grid-cols-2 gap-2 h-[calc(40%-12px)]">
                  <motion.div variants={imageVariants} whileHover="hover" className="h-full">
                    <Image
                      src={project.files[2]?.image || "/placeholder.svg"}
                      alt="Project file 3"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick()
                      }}
                    />
                  </motion.div>
                  <div className="relative">
                    <motion.div variants={imageVariants} whileHover="hover" className="h-full">
                      <Image
                        src={project.files[3]?.image || "/placeholder.svg"}
                        alt="Project file 4"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCardClick()
                        }}
                      />
                    </motion.div>
                    {project.files.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">+{project.files.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {layoutPattern === "default" && (
            <div className="grid grid-cols-2 gap-2 h-full overflow-hidden">
              {project.files.slice(0, 4).map((file: ProjectFile, fileIndex: number) => (
                <motion.div key={file.id} variants={imageVariants} whileHover="hover" className="h-full">
                  <Image
                    src={file.image || "/placeholder.svg"}
                    alt={`Project file ${fileIndex + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick()
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-white font-medium">{project.title}</h3>
          <p className="text-[#827989] text-sm">
            {project.files.length} files • Updated {project.lastUpdated}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
