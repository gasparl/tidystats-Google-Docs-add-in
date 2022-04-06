import React from 'react';

import styled from "styled-components"
import { initializeIcons } from "@fluentui/font-icons-mdl2"

initializeIcons()

import logoSrc from "../assets/tidystats-icon.svg"

const Main = styled.div`
  margin: 0.5rem;
`

const App = () => (
  <Main>
    Something34 APP 3
  </Main>
);

export default App;
