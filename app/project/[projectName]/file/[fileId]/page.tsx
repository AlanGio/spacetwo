"use client"

import FileDetailPageContainer from "../../../../../containers/FileDetailPageContainer"
import { getProjectNameFromSlug } from "../../../../../lib/url-utils"

interface ProjectFilePageProps {
  params: {
    projectName: string
    fileId: string
  }
}

export default function Page({ params }: ProjectFilePageProps) {
  const availableProjects = ["Spacetwo Studio", "Photoshop Projects", "Nike Space", "Design System", "Open Source"]
  const projectName = getProjectNameFromSlug(params.projectName, availableProjects)

  return <FileDetailPageContainer fileId={params.fileId} projectName={projectName} />
}
