import { useState } from "react"
import { PrimaryButton } from "@fluentui/react/lib/Button"
import { FontSizes, FontWeights } from "@fluentui/theme"
import styled from "styled-components"
import { Spinner, SpinnerSize } from "@fluentui/react"

import { serverFunctions } from '../../utils/serverFunctions';

const ActionInstructions = styled.p`
  font-size: ${FontSizes.size14};
  font-weight: ${FontWeights.regular};
`
const ActionButton = styled(PrimaryButton)`
  display: inline-block;
  margin-bottom: 0.5rem;
  min-width: 180px;
`

let tidyFontColor  = '#000000'

export const Dialog = () => {

    const [colorButtonLabel, setColorButtonLabel] = useState(
        "Set new color"
    )

    const [colorButtonDisable, setColorButtonDisable] = useState(
        false
    )

    const [colorButtonSpinner, setColorButtonSpinner] = useState(
        <></>
    )

    const colorButtonClicked = () => {
        setColorButtonLabel("Recoloring...");
        setColorButtonDisable(true);
        setColorButtonSpinner(<> &nbsp; &nbsp; <Spinner size={SpinnerSize.medium} /></>);
    }

    return (
        <>
            <ActionInstructions>
                Update font color of all updatable values. The current color: <span color={tidyFontColor}>{tidyFontColor}</span>.
            </ActionInstructions>
            <ActionInstructions>
                New color value (in hexidecimal):
                    <input type="text" id="color_input" value={tidyFontColor} maxLength={7} size={8}></input>
            </ActionInstructions>

            <ActionButton disabled={colorButtonDisable} onClick={() => {
                serverFunctions.closeDialog().catch(err => { alert(err); });
            }}>
                Cancel
            </ActionButton>
            &nbsp; &nbsp;
            <ActionButton disabled={colorButtonDisable} onClick={() => {
                colorButtonClicked();
                serverFunctions.updateColor(
                    (document.getElementById('color_input') as HTMLInputElement).value
                ).catch(err => { alert(err); });
            }}>
                {colorButtonLabel} {colorButtonSpinner}
            </ActionButton>
        </>
    )
};
