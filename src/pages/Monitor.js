import React, { useState, Fragment } from "react";
import ImgBG from "../util/ImgBG";
import styled from "styled-components";
import AllMenuNav from "../components/Home/AllMenuNav";
import Nav from "../components/Nav";
import MenuLeftBar from "../components/Home/MenuLeftBar";
import Calendar from "./Calendar";
import Rooms from "./Rooms";
import { dv } from "../util/sizeDevice";

const Monitor = ({ children }) => {
  const [img, imgSet] = useState(Math.floor(Math.random() * ImgBG.length));
  // change BG only Admin

  const Wrap = styled.div`
    background-image: url(${ImgBG[img]});
    position: absolute;
    background-size: cover;
    background-position: center;
    background-repeat: none;
    z-index: 0;
    width: 100%;
    height: 100%;
  `;

  const WrapBGLinear = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8));
    z-index: 1;
    padding-bottom: 51px;
    box-sizing: border-box;
  `;

  const LayoutAll = styled.div`
    display: flex;
    height: 100%;
    /* @media ${dv.tablet} {
      height: initial;
    } */
    @media ${dv.mobileXL} {
      flex-direction: column;
      align-items: center;
    }
  `;
  const Layout = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 5px;
    @media ${dv.tablet} {
      display: none;
    }
  `;

  return (
    <Fragment>
      <WrapBGLinear>
        <Nav AllMenuNav={<AllMenuNav imgSet={imgSet} />} />
        <LayoutAll>
          <MenuLeftBar />
          <Layout>
            <Calendar />
            <Rooms />
          </Layout>
          {children}
        </LayoutAll>
      </WrapBGLinear>
      <Wrap className="WrapBG" />
    </Fragment>
  );
};
//

export default Monitor;
