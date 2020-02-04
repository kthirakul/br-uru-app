import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Context from "../store/Context";
import NoData from "./NoData";
import dayjs from "dayjs";
import {
  BusinessCenter,
  Email,
  Contacts,
  CallToAction,
  ContactPhone,
  Settings
} from "@material-ui/icons";
import CheckAuth from "../util/CheckAuth";
import WrapProfile from "../util/WrapProfile";
import { CircularProgress } from "@material-ui/core";

const Profile = () => {
  const context = useContext(Context);
  const { userData } = context;
  const userCheck = Object.keys(userData) < 1;
  const { username, createdAt, email, from, tell, userstatus } = userData;

  const renderData = () => (
    <Wrap>
      <WrapContent>
        <WrapAuto userCheck={userCheck}>
          <SLink to="/settings">
            <Settings />
          </SLink>
          <WrapProfile
            userCheck={userCheck}
            pic
            img={<Img src="user-icon.svg" alt="" />}
            res={username}
          />
          {userCheck ? (
            <WrapUserCheck>
              <CircularProgress />
            </WrapUserCheck>
          ) : (
            <Fragment>
              <WrapProfile
                icon={<CallToAction style={{ marginRight: 12 }} />}
                topic={"สถานะ"}
                res={userstatus}
              />
              <WrapProfile
                icon={<BusinessCenter style={{ marginRight: 12 }} />}
                topic={"หน่วยงาน"}
                res={from}
              />
              <WrapProfile
                icon={<ContactPhone style={{ marginRight: 12 }} />}
                topic={"เบอร์"}
                res={tell}
              />
              <WrapProfile
                icon={<Email style={{ marginRight: 12 }} />}
                topic={"อีเมล"}
                res={email}
              />
              <WrapProfile
                icon={<Contacts style={{ marginRight: 12 }} />}
                topic={"สมัครเมื่อ"}
                res={dayjs(createdAt).format("D MMMM YYYY")}
              />
            </Fragment>
          )}
        </WrapAuto>
      </WrapContent>
    </Wrap>
  );

  return (
    <CheckAuth
      title={username}
      data={renderData()}
      noData={<NoData page={"โปรไฟล์"} />}
      noDataTitle={"BR URU"}
    />
  );
};

const WrapUserCheck = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0;
`;

const WrapAuto = styled.div`
  overflow: ${props => (props.userCheck ? "hidden" : "auto")};
`;
const SLink = styled(Link)`
  position: absolute;
  top: 6px;
  right: 6px;
  color: #777777;
  cursor: pointer;
  display: flex;
  align-items: center;
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
  position: relative;
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
export default Profile;
