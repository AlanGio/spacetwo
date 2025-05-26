"use client"

import FileDetailPageContainer from "../../../containers/FileDetailPageContainer"

interface FilePageProps {
  params: {
    fileId: string
  }
}

export default function Page({ params }: FilePageProps) {
  return <FileDetailPageContainer fileId={params.fileId} />
}
