import React from "react";
import styled from "styled-components";
import LeftButton from "./LeftButton";
import { dv } from "../../util/sizeDevice";
import { Link } from "react-router-dom";

import {
  Book,
  AccountBox,
  Settings
} from "@material-ui/icons";

const MenuLeftBar = () => {
  const LeftBar = styled.div`
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media ${dv.mobileXL} {
      flex-direction: row;
      width: 100%;
      justify-content: center;
    }
  `;
  const SLink = styled(Link)``;
  return (
    <LeftBar>
      <SLink to={`/profile`}>
        <LeftButton title={"บัญชี"} icon={<AccountBox fontSize={"large"} />} />
      </SLink>

      <SLink to="/books">
        <LeftButton title={"ประวัติ"} icon={<Book fontSize={"large"} />} />
      </SLink>

      <SLink to="/settings">
        <LeftButton title={"ตั้งค่า"} icon={<Settings fontSize={"large"} />} />
      </SLink>

    </LeftBar>
  );
};

export default MenuLeftBar;
