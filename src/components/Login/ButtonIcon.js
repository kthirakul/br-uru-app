import React from "react";
import styled, { keyframes } from "styled-components";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { dv } from "../../util/sizeDevice";

// PROPS FROM COMPONENT: FirstScreen
const ButtonIcon = ({ Icon, topic, history, home }) => {
  const onFuncs = () => {
    history && history();
  };

  const scale = keyframes`
  0% {
    transform: ${home ? "scale(0.8)" : "scale(0)"};
    ${home && "margin: 0 12px"};
  
  }
  40% {
    transform: ${home ? "scale(0.8)" : "scale(0)"};
    ${home && "margin: 0 12px"};

  }

  100% {
    transform: scale(0.8);
    margin: 0 12px;

  }
`;

  const scaleS = keyframes`
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(0);
  }

  100% {
    transform: scale(0.6);
    margin: 0 12px;

  }
`;
  const EachIcon = styled(Grid)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;

    @media ${dv.desktop} {
      animation: ${scale} 2s ease forwards;
    }
    @media ${dv.mobileS} {
      animation: ${scaleS} 2s ease forwards;
    }
    opacity: 0.75;
    transition: 0.125s;
    :hover {
      opacity: 1;
    }
  `;

  return (
    <EachIcon onClick={onFuncs} item>
      {Icon}
      <T>{topic}</T>
    </EachIcon>
  );
};

const T = styled.div`
  font-size: 22px;
  margin-top: 16px;
`;

export { ButtonIcon };
