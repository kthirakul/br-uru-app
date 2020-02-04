import React, { useContext, useState } from "react";
import Context from "../../store/Context";
import styled from "styled-components";
import { dv } from "../../util/sizeDevice";
import NavMenus from "./NavMenus";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { Layers, Call, LocalLibrary, ViewDay } from "@material-ui/icons";

const AllMenuNav = ({ imgSet }) => {
  const context = useContext(Context);
  const [loading, setloading] = useState(true);
  const { logged } = context;

  setTimeout(() => {
    setloading(false);
  }, 3500);
  return (
    <WrapButton>
      <SLink to={logged ? "/" : "/home"}>
        <NavMenus
          menu={"การจองห้อง"}
          icon={<LocalLibrary style={{ marginRight: 4 }} />}
        />
      </SLink>
      <SLink to="/allbooks">
        <NavMenus
          menu={"เช็คการจอง"}
          icon={<ViewDay style={{ marginRight: 4 }} />}
        />
      </SLink>

      <SLink to="/contact">
        <NavMenus
          menu={"การติดต่อ"}
          icon={<Call style={{ marginRight: 4 }} />}
        />
      </SLink>

      {loading ? (
        <WrapLoad>
          <CircularProgress color="inherit" size={20} />
        </WrapLoad>
      ) : (
        <NavMenus
          handle
          imgSet={imgSet}
          menu={"เลือกธีมส์"}
          icon={<Layers style={{ marginRight: 4 }} />}
        />
      )}
    </WrapButton>
  );
};
const WrapLoad = styled.div`
  height: inherit;
  display: flex;
  align-items: center;
  color: white;
  margin-left: 12px;
`;

const SLink = styled(Link)`
  text-decoration: none;
`;
const WrapButton = styled.div`
  display: flex;
  transition: 0.25s;
`;

export default AllMenuNav;
