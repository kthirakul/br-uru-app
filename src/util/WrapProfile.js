import React from "react";
import styled from "styled-components";
import { InfoOutlined } from "@material-ui/icons";
import { Field } from "formik";
import { CircularProgress } from "@material-ui/core";

const WrapProfile = ({
  first,
  icon,
  topic,
  res,
  pic,
  img,
  click,
  onClick,
  edit,
  save,
  name,
  type,
  values,
  handleChange,
  errors,
  touched,
  message,
  userCheck,
  choose,
  loading
}) => {

  return (
    <WrapItem
      pic={pic}
      click={click}
      save={save}
      onClick={loading ? null : click && (() => onClick())}
    >
      <WrapIcon save={save}>
        {pic ? img : loading && save ? null : icon}
        {loading && save ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={25} style={{ marginRight: 16 }} />
            กำลังบันทึก..
          </div>
        ) : (
          topic
        )}
      </WrapIcon>
      {pic && edit ? (
        <EditDes>
          <InfoOutlined style={{ marginRight: 4 }} />
          กดที่ข้อมูลเพื่อแก้ไข
        </EditDes>
      ) : null}
      <Item pic={pic}>
        {edit ? (
          <WrapEdit pic={pic}>
            <ErrText>
              {message ? message : errors && touched ? errors : null}
            </ErrText>

            {choose ? (
              choose
            ) : (
              <SInput
                pic={pic}
                autoComplete="off"
                name={name}
                type={type}
                onChange={handleChange}
                placeholder={topic ? topic : "ชื่อ-นามสกุล"}
                values={values}
              />
            )}
          </WrapEdit>
        ) : userCheck ? (
          "โปรไฟล์"
        ) : (
          res
        )}
      </Item>
    </WrapItem>
  );
};

const WrapEdit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.pic && "center"};
`;

const ErrText = styled.span`
  color: #d70000;
  font-size: 14px;
  font-weight: bold;
`;

const WrapIcon = styled.div`
  font-size: 16px;
  color: black;
  display: flex;
  align-content: center;
  width: ${props => (props.save ? "100%" : "125px")};
  justify-content: ${props => props.save && "center"};
`;

const Item = styled.div`
  color: black;
  font-size: ${props => (props.pic ? 20 : 16)}px;
  margin-top: ${props => props.pic && 12}px;
`;
const WrapItem = styled.div`
  display: flex;
  flex-direction: ${props => props.pic && "column"};
  box-sizing: border-box;
  align-items: center;
  border-bottom: 2px solid #bdbdbd;
  padding: 20px 40px;
  font-size: ${props => props.pic && 20}px;
  font-weight: ${props => props.pic && "bold"};
  transition: 0.125s;
  :hover {
    background: ${props =>
      (props.click || props.save) && "rgba(255, 255, 255, 0.5)"};
  }
  cursor: ${props => (props.click || props.save) && "pointer"};
`;

const SInput = styled(Field)`
  font-family: "Kanit", sans-serif;
  border: none;
  font-size: ${props => (props.pic ? 20 : 16)}px;
  font-weight: ${props => props.pic && "bold"};
  text-align: ${props => props.pic && "center"};
  ::placeholder {
    color: #9e9e9e;
    font-family: "Kanit", sans-serif;
    font-size: ${props => (props.pic ? 20 : 16)}px;
  }
  outline: none;
  background: rgba(255, 255, 255, 0.5);
  padding: 6px 12px;
  border-radius: ${props => (props.pic ? 99 : 6)}px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.125);
  :focus {
    box-shadow: 0 0 0 2pt #938fff;
  }
`;

const EditDes = styled.span`
  font-size: 16px;
  font-weight: normal;
  margin-top: 12px;
  cursor: default;
  display: flex;
  align-items: center;
`;

export default WrapProfile;
