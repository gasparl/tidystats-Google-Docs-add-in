import { FileInput } from "./general/FileInput"

import styled from "styled-components"


type UploadProps = {
  parseStatistics: Function
}

const Upload = (props: UploadProps) => {
  const { parseStatistics } = props

  const handleFile = (file: File) => {
    const reader = new FileReader()

    reader.onload = () => {
      parseStatistics(reader.result)
    }

    reader.readAsText(file)
  }

  return (
    <>
      <div>
        Upload your statistics created with the tidystats{" "}
        <a href="https://www.tidystats.io/">R</a> package to get started:
      </div>
      <FileInput initialFileName="Upload statistics" handleFile={handleFile} />
    </>
  )
}

export { Upload }
