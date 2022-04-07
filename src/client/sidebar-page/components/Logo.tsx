import styled from "styled-components"
import { FontSizes, FontWeights } from "@fluentui/theme"

const LogoDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f3f2f1;
`

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  padding-right: 0.5rem;
`

const LogoTitle = styled.h1`
  font-size: ${FontSizes.size24};
  font-weight: ${FontWeights.semibold};
`

type LogoProps = {
  title: string
}

const Logo = (props: LogoProps) => {
  const { title } = props

  return (
    <LogoDiv>
      <LogoImage src='https://drive.google.com/uc?id=122ONu3FPJhPu0enlMK8QmivjOWEf-eNY' alt='' title={title} />
      <LogoTitle>{title}</LogoTitle>
    </LogoDiv>
  )
}

export { Logo }
