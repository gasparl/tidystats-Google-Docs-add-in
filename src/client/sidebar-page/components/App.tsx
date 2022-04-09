import React from 'react';
import { Logo } from "./Logo"
import { Actions } from "./Actions"

import styled from "styled-components";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

initializeIcons();

const Main = styled.div`
  margin: 0.5rem;
`

const App = () => {

    return (
        <>
            <Logo title="tidystats" />
            <Main>
                <p>
                    Preliminary template...2
                </p>

                {<Actions />}

            </Main>
        </>
    )
};

export { App };
