import React, { useContext, Fragment } from 'react'
import styled, { keyframes } from 'styled-components'
import Context from '../store/Context'
import WrapContainer from '../util/WrapContainer'
import { CallOutlined, ContactPhone, Map, Room } from '@material-ui/icons'
import { Grid, CircularProgress } from '@material-ui/core'

const TellScreen = () => {
  document.title = `การติดต่อ`

  const context = useContext(Context)
  const {
    contactdata,
    contactdata: {
      university,
      nameDep,
      department,
      location,
      tell,
      linkview,
      linkmap
    }
  } = context

  // const map =
  //   "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7604.672265552105!2d100.09258000000001!3d17.634232!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf0346c6d9b33160!2sUttaradit%20Rajabhat%20University!5e0!3m2!1sen!2sth!4v1575611452703!5m2!1sen!2sth";

  // const viewMap =
  //   "https://www.google.co.th/maps/dir/Uttaradit+Rajabhat+University,+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5+%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%AD%E0%B8%B4%E0%B8%90+%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87+%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%E0%B8%96%E0%B9%8C/%E0%B8%95%E0%B8%B6%E0%B8%81+ICIT+%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A0%E0%B8%B1%E0%B8%8F%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%E0%B8%96%E0%B9%8C+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5+%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%AD%E0%B8%B4%E0%B8%90+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%E0%B8%96%E0%B9%8C+%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%E0%B8%96%E0%B9%8C+53000/@17.6338715,100.0926317,17z/data=!4m13!4m12!1m5!1m1!1s0x30df303aeba49521:0xf0346c6d9b33160!2m2!1d100.0935269!2d17.6334887!1m5!1m1!1s0x30df303ab1a0c283:0x4834dc46d6b10c62!2m2!1d100.092378!2d17.6334228?hl=th";

  const viewGoogle = () => {
    window.open(linkview)
  }

  const styles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
    fontSize: 20
  }
  return (
    <WrapContainer
      icon={<CallOutlined style={{ marginRight: 6 }} />}
      header={'การติดต่อ'}
    >
      {Object.keys(contactdata).length > 0 ? (

        <Fragment>
          <WrapMap>
            <Ifram src={linkmap} frameBorder="0" />
          </WrapMap>

          <WrapItem container>
            <Item item xs={4}>
              <Map style={{ marginRight: 4 }} />
              {location}
              <TellCom>({university})</TellCom>
            </Item>

            <Item item xs={4}>
              <Room style={{ marginRight: 1 }} />
              {department}
              <TellCom onClick={() => viewGoogle()} view>
                (กดเพื่อดูสถานที่)
              </TellCom>
            </Item>

            <Item item xs={4}>
              <ContactPhone style={{ marginRight: 6 }} />
              โทร {tell}
              <TellCom>({nameDep})</TellCom>
            </Item>

          </WrapItem>
        </Fragment>
      ) : (
        <div style={styles}>
          <CircularProgress style={{ marginBottom: 24 }} />
          กำลังโหลดข้อมูล..
        </div>
      )}
    </WrapContainer>
  )
}
const TellCom = styled.div`
  color: #706cd9;
  text-decoration: ${props => props.view && 'underline'};
  cursor: ${props => props.view && 'pointer'};
`

const opacity = keyframes`
  0% { opacity:0; }
  100% { opacity:1; }
`
const WrapMap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 24px;
  box-sizing: border-box;
`

const Ifram = styled.iframe`
  height: 400px;
  width: 650px;
  border: 0;
  border-radius: 12px;
  overflow: hidden;
  opacity: 0;
  animation: ${opacity} 2s ease-in forwards;
  box-shadow: 0 0 22px rgba(0, 0, 0, 0.15);
`

const Item = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
`

const WrapItem = styled(Grid)`
  margin-top: 24px;
  border-top: 2px solid #cacaca;
  border-bottom: 2px solid #cacaca;
  padding: 18px 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.1);
`
export default TellScreen
