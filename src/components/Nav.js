import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { dv } from "../util/sizeDevice";

const Nav = ({ AllMenuNav }) => {
  return (
    <Navbar container>
      <GridLogo item md={6} xs={12}>
        <SLink to="/home">
          <Img src="logouru.png" width={40} alt="" rounded />
          <T>URU Booking</T>
        </SLink>
      </GridLogo>

      <SGrid item md={6} xs={12}>
        {AllMenuNav}
      </SGrid>
    </Navbar>
  );
};

const Navbar = styled(Grid)`
  position: relative;
  z-index: 2;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
`;

const SGrid = styled(Grid)`
  display: flex;
  justify-content: flex-end;
  padding-right: 12px;
  box-sizing: border-box;
  @media ${dv.tablet} {
    padding-right: 0;
    justify-content: center;
  }
`;

const T = styled.span`
  color: white;
  font-size: 26px;
  margin-left: 12px;
  user-select: none;
`;

const GridLogo = styled(Grid)`
  @media ${dv.tablet} {
    display: flex;
    justify-content: center;
  }
`;

const Img = styled.img`
  margin-left: 12px;
  @media ${dv.mobileL} {
    margin-left: 0;
  }
`;

const SLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  width: 300px;
  display: flex;
  align-items: center;
  @media ${dv.tablet} {
    justify-content: center;
  }
`;

export default Nav;
