import React from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { NearMe, AddBox, ViewDay, Brush } from "@material-ui/icons";
import { ButtonIcon } from "../components/Login/ButtonIcon";
import { dv } from "../util/sizeDevice";
import WrapFirstScreen from "../components/Login/WrapFirstScreen";

const LoginScreen = ({ history, home }) => {
  return (
    <WrapFirstScreen container first>
      <WrapText className={!home && "WrapFirstScreen"}>
        <T>สวัสดี!</T>
        <St>เข้าสู่ระบบเพื่อใช้งาน URU Booking (BR URU)</St>
        <Ss>Created by A student in Computer Science at URU</Ss>
        <WrapCredit>
          <Brush style={{ marginRight: 4 }} />
          Credit Reference
        </WrapCredit>
      </WrapText>
      <WrapIcon container>
        <ButtonIcon
          home={home}
          history={() => history.push("/login")}
          topic={"เข้าสู่ระบบ"}
          Icon={<NearMe className="IconAtLogin" fontSize="large" />}
        />

        <ButtonIcon
          home={home}
          history={() => history.push("/signup")}
          topic={"สมัครใช้งาน"}
          Icon={<AddBox className="IconAtLogin" fontSize="large" />}
        />
        <ButtonIcon
          home={home}
          history={() => history.push("/allbooks")}
          topic={"เช็คการจอง"}
          Icon={<ViewDay className="IconAtLogin" fontSize="large" />}
        />
      </WrapIcon>
    </WrapFirstScreen>
  );
};
const WrapCredit = styled.div`
  display: flex;
  align-items: center;
  margin-top: 22px;
  border-radius: 24px;
  color: white;
  opacity: 0.5;
  transition: 0.125s;
  cursor: pointer;
  :hover {
    opacity: 8;
  }
`;
const T = styled.div`
  font-size: 68px;
  margin: 0 12px;
  opacity: 0.825;
  @media ${dv.tablet} {
    font-size: 54px;
  }
`;
const St = styled.div`
  font-size: 20px;
  opacity: 0.825;
  margin: 0 12px;
  @media ${dv.tablet} {
    font-size: 16px;
  }
  text-align: center;
`;
const Ss = styled.div`
  font-size: 14px;
  opacity: 0.6;
  margin: 0 12px;
  @media ${dv.tablet} {
    font-size: 12px;
  }
  text-align: center;
`;

const WrapText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
`;
const WrapIcon = styled(Grid)`
  display: flex;
  justify-content: center;
  margin-top: 60px;
  @media ${dv.tablet} {
    margin-top: 12px;
  }
  @media ${dv.mobileL} {
    margin-top: 42px;
  }
  @media ${dv.mobileM} {
    margin-top: 32px;
  }
  @media ${dv.mobileS} {
    margin-top: 0px;
  }
`;

export default LoginScreen;
