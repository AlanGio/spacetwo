"use client"

import DetailCardPageContainer from "../containers/DetailCardPageContainer"

interface DetailCardPageProps {
  projectName: string
  cardId: string
}

export default function DetailCardPage({ projectName, cardId }: DetailCardPageProps) {
  return <DetailCardPageContainer projectName={projectName} cardId={cardId} />
}
