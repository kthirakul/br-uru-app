import React from "react";

import styled from "styled-components";
import { Tooltip, MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { dv } from "../../util/sizeDevice";

const LeftButton = ({ icon, title }) => {

  const theme = createMuiTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: "1em"
        }
      }
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <Tooltip style={{ fontSize: 24 }} title={title}>
        <IconButton>
          {icon}
          <Title>{title}</Title>
        </IconButton>
      </Tooltip>
    </MuiThemeProvider>
  );
};

const IconButton = styled.div`
    color: rgba(255, 255, 255, 0.6);
    transition: 0.125s;
    transform: scale(0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    :hover {
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      transform: scale(1);
    }
    margin-top: 12px;
    /* @media ${dv.mobileXL} {
      margin: 0px 6px;
      transform: scale(1);
    } */
  `;
const Title = styled.span`
    font-size: 11px;
    display: none;
    /* @media ${dv.mobileXL} {
      margin: 0px 16px;
      transform: scale(1);
      display: block;
    } */
  `;

export default LeftButton;
