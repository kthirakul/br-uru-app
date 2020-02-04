import React, { useState, Fragment, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Grid, DialogContentText, CircularProgress } from "@material-ui/core";
import {
  LocalLibrary,
  Work,
  LabelImportant,
  ErrorOutline,
  Brush
} from "@material-ui/icons";
import { ButtonIcon } from "../components/Login/ButtonIcon";
import { dv } from "../util/sizeDevice";
import WrapFirstScreen from "../components/Login/WrapFirstScreen";
import { DialogUI, SIGNOUT } from "../util/DialogUI";
import { signOut } from "../funcs/userFuncs";
import Context from "../store/Context";

import CheckAuth from "../util/CheckAuth";
import LoginScreen from "./LoginScreen";

const HomeScreen = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const context = useContext(Context);

  const {
    userData: { username, email },
    dispatch,
    bookPack,
    mybookState
  } = context;

  const dialog = {
    title: "ออกจากระบบ",
    detail: <ContentText>คุณต้องการออกจากระบบหรือไม่?</ContentText>,
    action: ["ยกเลิก", SIGNOUT],
    funcs: {
      signout: () =>
        signOut(history, setLoading, setOpen, dispatch, bookPack, mybookState)
    },
    close: () => setOpen(false),
    icon: <ErrorOutline style={{ marginRight: 6 }} />,
    loading: loading,
    open: open
  };

  const renderData = () => {
    return (
      <WrapAll>
        <DialogUI {...dialog} loading={loading} open={open} />
        <WrapFirstScreen container first>
          {loading ? (
            <WrapLogout>
              <CircularProgress color="inherit" />
              <TextOut>กำลังออกจากระบบ..</TextOut>
            </WrapLogout>
          ) : (
            <Fragment>
              <WrapText>
                {email === "br.uru.app@gmail.com" ? (
                  <T style={{ textAlign: "center" }}>BR-URU Team</T>
                ) : (
                  <T>
                    สวัสดี{username && " "}
                    {username && username.split(" ")[0]}!
                  </T>
                )}
                {email === "br.uru.app@gmail.com" ? (
                  <St>ระบบผู้ดูแล BR-URU Team สำหรับการจัดการข้อมูลภายในแอป</St>
                ) : (
                  <Fragment>
                    <St>คุณสามารถใช้งานระบบ BR URU ได้แล้วในขณะนี้</St>
                    <Ss>Thanks for coming! - BR URU Team</Ss>
                  </Fragment>
                )}

                <WrapCredit>
                  <Brush style={{ marginRight: 4 }} />
                  Credit Reference
                </WrapCredit>
              </WrapText>
              <WrapIcon container>
                <ButtonIcon
                  home
                  history={() => history.push("/")}
                  topic={"การจองห้อง"}
                  Icon={
                    <LocalLibrary className="IconAtLogin" fontSize="large" />
                  }
                />

                <ButtonIcon
                  home
                  history={() => history.push("/tutorial")}
                  topic={"วิธีใช้งาน"}
                  Icon={<Work className="IconAtLogin" fontSize="large" />}
                />
                <ButtonIcon
                  home
                  history={() => setOpen(true)}
                  topic={"ออกจากระบบ"}
                  Icon={
                    <LabelImportant className="IconAtLogin" fontSize="large" />
                  }
                />
              </WrapIcon>
            </Fragment>
          )}
        </WrapFirstScreen>
      </WrapAll>
    );
  };

  return (
    <CheckAuth
      title={"โฮม"}
      data={renderData()}
      noData={
        <WrapAll>
          <LoginScreen home history={history} />
        </WrapAll>
      }
      noDataTitle={"BR URU"}
    />
  );
};
const WrapLogout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TextOut = styled.div`
  color: white;
  margin-top: 54px;
  font-size: 20px;
`;
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

const opacity = keyframes`
  0% {opacity:0;}
  100% {opacity:1;}
`;
const WrapAll = styled.div`
  width: 100%;
  animation: ${opacity} 0.75s ease forwards;
`;
const ContentText = styled(DialogContentText)``;

const T = styled.div`
  font-size: 48px;
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
  color: white;
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

export default HomeScreen;
