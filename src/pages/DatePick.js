import React, { useContext, Fragment, useState, useEffect } from "react";
import dayjs from "dayjs";
import Context from "../store/Context";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  DateRange,
  LocationOn,
  Bookmark,
  AccountBox,
  WatchLater,
  AddBox,
  AssignmentLateRounded,
  AssignmentTurnedIn,
  Class,
  NoSim,
  Mood
} from "@material-ui/icons";
import { findRoom, showTime, findLocation } from "../funcs/roomFuncs";

import WrapContainer from "../util/WrapContainer";

import { Grid } from "@material-ui/core";

import relativeTime from "dayjs/plugin/relativeTime";
import { oldTimeReset } from "../funcs/bookFuncs";
dayjs.extend(relativeTime);

const DatePick = ({ location, history }) => {
  const context = useContext(Context);
  const [loading, setloading] = useState(false);

  const {
    roomdata,
    bookPack,
    keepOldData,
    dispatch,
    bookdata,
    editState
  } = context;
  const { editbook, setEditbook } = editState;

  // useEffect(() => {
  //   if (editbook === "pick" && bookPack.roombook) {
  //     oldTimeReset(keepOldData, dispatch, bookdata, bookPack);
  //   }
  // }, [editbook]);

  if (!location.state) {
    sessionStorage.setItem("pathname", location.pathname);
    window.location.href = "/allbooks";
  } else {
    const {
      state: { data, date }
    } = location;

    const dateFormat = dayjs(date).format("D MMM YYYY");

    const dateTitle =
      dateFormat !== "Invalid Date" ? dateFormat : "(ไม่พบวันที่นี้)";

    document.title = date ? `รายการจอง ${dateTitle}` : "รายการจอง";

    const dateValues = data && Object.values(data);

    const displayDetail = data => {
      const dataValues = Object.values(data);

      return dataValues.map((res, i) => (
        <WrapOutside key={res.bookid}>
          {i !== 0 ? null : <Hr />}
          <Container container>
            <Item status={res.bookstatus} item xs={3}>
              <AccountBox style={{ marginRight: 4 }} />
              {res.username}
            </Item>
            <Item status={res.bookstatus} item xs={3}>
              <WatchLater style={{ marginRight: 4 }} />
              {keepOldData.oldData.timeStart
                ? showTime(
                    keepOldData.oldData.timeStart,
                    keepOldData.oldData.timeEnd
                  )
                : showTime(res.timeStart, res.timeEnd)}
            </Item>

            <Item status={res.bookstatus} item xs={3}>
              <AddBox style={{ marginRight: 4 }} />
              เมื่อ {dayjs(res.addBook).fromNow()}
            </Item>
            <Item status={res.bookstatus} item xs={3}>
              {res.bookstatus === "รอการยืนยัน" ||
              res.bookstatus === "รอหนังสือร้องขอ" ? (
                <AssignmentLateRounded style={{ marginRight: 4 }} />
              ) : (
                <AssignmentTurnedIn style={{ marginRight: 4 }} />
              )}
              {res.bookstatus}
            </Item>
          </Container>
          <Hr />
        </WrapOutside>
      ));
    };

    const Container = styled(Grid)`
      padding: 8px 0;
    `;

    const Item = styled(Grid)`
      font-size: 16px;
      color: ${props =>
        props.status === "รอการยืนยัน" || props.status === "รอหนังสือร้องขอ"
          ? "black"
          : "#274de8"};
      display: flex;
      align-items: center;
      padding: 12px;
      box-sizing: border-box;
    `;

    let bookValue = {};

    data &&
      dateValues.forEach((res, i) => {
        bookValue[findRoom(res.roomid, roomdata)] = {
          ...bookValue[findRoom(res.roomid, roomdata)],
          [res.bookid]: res
        };
      });

    const bookEntries = Object.entries(bookValue);

    const isSameDate = dayjs(date).isSame(
      dayjs(new Date()).format("YYYY,MM,DD")
    );

    const isAfter = dayjs(date).isAfter(new Date());

    const bookdate = dayjs(date).format("วันที่ D MMMM YYYY");

    const onChooseDate = () => {
      if (localStorage.hasOwnProperty("FBIdToken")) {
        setloading(true);
        sessionStorage.setItem("bookThis", true);
        setTimeout(() => {
          bookPack.setCreatePage("create");
          bookPack.setDatebook(new Date(date));
          history.push("/");
        }, 300);
      } else {
        history.push("/home");
      }
    };
    return (
      <WrapContainer
        datepick={date}
        onChooseDate={onChooseDate}
        loading={loading}
        icon={
          bookdate !== "Invalid Date" ? (
            <DateRange style={{ marginRight: 6 }} />
          ) : (
            <Mood style={{ marginRight: 6 }} />
          )
        }
        header={
          <Fragment>
            {bookdate !== "Invalid Date"
              ? `รายการจอง ${bookdate}`
              : `ไม่พบวันที่นี้ ขอบคุณสำหรับการทดสอบ!`}
          </Fragment>
        }
      >
        {!isAfter && !isSameDate ? (
          <NoBook>
            <NoSim fontSize={"large"} />
            ไม่สามารถจองได้
          </NoBook>
        ) : data ? (
          bookEntries.map((res, i) => {
            return (
              <Content bg={i} key={i}>
                <WrapRoomTopic to={`/rooms/${Object.values(res[1])[0].roomid}`}>
                  <Bookmark style={{ marginRight: 4 }} />
                  {res[0]}
                  <LocationOn style={{ marginRight: 2, marginLeft: 12 }} />
                  {findLocation(res[0], roomdata)}
                </WrapRoomTopic>
                <WrapDetail>{displayDetail(res[1])}</WrapDetail>
              </Content>
            );
          })
        ) : isSameDate || isAfter ? (
          <NoBook>
            <Class fontSize={"large"} />
            ไม่มีรายการจองวันนี้
          </NoBook>
        ) : (
          <NoBook>
            <NoSim fontSize={"large"} />
            ไม่สามารถจองได้
          </NoBook>
        )}
      </WrapContainer>
    );
  }
};

const Hr = styled.hr`
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
`;

const WrapOutside = styled.div`
  cursor: default;
  transition: 0.125s;
  :hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const NoBook = styled.div`
  opacity: 0.5;
  display: flex;
  justify-content: center;
  color: black;
  font-size: 18px;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  font-weight: bold;
`;
const WrapDetail = styled.div``;

const Content = styled.div`
  padding: 18px;
  box-sizing: border-box;
  border-bottom: rgba(0, 0, 0, 0.075) 8px solid;
  background: ${props =>
    props.bg % 2 === 0 ? "rgba(73, 148, 218, 0.125)" : "transparent"};
`;

const WrapRoomTopic = styled(Link)`
  color: black;
  font-size: 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  font-size: 18px;
  margin-bottom: 6px;
  font-weight: bold;
  color: #304ffe;
  text-decoration: none;
`;

export default DatePick;
