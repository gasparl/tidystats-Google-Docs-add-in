import styled from "styled-components"
import { FontSizes, FontWeights } from "@fluentui/theme"

const LogoDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f3f2f1;
`

const LogoImage = () => (
    <svg width="50px" height="50px" viewBox="0 0 224 224" style={{paddingRight:'0.5rem'}}>
        <g id="Icon.">
            <path id="Path" d="M219 119.003 L219 149.003 C219 154.003 219 154.003 214 157.003 L119 214.003 C114 217.003 113 217.003 112 217.003 111 217.003 110 217.003 105 214.003 L10 157.003 C5 154.003 5 154.003 5 149.003 L5 119.003 C5 124.003 5 124.003 10 127.003 L105 184.003 C110 187.003 111 187.003 112 187.003 113 187.003 114 187.003 119 184.003 L214 127.003 C219 124.003 219 124.003 219 119.003 Z" fill="#e59215" fill-opacity="1" stroke="none" />
            <path id="Path-1" d="M219 74.003 L219 108.003 C219 113.003 219 113.003 214 116.003 L119 173.003 C114 176.003 113 176.003 112 176.003 111 176.003 110 176.003 105 173.003 L10 116.003 C5 113.003 5 113.003 5 108.003 L5 74.003 C5 75.003 5 79.003 10 82.003 L105 139.003 C110 142.003 111 142.003 112 142.003 113 142.003 114 142.003 119 139.003 L214 82.003 C219 79.003 219 75.003 219 74.003 Z" fill="#26587b" fill-opacity="1" stroke="none" />
            <path id="Path-2" d="M219 74.003 C219 73.003 219 108.003 219 108.003 219 113.003 219 113.003 214 116.003 L119 173.003 C114 176.003 113 176.003 112 176.003 L112 142.003 C113 142.003 114 142.003 119 139.003 L214 82.003 C219 79.003 219 75.003 219 74.003 Z" fill="#1a415a" fill-opacity="1" stroke="none" />
            <path id="Path-3" d="M10 66.003 L105 9.003 C110 6.003 111.013 5.982 112 6.003 113.013 6.024 114 6.003 119 9.003 L214 66.003 C219 69.003 219 74.003 219 74.003 219 74.003 219 79.003 214 82.003 L119 139.003 C114 142.003 113 142.003 112 142.003 111 142.003 110 142.003 105 139.003 L10 82.003 C5 79.003 5 75.003 5 74.003 5 73.003 5 69.003 10 66.003 Z M42 74.003 L112 116.003 182 74.003 112 32.003 Z" fill="#5b9bba" fill-opacity="1" stroke="none" />
            <path id="Path-4" d="M112 6.003 C113 6.003 114 6.003 119 9.003 L214 66.003 C219 69.003 219 73.003 219 74.003 219 75.003 219 79.003 214 82.003 L119 139.003 C114 142.003 113 142.003 112 142.003 L112 116.003 182 74.003 112 32.003 Z" fill="#38728d" fill-opacity="1" stroke="none" />
            <path id="Path-5" d="M97 101.003 L107 107 129 94 119 88 Z" fill="#e59215" fill-opacity="1" stroke="#e59215" stroke-width="1" stroke-opacity="1" stroke-linejoin="round" />
            <path id="Path-6" d="M147 59 L87 95 77 89.003 137 53 Z" fill="#e59215" fill-opacity="1" stroke="#e59215" stroke-width="1" stroke-opacity="1" stroke-linejoin="round" />
            <path id="Path-7" d="M107 59 L67 83 57 77 97 53 Z" fill="#e59215" fill-opacity="1" stroke="#e59215" stroke-width="1" stroke-opacity="1" stroke-linejoin="round" />
        </g>
    </svg>
)

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
            <LogoImage />
            <LogoTitle>{title}</LogoTitle>
        </LogoDiv>
    )
}

export { Logo }
