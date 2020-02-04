import React, { useContext, useEffect } from "react";
import Context from "../store/Context";
import { ErrorOutline } from "@material-ui/icons";
import styled from "styled-components";
const ErrorScreen = ({ history }) => {
  const context = useContext(Context);
  const {
    server: { serverPass }
  } = context;
  useEffect(() => {
    if (serverPass === true) {
      history.push("/");
    }
  }, [serverPass]);
  return (
    <WrapError>
      <ErrorIcon fontSize={"large"} style={{ marginTop: 24 }} />
      <span style={{ fontSize: 24 }}>เซิร์ฟเวอร์ไม่เสถียร</span>
      <span style={{ fontSize: 18 }}>กรุณารอสักครู่ ระบบกำลังจะกลับมา..</span>
    </WrapError>
  );
};

const ErrorIcon = styled(ErrorOutline)`
  transform: scale(1.8);
  margin: 24px 0;
`;

const WrapError = styled.div`
  width: 100%;
  display: flex;
  font-size: 18;
  flex-direction: column;
  align-items: center;
  color: white;
`;

export default ErrorScreen;
