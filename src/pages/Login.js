import React, { useState, Fragment, useContext } from "react";
import styled, { keyframes } from "styled-components";
import Context from "../store/Context";
import { Link } from "react-router-dom";
import {
  Person,
  Lock,
  HowToReg,
  Close,
  Error,
  ErrorOutline
} from "@material-ui/icons";
import { dv } from "../util/sizeDevice";
import { onLoginForm } from "../funcs/userFuncs";
import { CircularProgress, Grid } from "@material-ui/core";
import { Formik, Field, Form } from "formik";

const Login = ({ history }) => {
  if (localStorage.hasOwnProperty("FBIdToken")) {
    history.push("/");
  }
  document.title = `เข้าสู่ระบบ`;

  const context = useContext(Context);
  const { dispatch } = context;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { email, password, general } = errors;

  const initialValues = {
    email: "",
    password: ""
  };

  const WrapGo = styled.button`
    font-family: "Kanit", sans-serif;
    margin-top: 36px;
    font-size: 16px;
    border-radius: 99px;
    padding: 0 12px;
    height: 60px;
    border: ${loading ? "none" : "2px solid rgba(0, 0, 0, 0.4)"};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${loading ? "default" : "pointer"};
    opacity: 0.6;
    transition: ${loading ? 0.5 : 0.25}s;
    outline: none;
    background: transparent;
    color: black;
    :hover {
      box-shadow: ${loading ? null : " 0 0 12px rgba(0, 0, 0, 0.4)"};
      opacity: 1;
    }
    @media ${dv.mobileS} {
      margin-top: 34px;
    }
  `;

  return (
    <Fragment>
      <WrapFirstScreen>
        <Wrap>
          <HT>
            <WrapHT>
              <HowToReg fontSize="large" style={{ marginRight: 4 }} />
              ลงชื่อเข้าใช้งาน
            </WrapHT>
          </HT>
          {loading ? null : (
            <WrapClose>
              <Link to="/home">
                <Close fontSize="small" />
              </Link>
            </WrapClose>
          )}
          <Formik
            initialValues={initialValues}
            onSubmit={values =>
              onLoginForm(values, setLoading, dispatch, history, setErrors)
            }
            render={() => (
              <SForm>
                <WrapInput>
                  <Person fontSize="large" style={{ marginRight: 12 }} />
                  <SField type="email" name="email" placeholder={"อีเมล"} />
                  {email && <Error style={{ color: "red" }} />}
                </WrapInput>
                <ErrText>
                  <WrapErr err={email}>{email && email}</WrapErr>
                </ErrText>
                <WrapInput>
                  <Lock fontSize="large" style={{ marginRight: 12 }} />
                  <SField
                    type="password"
                    name="password"
                    placeholder={"รหัสผ่าน"}
                  />
                  {password && <Error style={{ color: "red" }} />}
                </WrapInput>
                <ErrText>
                  <WrapErr err={password}>{password && password}</WrapErr>
                </ErrText>

                <WrapErrGeneral err={general}>
                  <ErrorOutline style={{ marginRight: 6 }} />

                  {general}
                </WrapErrGeneral>
                <WrapGo type={loading ? null : "submit"}>
                  {loading ? (
                    <WrapLoadLogin>
                      <CircularProgress size={30} style={{ marginRight: 16 }} />
                      กำลังเข้าสู่ระบบ..
                    </WrapLoadLogin>
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </WrapGo>
                {loading ? null : (
                  <ForgotPassword to="/recover">ลืมรหัสผ่าน</ForgotPassword>
                )}
              </SForm>
            )}
          />
        </Wrap>
      </WrapFirstScreen>
    </Fragment>
  );
};

const ForgotPassword = styled(Link)`
  margin-top: 12px;
  color: #5153ca;
  text-decoration: none;
  transition: 0.125s;
`;

const WrapLoadLogin = styled.div`
  display: flex;
  align-items: center;
  color: black;
`;
const WrapErr = styled.span`
  display: ${props => (props.err ? "block" : "none")};
  padding: 4px 8px;
  background: red;
  border-radius: 99px;
  color: white;
`;

const WrapErrGeneral = styled.span`
  display: ${props => (props.err ? "flex" : "none")};
  margin-top: 20px;
  padding: 8px 12px;
  background: red;
  border-radius: 99px;
  color: white;
  justify-content: center;
  align-items: center;
`;
const ErrText = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 4px;
`;

const WrapClose = styled.span`
  position: absolute;
  right: 6px;
  top: 6px;
`;

const SField = styled(Field)`
  font-family: "Kanit", sans-serif;
  font-size: 16px;
  padding: 12px;
  width: 100%;
  ::placeholder {
    color: #9e9e9e;
    font-family: "Kanit", sans-serif;
    font-size: 16px;
  }
  background: transparent;
  border-radius: 4px;
  border: ${props => (props.error ? "2px solid red" : "none")};
  outline: none;
`;

const opacity = keyframes`
  0% {opacity:0;}
  100% {opacity:1;}
`;

const WrapFirstScreen = styled.div`
  animation: ${opacity} 0.25s ease forwards;

  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 52px;
  box-sizing: border-box;
`;
const Wrap = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.75);
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapHT = styled.span`
  display: flex;
  align-items: center;
`;

const SForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HT = styled.div`
  font-size: 18px;
  @media ${dv.tablet} {
    margin-top: 24px;
  }
  color: black;
  @media ${dv.mobileS} {
    font-size: 22px;
    margin-top: 16px;
  }
`;

const WrapInput = styled.div`
  color: black;
  display: flex;
  align-items: center;

  /* border: 2px solid rgba(0, 0, 0, 0.125); */
  padding: 10px;
  border-radius: 6px;
  margin-top: 48px;
  width: 330px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.125);
  @media ${dv.mobileS} {
    width: 180px;
    padding: 12px;
  }
  @media ${dv.mobileM} {
    width: 200px;
    padding: 12px;
  }
  @media ${dv.mobileL} {
    width: 260px;
    padding: 12px;
  }
`;
export default Login;
