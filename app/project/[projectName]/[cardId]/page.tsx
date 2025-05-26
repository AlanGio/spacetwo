"use client"

import DetailCardPage from "../../../../components/DetailCardPage"
import { getProjectNameFromSlug } from "../../../../lib/url-utils"

interface DetailCardPageProps {
  params: {
    projectName: string
    cardId: string
  }
}

export default function Page({ params }: DetailCardPageProps) {
  const availableProjects = ["Spacetwo Studio", "Photoshop Projects", "Nike Space", "Design System", "Open Source"]

  const projectName = getProjectNameFromSlug(params.projectName, availableProjects)
  const cardId = params.cardId
  return <DetailCardPage projectName={projectName} cardId={cardId} />
}
