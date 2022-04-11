import { useState } from "react"
import { PrimaryButton } from "@fluentui/react/lib/Button"
import { FontSizes, FontWeights } from "@fluentui/theme"
import styled from "styled-components"

import { Tidystats } from "../classes/Tidystats"

import { serverFunctions } from '../../utils/serverFunctions';

const ActionHeader = styled.h3`
  margin-bottom: 0;
`

const ActionInstructions = styled.p`
  font-size: ${FontSizes.size14};
  font-weight: ${FontWeights.regular};
`
const ActionButton = styled(PrimaryButton)`
  display: block;
  margin-bottom: 0.5rem;
  min-width: 180px;
`

type ActionsProps = {
  tidystats: Tidystats
}

const Actions = (props: ActionsProps) => {
  const { tidystats } = props

  const [bibTexButtonLabel, setBibTexButtonLabel] = useState(
    "Copy BibTex citation"
  )

  const handleBibTexClick = () => {
    navigator.clipboard.writeText(`
      @software{sleegers2021,
        title = {tidystats: {{Save}} Output of Statistical Tests},
        author = {Sleegers, Willem W. A.},
        date = {2021},
        url = {https://doi.org/10.5281/zenodo.4041859},
        version = {0.51}
      }
    `)
    setBibTexButtonLabel("Copied!")
    setTimeout(() => {
      setBibTexButtonLabel("Copy BibTex citation")
    }, 2000)
  }


  return (
    <>
      <ActionHeader>Actions:</ActionHeader>
      <ActionInstructions>
        Automatically update all statistics in your document after uploading a
        new statistics file.
      </ActionInstructions>
      <ActionButton onClick={() => serverFunctions.updateStatistics(tidystats).catch()}>
        Update statistics
      </ActionButton>
      <ActionInstructions>
        Was tidystats useful to you? If so, please consider citing it. Thanks!
      </ActionInstructions>

      <ActionButton onClick={() => serverFunctions.insertPlain('Sleegers (2021)').catch()}>
        Insert in-text citation
      </ActionButton>
      <ActionButton onClick={() => serverFunctions.insertPlain('Sleegers, W. W. A. (2021). tidystats: Save output of statistical tests (Version 0.51) [Computer software]. https://doi.org/10.5281/zenodo.4041859').catch()}>
        Insert full citation
      </ActionButton>
      <ActionButton onClick={handleBibTexClick}>
        {bibTexButtonLabel}
      </ActionButton>
    </>
  )
}

export { Actions }
