import React from "react";
import styled from "styled-components";
import NoData from "./NoData";
import axios from "axios";
import { CheckCircleOutline } from "@material-ui/icons";

const Success = () => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common.Authorization;

  return (
    <Wrap>
      <WrapSuccess>
        <CheckCircleOutline style={{ marginRight: 4 }} />
        ยืนยันอีเมลเรียบร้อยแล้ว! กรุณาลงชื่อเข้าสู่ระบบเพื่อเริ่มต้นใช้งาน
      </WrapSuccess>
      <NoData success />
    </Wrap>
  );

};

const WrapSuccess = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ec407a;
  padding: 12px;
  border-radius: 12px;
  color: white;
  box-sizing: border-box;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
`;

export default Success;
