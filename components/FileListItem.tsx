"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toSlug } from "../lib/url-utils"

interface DetailFile {
  id: string // Changed from number to string
  name: string
  type: "image" | "video" | "design"
  preview: string
  lastEdited: string
  collaborators: {
    id: number
    avatar: string
    name: string
  }[]
  additionalCollaborators?: number
}

interface FileListItemProps {
  file: DetailFile
  projectName: string
}

const FileListItem: React.FC<FileListItemProps> = ({ file, projectName }) => {
  const router = useRouter()
  const [navigatingFileId, setNavigatingFileId] = useState<string | null>(null)

  const handleFileClick = async (fileId: string) => {
    setNavigatingFileId(fileId)

    await new Promise((resolve) => setTimeout(resolve, 200))

    router.push(`/project/${toSlug(projectName)}/file/${fileId}`)
  }

  return (
    <div
      className={`cursor-pointer p-2 hover:bg-gray-100 ${navigatingFileId === file.id ? "bg-gray-200" : ""}`}
      onClick={() => handleFileClick(file.id)}
    >
      {file.name}
    </div>
  )
}

export default FileListItem
