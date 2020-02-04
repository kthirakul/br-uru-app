import React, { useState, useContext, Fragment, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import NoData from "./NoData";
import CheckAuth from "../util/CheckAuth";
import WrapProfile from "../util/WrapProfile";
import { ExitToApp, Menu, ErrorOutline } from "@material-ui/icons";
import { signOut } from "../funcs/userFuncs";
import { DialogUI, SIGNOUT } from "../util/DialogUI";
import { CircularProgress, DialogContentText } from "@material-ui/core";
import { emptyFunc } from "../funcs/emptyFunc";
import Context from "../store/Context";

const Settings = ({ history }) => {
  // const [text,setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);

  useEffect(() => {
    if (
      sessionStorage.hasOwnProperty("edit") &&
      Object.keys(context.userData).length > 0
    ) {
      sessionStorage.removeItem("edit");
      history.push("/settings/edit");
    }
  }, [context.userData]);

  const dialog = {
    title: "ออกจากระบบ",
    detail: <ContentText>คุณต้องการออกจากระบบหรือไม่?</ContentText>,
    action: ["ยกเลิก", SIGNOUT],
    funcs: {
      signout: () =>
        signOut(
          history,
          setLoading,
          setOpen,
          context.dispatch,
          context.bookPack,
          context.mybookState
        )
    },
    close: () => setOpen(false),
    icon: <ErrorOutline style={{ marginRight: 6 }} />,
    loading: loading,
    open: open
  };

  const renderData = () => (
    <Wrap>
      <DialogUI {...dialog} loading={loading} open={open} />
      <WrapContent>
        <WrapAuto>
          <WrapProfile
            pic
            img={<Img src="setting.png" alt="" />}
            res={"การตั้งค่า"}
          />
          {sessionStorage.hasOwnProperty("edit") ? (
            <WrapUserCheck>
              <CircularProgress />
            </WrapUserCheck>
          ) : (
            <Fragment>
              <WrapProfile
                click
                onClick={() => history.push("/settings/edit")}
                icon={<Menu style={{ marginRight: 12 }} />}
                topic={"แก้ไขข้อมูล"}
                loading={loading}
              />
              <WrapProfile
                click
                onClick={loading ? emptyFunc : () => setOpen(true)}
                icon={
                  loading ? null : <ExitToApp style={{ marginRight: 12 }} />
                }
                topic={
                  loading ? (
                    <LogLoading>
                      <CircularProgress />
                    </LogLoading>
                  ) : (
                    "ออกจากระบบ"
                  )
                }
              />
            </Fragment>
          )}
        </WrapAuto>
      </WrapContent>
    </Wrap>
  );
  return (
    <CheckAuth
      title={"การตั้งค่า"}
      data={renderData()}
      noData={<NoData page={"การตั้งค่า"} />}
      noDataTitle={"BR URU"}
    />
  );
};

const WrapUserCheck = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0;
`;

const ContentText = styled(DialogContentText)``;

const LogLoading = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Img = styled.img`
  height: 120px;
  width: 180px;
  border-radius: 99px;
  overflow: hidden;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.125);
  padding: 2px;
`;
const WrapContent = styled.div`
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
`;

const WrapAuto = styled.div`
  overflow: auto;
`;

const opacity = keyframes`
  0% {
      opacity:0;
  }

  100% {
    opacity:1;

  }
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${opacity} 0.25s ease forwards;
  margin-top: 32px;
`;
export default Settings;
