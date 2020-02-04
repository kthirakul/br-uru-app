import React from "react";
import { ArrowForward } from "@material-ui/icons";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
const NoData = ({ page, success }) => {
  return (
    <Wrap>
      <SLink to="/home">
        <IconBD>
          <ArrowForward fontSize="large" />
        </IconBD>
        {success ? (
          <WrapT>
            <span>เข้าสู่ระบบ</span>
            <span style={{ fontSize: 18 }}>เพื่อเริ่มต้นใช้งาน</span>
          </WrapT>
        ) : (
          <WrapPage>
            <span>เข้าสู่ระบบ</span>

            <div style={{ fontSize: 18 }}>เพื่อดูหน้า{page}</div>
          </WrapPage>
        )}
      </SLink>
    </Wrap>
  );
};

const WrapT = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SLink = styled(Link)`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  opacity: 0.8;
  transition: 0.125s;

  :hover {
    opacity: 1;
  }
`;

const opacity = keyframes`
  0% {
      opacity:0;
  }

  100% {
    opacity:1;

  }
`;
const IconBD = styled.div`
  height: 70px;
  width: 70px;
  border-radius: 99px;
  border: 2px white solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  margin-top: 32px;
  transition: 0.125s;
`;

const Wrap = styled.div`
  text-align: center;
  font-size: 22px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${opacity} 0.25s ease forwards;
`;

export default NoData;
