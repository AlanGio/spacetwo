"use client"

import ProjectPageContainer from "../../../containers/ProjectPageContainer"
import { getProjectNameFromSlug } from "../../../lib/url-utils"

interface ProjectPageProps {
  params: {
    projectName: string
  }
}

export default function Page({ params }: ProjectPageProps) {
  const availableProjects = ["Spacetwo Studio", "Photoshop Projects", "Nike Space", "Design System", "Open Source"]
  const projectName = getProjectNameFromSlug(params.projectName, availableProjects)

  return <ProjectPageContainer projectName={projectName} />
}
