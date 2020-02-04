import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Context from "../store/Context";
import NoData from "./NoData";
import {
  BusinessCenter,
  CallToAction,
  ContactPhone,
  Create,
  VerticalAlignBottom,
  Error
} from "@material-ui/icons";
import CheckAuth from "../util/CheckAuth";
import WrapProfile from "../util/WrapProfile";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import { updateProfile } from "../funcs/userFuncs";

const EditProfile = ({ history, location }) => {
  const context = useContext(Context);
  const { userData, dispatch } = context;
  const { username, from, tell, userstatus } = userData;
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(userData).length < 1) {
      sessionStorage.setItem("edit", true);
      history.push("/settings");
    }
  }, []);

  const SettingSchema = Yup.object().shape({
    username: Yup.string().required("กรุณาใส่ชื่อ-นามสกุล"),
    userstatus: Yup.string().required("กรุณาเลือกสถานะ"),
    from: Yup.string().required("กรุณาใส่หน่วยงาน/มหาลัย"),
    tell: Yup.number()
      .typeError("กรุณาใส่ตัวเลข")
      .min(10, "กรุณาใส่เบอร์โทรให้ครบ")
      .required("กรุณาใส่เบอร์โทร")
  });

  const initialValues = {
    username,
    userstatus,
    from,
    tell
  };

  const UserStatus = () => (
    <Field style={status} as="select" name="userstatus">
      <Option choose value="">
        เลือกสถานะ
      </Option>
      <Option value="นักศึกษา">นักศึกษา</Option>
      <Option value="อาจารย์">อาจารย์</Option>
      <Option value="เจ้าหน้าที่/บุคลากร">เจ้าหน้าที่/บุคลากร</Option>
      <Option value="พนักงานองค์กร">พนักงานองค์กร</Option>
      <Option value="นิติบุคคล">นิติบุคคล</Option>
      <Option value="บุคคลทั่วไป">บุคคลทั่วไป</Option>
    </Field>
  );

  const styles = {
    status: {
      fontFamily: "Kanit, sans-serif",
      fontSize: 16,
      padding: 12,
      borderRadius: 6,
      border: message.userstatus ? "2px solid red" : "none"
    }
  };
  const { status } = styles;

  const renderData = () => (
    <Wrap>
      <WrapContent>
        <WrapAuto>
          <EditIcon />
          <Formik
            validationSchema={SettingSchema}
            initialValues={initialValues}
            onSubmit={data =>
              updateProfile(
                data,
                setMessage,
                setLoading,
                dispatch,
                history,
                userData
              )
            }
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form>
                <WrapProfile
                  edit
                  pic={"true"}
                  img={<Img src="setting.png" alt="" />}
                  res={username}
                  name="username"
                  handleChange={handleChange}
                  type="text"
                  values={values.username}
                  first
                  errors={errors.username}
                  touched={touched.username}
                  message={message.username}
                />
                <WrapProfile
                  edit
                  icon={<CallToAction style={{ marginRight: 12 }} />}
                  topic={"สถานะ"}
                  res={userstatus}
                  name="userstatus"
                  handleChange={handleChange}
                  type="text"
                  values={values.userstatus}
                  errors={errors.userstatus}
                  touched={touched.userstatus}
                  message={message.userstatus}
                  choose={UserStatus()}
                />
                <WrapProfile
                  edit
                  icon={<BusinessCenter style={{ marginRight: 12 }} />}
                  topic={"หน่วยงาน"}
                  res={from}
                  name={"from"}
                  handleChange={handleChange}
                  type="text"
                  values={values.from}
                  errors={errors.from}
                  touched={touched.from}
                  message={message.from}
                />
                <WrapProfile
                  edit
                  icon={<ContactPhone style={{ marginRight: 12 }} />}
                  topic={"เบอร์"}
                  res={tell}
                  name="tell"
                  handleChange={handleChange}
                  type="tel"
                  values={values.tell}
                  errors={errors.tell}
                  touched={touched.tell}
                  message={message.tell}
                />
                {/* message.general */}
                {message.general ? (
                  <WrapGeneral>
                    <Error style={{ marginRight: 6 }} />
                    เครือข่ายผิดพลาด กรุณาลองใหม่อีกครั้ง
                  </WrapGeneral>
                ) : (
                  <WrapProfile
                    loading={loading}
                    onClick={handleSubmit}
                    click
                    save={<Create style={{ marginRight: 6 }} />}
                    icon={<VerticalAlignBottom style={{ marginRight: 12 }} />}
                    topic={"บันทึกข้อมูล"}
                  />
                )}
              </Form>
            )}
          </Formik>
        </WrapAuto>
      </WrapContent>
    </Wrap>
  );

  return (
    <CheckAuth
      title={"แก้ไขโปรไฟล์"}
      data={renderData()}
      noData={<NoData page={"โปรไฟล์"} />}
      noDataTitle={"BR URU"}
    />
  );
};

const WrapGeneral = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: #d70000;
  font-size: 16px;
  font-weight: bold;
`;

const Option = styled.option`
  color: ${props => props.choose && "#9e9e9e"};
`;
const WrapAuto = styled.div`
  overflow: auto;
`;

const EditIcon = styled(Create)`
  position: absolute;
  top: 6px;
  right: 6px;
  color: #777777;
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
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`;
export default EditProfile;
