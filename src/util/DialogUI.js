import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core'
import styled from 'styled-components'
import { changeStatus, removeInMonth } from '../funcs/bookFuncs'
import {
  AssignmentLateOutlined,
  AssignmentTurnedInOutlined
} from '@material-ui/icons'
export const SENTEMAIL = 'ส่งอีเมลยืนยัน'
export const SIGNOUT = 'ออกจากระบบ'

const DialogUI = ({
  action,
  open,
  close,
  title,
  detail,
  funcs,
  icon,
  newStatus,
  setLoading,
  dispatch,
  month
}) => {
  const chooseFuncs = res => {
    switch (res) {
      case 'ออกจากระบบ':
        funcs.signout()
        break

      case SENTEMAIL:
        funcs.resentEmail()
        break

      case 'ลบการจอง':
        funcs.removeBook()
        break

      case 'รอหนังสือร้องขอ':
      case 'รอการยืนยัน':
      case 'ยืนยันแล้ว':
        changeStatus(res, newStatus, close, setLoading, dispatch)
        break

      case 'ล้างการจอง':
        removeInMonth(month, dispatch, setLoading, close)
        break
      default:
        close()
        break
    }
  }
  return (
    <Dialog open={open} onClose={close}>
      <Title>
        <WrapTitle>
          {icon}
          {title}
        </WrapTitle>
      </Title>
      <Content>{detail}</Content>
      <Action>
        {action && action.length > 0
          ? action.map((res, i) => (
              <Button key={i} onClick={() => chooseFuncs(res)} color="primary">
                {res === 'รอหนังสือร้องขอ' || res === 'รอการยืนยัน' ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentLateOutlined style={{ marginRight: 2 }} /> {res}
                  </span>
                ) : res === 'ยืนยันแล้ว' ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentTurnedInOutlined style={{ marginRight: 2 }} />{' '}
                    {res}
                  </span>
                ) : (
                  res
                )}
              </Button>
            ))
          : null}
      </Action>
    </Dialog>
  )
}

const WrapTitle = styled.div`
  display: flex;
  align-items: center;
`
const Title = styled(DialogTitle)`
  display: flex;
  justify-content: center;
`
const Content = styled(DialogContent)``
const ContentText = styled(DialogContentText)``
const Action = styled(DialogActions)``

export { DialogUI }
