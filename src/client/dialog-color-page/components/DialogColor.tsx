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
    className: 'g_button action'
})`
  display: inline-block;
  margin-bottom: 0.5rem;
  min-width: 180px;
`

export const DialogColor = () => {

    const [tidyFontColor, setTidyFontColor] = useState(
        "(loading...)"
    )

    serverFunctions.getColor().then(setTidyFontColor).catch(alert);

    const colorButtonClicked = () => {
        setColorButtonLabel("Recoloring...");
        setColorButtonDisable(true);
        setColorButtonSpinner(<> &nbsp; <Spinner/></>);
    }

    const changeColor = () => {
        const newColor = (document.getElementById('color_input') as HTMLInputElement).value;
        if (/^#[0-9A-F]{6}$/i.test(newColor)) {
            colorButtonClicked();
            serverFunctions.updateColor(newColor).catch(alert);
        } else { alert('This is not a valid color code.\nPlease provide "HEX triplet" color value, such as #000000 for black, #ffffff for white, etc.'); }
    }

    const [colorButtonLabel, setColorButtonLabel] = useState(
        "Set new color"
    )

    const [colorButtonDisable, setColorButtonDisable] = useState(
        false
    )

    const [colorButtonSpinner, setColorButtonSpinner] = useState(
        <></>
    )

    return (
        <>
            <ActionInstructions>
                Here you can provide a new font color for all updatable statistics (inserted number values). This will recolor all existing values and future insertions will happen in this same color. (This change can be repeated here anytime, also to reset the original default value, <b>#000000</b>, indicating black.)<br></br>
                Current color: <span style={{color: tidyFontColor}}>{tidyFontColor}</span>.
            </ActionInstructions>
            <ActionInstructions>
                New color value (in hexidecimal "HEX" value):<br></br>
                <input type="text" id="color_input" defaultValue='#' maxLength={7} size={8}></input>
            </ActionInstructions>
            <ActionButton disabled={colorButtonDisable} onClick={changeColor}>
                {colorButtonLabel} {colorButtonSpinner}
            </ActionButton>
        </>
    )
};
