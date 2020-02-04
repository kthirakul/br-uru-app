import React from "react";
import styled, { keyframes } from "styled-components";
import { NotInterested } from "@material-ui/icons";
const NotFound = () => {
  return (
    <Wrap>
      <NotFoundIcon fontSize="large" />
      <span style={{ marginTop: 42 }}>ไม่พบหน้าที่ต้องการ</span>
      <span style={{ marginTop: 12, fontSize: 16, textAlign: "center" }}>
        ลิงค์ที่อยู่อาจผิดพลาด กรุณาตรวจสอบความถูกต้อง
      </span>
    </Wrap>
  );
};

const opacity = keyframes`
  0% {
      opacity:0;
  }

  100% {
    opacity:1;

  }
`;
const NotFoundIcon = styled(NotInterested)`
  transform: scale(2);
`;
const Wrap = styled.div`
  padding-top: 42px;
  box-sizing: border-box;
  font-size: 28px;
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${opacity} 0.25s ease forwards;
`;
export default NotFound;
