"use client";

import { use } from "react";
import FileDetailPageContainer from "../../../containers/FileDetailPageContainer";

interface FilePageProps {
  params: Promise<{
    fileId: string;
  }>;
}

export default function Page({ params }: FilePageProps) {
  const resolvedParams = use(params);
  return <FileDetailPageContainer fileId={resolvedParams.fileId} />;
}
