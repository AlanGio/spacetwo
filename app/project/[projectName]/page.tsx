"use client";

import { use } from "react";
import ProjectPageContainer from "../../../containers/ProjectPageContainer";
import { getProjectNameFromSlug } from "../../../lib/url-utils";

interface ProjectPageProps {
  params: Promise<{
    projectName: string;
  }>;
}

export default function Page({ params }: ProjectPageProps) {
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

  return <ProjectPageContainer projectName={projectName} />;
}
