import { useState } from "react"
import { Spinner, SpinnerSize } from "@fluentui/react"

import { serverFunctions } from '../../utils/serverFunctions';


export const DialogColor = () => {

    const replaceButtonClicked = () => {
        setReplaceButtonLabel("Replacing...");
        setReplaceButtonDisable(true);
        setReplaceButtonSpinner(<> &nbsp; &nbsp; <Spinner size={SpinnerSize.medium} /></>);
    }

    const replaceAll = () => {
        const newValue = (document.getElementById('val_input') as HTMLInputElement).value;
        if (newValue.length > 0) {
            replaceButtonClicked();
            serverFunctions.updateStatistics(newValue, true).catch(alert);
        } else { alert('Replacement with "nothing" is not allowed.\nPlease provide some text.'); }
    }

    const [replaceButtonLabel, setReplaceButtonLabel] = useState(
        "Replace all"
    )

    const [replaceButtonDisable, setReplaceButtonDisable] = useState(
        false
    )

    const [replaceButtonSpinner, setReplaceButtonSpinner] = useState(
        <></>
    )

    return (
        <>
            <div>
                Here you can replace all updatable statistics (inserted number values) with a value specified below. (This is intended for temporarily masking the actual numeric results, e.g. for registered reports.)
                <br></br>
                <br></br>
                <p className='gray'>
                    The fields with the values will remain updatable, so you may at any time use the "Update statistics" button to replace them with the statistics from tidystats JSON files. (And of course you can also always use Google Docs' version history to reverse unwanted changes.)
                </p>
            </div>
            <div>
                Replacement value:<br></br>
                <input type="text" id="val_input" defaultValue='NA' maxLength={20} size={8}></input>
            </div>
            <button className="action" disabled={replaceButtonDisable} onClick={replaceAll}>
                {replaceButtonLabel} {replaceButtonSpinner}
            </button>
        </>
    )
};
