import { ReactNode, useState } from "react"
import styled from "styled-components"

import { Row } from "../components/Row"
import { RowName } from "../components/RowName"

import { IIconProps } from "@fluentui/react"
import { IconButton } from "@fluentui/react/lib/Button"

import { registerIcons } from '@fluentui/react/lib/Styling';

registerIcons({
  icons: {
    'g_add': <span className="material-icons">add</span>,
    'g_table': <span className="material-icons">add_box</span>,
    'g_chev_right': <span className="material-icons">chevron_right</span>,
    'g_chev_down': <span className="material-icons">expand_more</span>,
    'g_settings': <span className="material-icons">settings</span>
  }
});

export const Content = styled.div`
  padding-left: 16px;
`

const chevronDownIcon: IIconProps = { iconName: "g_chev_down" }
const chevronRightIcon: IIconProps = { iconName: "g_chev_right" }
const settingsIcon: IIconProps = { iconName: "g_settings" }
const addIcon: IIconProps = { iconName: "g_add" }
const addTableIcon: IIconProps = { iconName: "g_table" }

interface CollapsibleProps {
  primary: boolean
  bold: boolean
  name: string
  handleSettingsClick?: Function
  handleAddClick?: Function
  content: ReactNode
  open?: boolean
  disabled?: boolean
  table?: boolean
}

const Collapsible = (props: CollapsibleProps) => {
  const {
    primary,
    bold,
    name,
    handleSettingsClick,
    handleAddClick,
    content,
    open,
    disabled,
    table,
  } = props

  const [isOpen, setIsOpen] = useState(open)

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <>
      <Row primary={primary}>
        <>
          {!disabled && (
            <IconButton
              iconProps={!isOpen ? chevronRightIcon : chevronDownIcon}
              onClick={toggleOpen}
            />
          )}
        </>
        <RowName header={true} bold={bold} name={name} />
        <>
          {handleSettingsClick && (
            <IconButton
              iconProps={settingsIcon}
              onClick={() => handleSettingsClick()}
            />
          )}
        </>
        <>
          {handleAddClick && (
            <IconButton iconProps={table ? addTableIcon : addIcon} onClick={() => handleAddClick()} />
          )}
        </>
      </Row>
      <Content>{isOpen && content}</Content>
    </>
  )
}

export { Collapsible }
