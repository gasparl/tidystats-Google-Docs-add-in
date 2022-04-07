import { useState } from "react"
import { PrimaryButton } from "@fluentui/react/lib/Button"
import { FontSizes, FontWeights } from "@fluentui/theme"
import styled from "styled-components"

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


const Actions = () => {

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
      <ActionInstructions>
        Was tidystats useful to you? If so, please consider citing it. Thanks!
      </ActionInstructions>

      <ActionButton onClick={() => {serverFunctions.insertInTextCitation()
      .catch(alert);} }>
        Insert in-text citation
      </ActionButton>
      <ActionButton onClick={() => {serverFunctions.insertFullCitation()
      .catch(alert);}}>
        Insert full citation
      </ActionButton>
      <ActionButton onClick={handleBibTexClick}>
        {bibTexButtonLabel}
      </ActionButton>

        <ActionButton onClick={() => {serverFunctions.updateNamedRange('tidystats_intext', 'new1_' + Date.now())
        .catch(alert);}}>
          Update intext
        </ActionButton>
      <ActionButton onClick={() => {serverFunctions.updateNamedRange('tidystats_full', 'new2_' + Date.now())
      .catch(alert);}}>
        Update full
      </ActionButton>
    </>
  )
}

export { Actions }
