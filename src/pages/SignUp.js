import React, { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Field, Form, Formik } from "formik";
import { PersonAdd, Close, ErrorOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { singupFuncs } from "../funcs/userFuncs";
import { LinearProgress } from "@material-ui/core";
import Context from "../store/Context";
import * as Yup from "yup";

const SignUpScreen = ({ history }) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (localStorage.hasOwnProperty("FBIdToken")) {
    history.push("/");
  }

  const {
    username,
    userstatus,
    from,
    tell,
    email,
    password,
    confirmEmail,
    confirmPassword,
    general
  } = errors;
  const { dispatch } = context;
  document.title = `สมัครสมาชิก`;

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required("กรุณาใส่ชื่อ-นามสกุล"),
    userstatus: Yup.string().required("กรุณาเลือกสถานะ"),
    from: Yup.string().required("กรุณาใส่หน่วยงาน/มหาลัย"),
    tell: Yup.number()
      .typeError("กรุณาใส่ตัวเลข")
      .min(10, "กรุณาใส่เบอร์โทรให้ครบ")
      .required("กรุณาใส่เบอร์โทร"),
    email: Yup.string().required("กรุณาใส่อีเมล"),
    password: Yup.string()
      .min(6, "รหัสผ่าน 6 ตัวอักษรขึ้นไป")
      .required("กรุณาใส่รหัสผ่าน"),
    confirmEmail: Yup.string().required("กรุณายืนยันอีเมล"),
    confirmPassword: Yup.string()
      .min(6, "รหัสผ่าน 6 ตัวอักษรขึ้นไป")
      .required("กรุณายืนยันรหัสผ่าน")
  });

  const initialValues = {
    username: "",
    userstatus: "",
    from: "",
    tell: "",
    email: "",
    password: "",
    confirmEmail: "",
    confirmPassword: ""
  };

  const styles = {
    status: {
      fontFamily: "Kanit, sans-serif",
      fontSize: 16,
      padding: 12,
      borderRadius: 6,
      border: errors.userstatus ? "2px solid red" : "none"
    }
  };
  const { status } = styles;

  const WrapErrGeneral = styled.span`
    display: ${props => (props.err ? "flex" : "none")};
    margin-top: 20px;
    padding: 8px 8px;
    background: red;
    border-radius: 99px;
    color: white;
    justify-content: center;
    align-items: center;
  `;

  return (
    <Wrap>
      <WrapContent>
        <HeadText>
          <PersonAdd style={{ marginRight: 6 }} />
          สมัครสมาชิก
          {loading ? null : (
            <WrapClose>
              <Link to="/home">
                <Close fontSize="small" />
              </Link>
            </WrapClose>
          )}
        </HeadText>
        {loading && <LinearProgress />}

        <WrapInside>
          <Formik
            validationSchema={SignupSchema}
            initialValues={initialValues}
            onSubmit={(values, actions) =>
              singupFuncs(values, setLoading, setErrors, history, dispatch)
            }
          >
            {({ errors, touched }) => (
              <SForm>
                <Topic>ข้อมูลผู้ใช้</Topic>
                <FormLayout>
                  <WrapInput>
                    {username
                      ? username
                      : errors.username && touched.username
                      ? errors.username
                      : null}

                    <SField
                      error={username}
                      autoComplete="off"
                      name="username"
                      placeholder={"ชื่อ-นามสกุล"}
                    />
                  </WrapInput>
                  <WrapInput>
                    {errors.userstatus && touched.userstatus
                      ? errors.userstatus
                      : null}
                    {userstatus && userstatus}
                    <Field style={status} as="select" name="userstatus">
                      <Option choose value="">
                        เลือกสถานะ
                      </Option>
                      <Option value="นักศึกษา">นักศึกษา</Option>
                      <Option value="อาจารย์">อาจารย์</Option>
                      <Option value="เจ้าหน้าที่/บุคลากร">
                        เจ้าหน้าที่/บุคลากร
                      </Option>
                      <Option value="พนักงานองค์กร">พนักงานองค์กร</Option>
                      <Option value="นิติบุคคล">นิติบุคคล</Option>
                      <Option value="บุคคลทั่วไป">บุคคลทั่วไป</Option>
                    </Field>
                  </WrapInput>

                  <WrapInput>
                    {errors.from && touched.from ? errors.from : null}
                    {from && from}
                    <SField
                      error={from}
                      autoComplete="off"
                      name="from"
                      placeholder={"หน่วยงาน/มหาลัย"}
                    />
                  </WrapInput>

                  <WrapInput>
                    {errors.tell && touched.tell ? errors.tell : null}
                    {tell && tell}
                    <SField
                      type="tel"
                      pattern="[0-9]{10}"
                      error={tell}
                      autoComplete="off"
                      name="tell"
                      placeholder={"เบอร์โทร"}
                    />
                  </WrapInput>
                </FormLayout>
                <Hr style={{ marginTop: 14 }} />
                <Topic>บัญชีผู้ใช้</Topic>

                <FormLayout>
                  <WrapInput>
                    {errors.email && touched.email ? errors.email : null}
                    {email && email}
                    <SField
                      error={email}
                      type="email"
                      autoComplete="off"
                      name="email"
                      placeholder={"อีเมล"}
                    />
                  </WrapInput>

                  <WrapInput>
                    {confirmEmail
                      ? confirmEmail
                      : errors.confirmEmail && touched.confirmEmail
                      ? errors.confirmEmail
                      : null}

                    <SField
                      error={confirmEmail}
                      type="email"
                      autoComplete="off"
                      name="confirmEmail"
                      placeholder={"ยืนยันอีเมล"}
                    />
                  </WrapInput>
                  <WrapInput>
                    {errors.password && touched.password
                      ? errors.password
                      : null}
                    {password && password}
                    <SField
                      error={password}
                      type="password"
                      autoComplete="off"
                      name="password"
                      placeholder={"รหัสผ่าน"}
                    />
                  </WrapInput>

                  <WrapInput>
                    {confirmPassword
                      ? confirmPassword
                      : errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : null}

                    <SField
                      error={confirmPassword}
                      type="password"
                      autoComplete="off"
                      name="confirmPassword"
                      placeholder={"ยืนยันรหัสผ่าน"}
                    />
                  </WrapInput>
                </FormLayout>
                <WrapErrGeneral err={general}>
                  <ErrorOutline style={{ marginRight: 6 }} />
                  {general}
                </WrapErrGeneral>

                <CreateText>
                  <SButton color="inherit" type={loading ? null : "submit"}>
                    <span style={{ fontSize: 18 }}>
                      {loading ? (
                        <WrapLoading>กำลังสร้างบัญชี...</WrapLoading>
                      ) : (
                        "สร้างบัญชี"
                      )}
                    </span>
                  </SButton>
                </CreateText>
              </SForm>
            )}
          </Formik>
        </WrapInside>
      </WrapContent>
    </Wrap>
  );
};
const Hr = styled.hr`
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
`;

