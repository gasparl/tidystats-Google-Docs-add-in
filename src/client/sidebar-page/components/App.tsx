import React from 'react';
import { Logo } from "./Logo"
import { Actions } from "./Actions"

import styled from "styled-components";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

initializeIcons();

import logoSrc from "../assets/tidystats-icon.svg";

const Main = styled.div`
  margin: 0.5rem;
`

const App = () => {
    return(
  <>
  <Logo title="tidystats" />
  <Main>
  <p>
    Try 99
    </p>

        {<Actions />}

  </Main>
  </>
)};

export { App};
