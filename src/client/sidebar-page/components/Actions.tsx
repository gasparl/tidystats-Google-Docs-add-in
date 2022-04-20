import { useState } from "react"
import { FontSizes, FontWeights } from "@fluentui/theme"
import styled from "styled-components"
// import { Spinner, SpinnerSize } from "@fluentui/react"
import { PrimaryButton } from "@fluentui/react/lib/Button"

import { Tidystats } from "../classes/Tidystats"

import { serverFunctions } from '../../utils/serverFunctions';

const Spinner = () => (
    <div>
        <div className="g_spinner">
            <svg className="g_circular" viewBox="25 25 50 50">
                <circle className="g_path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
            </svg>
        </div>
    </div>
)

const ActionHeader = styled.h3`
  margin-bottom: 0;
`

const ActionInstructions = styled.p`
  font-size: ${FontSizes.size14};
  font-weight: ${FontWeights.regular};
`

const ActionButton = styled(PrimaryButton).attrs({
    className: 'g_button action'
})`
  display: block;
  margin-bottom: 0.5rem;
  min-width: 180px;
`

type ActionsProps = {
    tidystats: Tidystats
}

const Actions = (props: ActionsProps) => {
    const { tidystats } = props

    const [updateButtonLabel, setUpdateButtonLabel] = useState(
        "Update statistics"
    )

    const [updateButtonDisable, setUpdateButtonDisable] = useState(
        false
    )

    const [updateButtonSpinner, setUpdateButtonSpinner] = useState(
        <></>
    )

    const updateButtonClicked = () => {
        setUpdateButtonLabel("Updating...");
        setUpdateButtonDisable(true);
        setUpdateButtonSpinner(<> &nbsp; <Spinner /> </>);
    }

    const updateFinished = () => {
        setUpdateButtonSpinner(<></>);
        setUpdateButtonLabel("Update statistics");
        setUpdateButtonDisable(false);
    }

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

            <ActionButton className='g_button action' disabled={updateButtonDisable} onClick={() => {
                updateButtonClicked();
                // must be send data stringified, because Google only allows JavaScript primitives
                serverFunctions.updateStatistics(
                    JSON.stringify(tidystats.analyses)
                ).then(updateFinished).catch(err => { alert(err); updateFinished(); });
            }}>
                {updateButtonLabel} {updateButtonSpinner}
            </ActionButton>

            <ActionInstructions>
                Was tidystats useful to you? If so, please consider citing it. Thanks!
            </ActionInstructions>

            <ActionButton onClick={() => serverFunctions.insertPlain('Sleegers (2021)').catch(alert)}>
                Insert in-text citation
            </ActionButton>

            <ActionButton onClick={() => serverFunctions.insertPlain('Sleegers, W. W. A. (2021). tidystats: Save output of statistical tests (Version 0.51) [Computer software]. https://doi.org/10.5281/zenodo.4041859').catch(alert)}>
                Insert full citation
            </ActionButton>

            <ActionButton className='g_button action' onClick={handleBibTexClick}>
                {bibTexButtonLabel}
            </ActionButton>
        </>
    )
}

export { Actions }
