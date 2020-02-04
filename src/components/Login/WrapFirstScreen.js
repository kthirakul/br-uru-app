import React from "react";
import { dv } from "../../util/sizeDevice";
import { Grid } from "@material-ui/core";
import styled from "styled-components";

// CHILD FROM: Login,FirstScreen,Signup
const WrapFirstScreen = ({ children, signup, first }) => {
  const WrapFirstScreen = styled(Grid)`
    color: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: ${signup ? 0 : 52}px;
    box-sizing: border-box;
    @media ${dv.tablet} {
      padding-top: 0px;
      padding-bottom: ${signup ? 32 : 0}px;
    }
    overflow: ${signup && "hidden"};
  `;
  const Wrap = styled.div`
    position: relative;
    background: ${first ? "transparent" : "rgba(255, 255, 255, 0.85)"};
    box-shadow: ${first ? null : "0 0 8px rgba(0, 0, 0, 0.75)"};
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media ${dv.mobileS} {
      padding: 12px;
    }
    @media ${dv.mobileXL} {
      margin-top: 12px;
    }
  `;

  return (
    <WrapFirstScreen container>
      <Wrap>{children}</Wrap>
    </WrapFirstScreen>
  );
};

export default WrapFirstScreen;
