"use client";

import { use } from "react";
import DetailCardPage from "../../../../components/DetailCardPage";
import { getProjectNameFromSlug } from "../../../../lib/url-utils";

interface DetailCardPageProps {
  params: Promise<{
    projectName: string;
    cardId: string;
  }>;
}

export default function Page({ params }: DetailCardPageProps) {
  const resolvedParams = use(params);
  const availableProjects = [
    "Spacetwo Studio",
    "Photoshop Projects",
    "Nike Space",
    "Design System",
    "Open Source",
  ];

  const projectName = getProjectNameFromSlug(
    resolvedParams.projectName,
    availableProjects
  );
  const cardId = resolvedParams.cardId;
  return <DetailCardPage projectName={projectName} cardId={cardId} />;
}
