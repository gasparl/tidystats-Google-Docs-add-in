import { useState } from "react"
import { Spinner, SpinnerSize } from "@fluentui/react"

import { Tidystats } from "../classes/Tidystats"

import { serverFunctions } from '../../utils/serverFunctions';

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
        setUpdateButtonSpinner(<> &nbsp; &nbsp; <Spinner size={SpinnerSize.medium} /></>);
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
            <h3>Actions:</h3>
            <div>
                Automatically update all statistics in your document after uploading a
                new statistics file.
            </div>

            <button className="action" disabled={updateButtonDisable} onClick={() => {
                updateButtonClicked();
                // must be send data stringified, because Google only allows JavaScript primitives
                serverFunctions.updateStatistics(
                    JSON.stringify(tidystats.analyses)
                ).then(updateFinished).catch(err => { alert(err); updateFinished(); });
            }}>
                {updateButtonLabel} {updateButtonSpinner}
            </button>

            <div>
                Was tidystats useful to you? If so, please consider citing it. Thanks!
            </div>

            <button className="action" onClick={() => serverFunctions.insertPlain('Sleegers (2021)').catch(alert)}>
                Insert in-text citation
            </button>

            <button className="action" onClick={() => serverFunctions.insertPlain('Sleegers, W. W. A. (2021). tidystats: Save output of statistical tests (Version 0.51) [Computer software]. https://doi.org/10.5281/zenodo.4041859').catch(alert)}>
                Insert full citation
            </button>

            <button className="action" onClick={handleBibTexClick}>
                {bibTexButtonLabel}
            </button>
        </>
    )
}

export { Actions }
