import React, { Fragment, useContext } from "react";
import Context from "../store/Context";
import styled, { keyframes } from "styled-components";
import { Close, AddCircleOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import dayjs from "dayjs";
const WrapContainer = ({
  datepick,
  header,
  children,
  icon,
  onChooseDate,
  loading
}) => {
  const context = useContext(Context);

  const currentDate = new Date();
  const expDate = dayjs(
    currentDate.setDate(currentDate.getDate() + context.bookPack.sentBefore)
  ).format("YYYY MM DD");

  const datecheck =
    dayjs(datepick).isAfter(dayjs(new Date(expDate)).format("YYYY MM DD")) ||
    dayjs(datepick).isSame(dayjs(new Date(expDate)).format("YYYY MM DD"));

  return (
    <Wrap>
      <WrapContent>
        <HeadText>
          {datepick && datecheck ? (
            <WrapBookDate
              onClick={() =>
                loading || context.bookPack.datebook === null
                  ? null
                  : onChooseDate(datepick)
              }
            >
              {loading ? (
                <CircularProgress size={25} style={{ marginLeft: 6 }} />
              ) : localStorage.hasOwnProperty("FBIdToken") ? (
                <Fragment>
                  <AddCircleOutline style={{ marginRight: 4 }} />
                  จองวันนี้
                </Fragment>
              ) : null}
            </WrapBookDate>
          ) : null}
          {icon}
          {header}
          <WrapClose>
            <Link to="/home">
              <Close fontSize="small" />
            </Link>
          </WrapClose>
        </HeadText>
        <WrapInside>{children}</WrapInside>
      </WrapContent>
    </Wrap>
  );
};

const WrapBookDate = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 6px;
  top: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.1s;
  color: #2962ff;
  :hover {
    color: rgb(210, 0, 0);
  }
`;
const WrapClose = styled.span`
  position: absolute;
  right: 6px;
  top: 6px;
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

const opacity = keyframes`
  0% {opacity:0;}
  100% {opacity:1;}
`;

const WrapInside = styled.div`
  height: inherit;
  overflow: auto;
`;
const WrapContent = styled.div`
  width: inherit;
  background: rgba(255, 255, 255, 0.85);
  height: inherit;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding-bottom: 38px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  box-sizing: border-box;
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

export default WrapContainer;
