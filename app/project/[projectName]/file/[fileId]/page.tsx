"use client";

import { use } from "react";
import FileDetailPageContainer from "../../../../../containers/FileDetailPageContainer";
import { getProjectNameFromSlug } from "../../../../../lib/url-utils";

interface ProjectFilePageProps {
  params: Promise<{
    projectName: string;
    fileId: string;
  }>;
}

export default function Page({ params }: ProjectFilePageProps) {
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

  return (
    <FileDetailPageContainer
      fileId={resolvedParams.fileId}
      projectName={projectName}
    />
  );
}
