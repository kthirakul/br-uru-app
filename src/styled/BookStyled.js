import styled from 'styled-components'
import { Grid } from '@material-ui/core'

export const WrapAdmin = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const WrapAuto = styled.div`
  overflow: auto;
`

export const SHeaderAdmin = styled.div`
  justify-content: space-between;
  display: flex;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 12px;
`

export const TAdmin = styled.div`
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
`

export const SInputAdmin = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  margin-left: 6px;
  font-family: 'Kanit', sans-serif;

  ::placeholder {
    font-size: 16px;
    font-family: 'Kanit', sans-serif;
  }
`

export const WrapSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: white;
  border-radius: 99px;
`

export const BookSettingHead = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
`

export const WrapBookSetting = styled.div`
  padding: 12px 12px 20px 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
`

export const WrapChooseSetting = styled.div`
  padding-left: 12px;
  margin-top: 12px;
`

export const InputSet = styled.input`
  border: none;
  outline: none;
  border-radius: 12px;
  width: ${props => (props.contact === 'true' ? '300px' : '40px')};
  text-align: ${props => !props.contact && 'center'};
  padding: ${props => (props.contact ? '6px 14px' : '6px 0 6px 14px')};
  background: rgba(255, 255, 255, 0.8);
  font-family: 'Kanit', sans-serif;
  margin-right: 8px;
  :focus {
    box-shadow: 0 0 0 2pt #938fff;
  }
  font-size: 16px;
`

export const ItemSet = styled.div`
  background: rgba(0, 0, 0, 0.075);
  border-radius: 99px;
  padding: 6px 10px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  margin-top: ${props => props.up && '12px'};
  cursor: ${props => props.up && 'pointer'};
  transition: 0.125s;
  :hover {
    background: ${props => props.up && '#f50057'};
    color: ${props => props.up && 'white'};
  }
`

export const SaveReqSet = styled.div`
  width: 75px;
  padding: 8px 0;
  background: ${props =>
    props.save ? '#aa00ff' : props.start ? '#bfb217' : '#ff4081'};
  border-radius: 12px;
  color: white;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props =>
    props.checked === 1 || props.checked === undefined ? 'pointer' : 'default'};
  transition: 0.125s;
  :hover {
    background: ${props =>
      props.save ? '#9a07e4' : props.start ? '#a69b13' : '#e23471'};
  }
  opacity: ${props => props.checked === 0 && 0.2};
`

export const WrapSaveReqSet = styled.div`
  display: flex;
`

export const ErrorReqSet = styled.span`
  color: #c60000;
  font-style: italic;
  margin-left: 8px;
`

export const TextReqSet = styled.span`
  width: ${props => (props.up ? '131px' : props.all ? null : '98px')};
`

export const SettingLoading = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const WLoadAllUser = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`

export const WAllUser = styled(Grid)`
  padding: 16px;
  cursor: ${p => (p.topic ? 'default' : 'pointer')};
  transition: 0.1s;
  background: ${props => props.topic && '#ffa4a440'};
  :hover {
    background: ${props => !props.topic && 'rgba(255, 255, 255, 0.4)'};
  }
  border-bottom: 2px solid
    ${p => (p.topic ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.06)')};
`
export const WEAllUser = styled(Grid)``
