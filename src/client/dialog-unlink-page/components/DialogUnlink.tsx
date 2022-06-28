import { useState } from "react"
import { FontSizes, FontWeights } from "@fluentui/theme"
import styled from "styled-components"

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

const ActionInstructions = styled.p`
  font-size: ${FontSizes.size14};
  font-weight: ${FontWeights.regular};
`
const ActionButton = styled.button.attrs({
    className: 'g_button red'
})`
  display: inline-block;
  margin-bottom: 0.5rem;
  min-width: 180px;
`

export const DialogColor = () => {

    const unlinkButtonClicked = () => {
        setUnlinkButtonLabel("Unlinking...");
        setUnlinkButtonDisable(true);
        setUnlinkButtonSpinner(<> &nbsp; <Spinner /></>);
    }

    const unlinkAll = () => {
        if (confirm("Are you sure? This will unlink all tidystats updatable fields.")) {
            unlinkButtonClicked();
            serverFunctions.unlinkAll().catch(alert);
        }
    }

    const [unlinkButtonLabel, setUnlinkButtonLabel] = useState(
        "Unlink all"
    )

    const [unlinkButtonDisable, setUnlinkButtonDisable] = useState(
        false
    )

    const [unlinkButtonSpinner, setUnlinkButtonSpinner] = useState(
        <></>
    )

    return (
        <>
            <ActionInstructions>
                Here you can remove all <i>tidystats</i> links for updatable statistics (inserted values). This will make all such fields normal plain text and no longer connected to <i>tidystats</i>. Removing links may be useful, for example, before you publish the document as PDF file, so that the links would not show up anymore.
                <br></br>
                <p className='gray'>
                    Of course you can also always use Google Docs' version history to reverse this.
                </p>
            </ActionInstructions>
            <ActionButton disabled={unlinkButtonDisable} onClick={unlinkAll}>
                {unlinkButtonLabel} {unlinkButtonSpinner}
            </ActionButton>
        </>
    )
};