const SField = styled(Field)`
  font-family: "Kanit", sans-serif;
  font-size: 16px;
  padding: 12px;
  ::placeholder {
    color: #9e9e9e;
    font-family: "Kanit", sans-serif;
    font-size: 16px;
  }
  border-radius: 4px;
  border: ${props => (props.error ? "2px solid red" : "none")};
  outline: none;
  :focus {
    box-shadow: 0 0 0 2pt #938fff;
  }
`;

const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  color: #d20000;
  justify-content: flex-end;
`;

const WrapLoading = styled.span`
  display: flex;
  align-items: center;
`;

const WrapClose = styled.span`
  position: absolute;
  right: 4px;
`;

const SButton = styled(Button)`
  width: 100%;
  height: 100%;
`;

const CreateText = styled.span`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: #2962ff;
  color: white;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 24px;
`;

const Topic = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 16px 0 12px 0;
  color: #636363;
`;

const FormLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 12px;
`;

const SForm = styled(Form)`
  padding: 0 24px;
`;

const Option = styled.option`
  color: ${props => props.choose && "#9e9e9e"};
`;

const HeadText = styled.div`
  font-size: 18px;
  color: black;
  display: flex;
  justify-content: center;
  height: 38px;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  position: relative;
`;
const WrapContent = styled.div`
  width: 680px;
  background: rgba(255, 255, 255, 0.85);
  height: inherit;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding-bottom: 38px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  box-sizing: border-box;
`;
const opacity = keyframes`
  0% {opacity:0;}
  100% {opacity:1;}
`;

const WrapInside = styled.div`
  height: inherit;
  overflow: auto;
`;

const Wrap = styled.div`
  color: black;
  height: 100%;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${opacity} 0.25s ease forwards;
  overflow: auto;
  padding: 0 12px;
  box-sizing: border-box;
`;

export default SignUpScreen;
