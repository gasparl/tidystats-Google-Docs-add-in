import { useState } from "react"

import { Tidystats } from "../classes/Tidystats"

import { AnalysesTable } from "./AnalysesTable"
import { Logo } from "./Logo"
import { Upload } from "./Upload"
import { Progress } from "./Progress"
import { Actions } from "./Actions"
import { Support } from "./Support"

import styled from "styled-components"
import { initializeIcons } from "@fluentui/font-icons-mdl2"

// import data from "../assets/results.json" // For debugging

initializeIcons();

const Main = styled.div`
  margin: 0.5rem;
`

const App = () => {
    //const [tidystats, setTidystats] = useState<Tidystats | undefined>(
    //  new Tidystats(data)
    //) // For debugging
    const [tidystats, setTidystats] = useState<Tidystats | undefined>()

    const parseStatistics = (text: string) => {
        const data = JSON.parse(text as string)
        const tidystats = new Tidystats(data)

        //setTidystats(undefined)
        setTidystats(tidystats)
    }

    const statisticsUpload = <Upload parseStatistics={parseStatistics} />

    let content
    if (tidystats) {
        content = <AnalysesTable tidystats={tidystats} />
    }

    const support = <Support />

    return (
        <>
            <Logo title="tidystats" />
            <Main>
                {statisticsUpload}
                {tidystats && content}
                {tidystats && <Actions tidystats={tidystats} />}
                {support}
            </Main>
        </>
    )
};

export { App };
