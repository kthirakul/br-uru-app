import React from "react";
import { findLocation, findRoom, showTime } from "../../funcs/roomFuncs";
import {
  WatchLater,
  AssignmentLateRounded,
  AssignmentTurnedIn,
  Brightness4,
  Bookmark,
  LocationOn,
  AttachFile,
  LocalOffer,
  NoSim,
  ArrowBack,
  Create,
  DateRange,
  BookmarkBorder,
  WatchLaterOutlined,
  LocationOnOutlined,
  Brightness4Outlined,
  AssignmentLateOutlined,
  AssignmentTurnedInOutlined,
  BusinessCenterOutlined,
  DescriptionOutlined
} from "@material-ui/icons";
import styled, { keyframes } from "styled-components";
import { Tooltip, Grid, CircularProgress } from "@material-ui/core";
import dayjs from "dayjs";
import { emptyFunc } from "../../funcs/emptyFunc";
import { RenderMoreAssets } from "../BookScreen/renderBookScreen";

const onBackEdit = (status, setOnBook, history, keepMyBook, datebook) => {
  switch (status) {
    case "back":
      setOnBook("default");
      window.history.pushState(null, null, "/books");
      localStorage.removeItem("mybook");
      break;

    case "edit":
      history.push({ pathname: "/", state: { keepMyBook, datebook } });
      break;
    default:
      break;
  }
};

// d = Data Object from ListScreen
export const renderPickedBook = d => {
  const { keepMyBook, setOnBook, onBook, roomdata, history } = d;
  const {
    assets,
    timeStart,
    username,
    detail,
    timeEnd,
    bookid,
    addBook,
    roomid,
    expired,
    bookstatus
  } = keepMyBook;

  const mybook = JSON.parse(localStorage.getItem("mybook"));
  const date = dayjs(new Date(mybook.datebook)).format("DD MMM YYYY");
  const exp = dayjs(new Date(expired)).format("DD MMM YYYY");

  return (
    <WrapSeeBook inBook={onBook}>
      {onBook === "loading" ? (
        <WrapLoadDis>
          <CircularProgress style={{ marginBottom: 24 }} />
          <span>กำลังเปิด..</span>
        </WrapLoadDis>
      ) : (
        onBook === "finish" && (
          <WrapDetailOpen>
            <WrapTopDetailPick>
              <WrapTopMenu>
                <TopMenu arrow onClick={() => onBackEdit("back", setOnBook)}>
                  <ArrowBack style={{ marginRight: 4 }} />
                  กลับ
                </TopMenu>
                <TopMenu>รหัสที่ {bookid}</TopMenu>

                <TopMenu
                  arrow
                  onClick={() =>
                    bookstatus === "ยืนยันแล้ว" || bookstatus === "รอการยืนยัน"
                      ? emptyFunc()
                      : onBackEdit(
                          "edit",
                          setOnBook,
                          history,
                          keepMyBook,
                          mybook.datebook
                        )
                  }
                >
                  <Create style={{ marginRight: 4 }} />
                  {bookstatus === "ยืนยันแล้ว" || bookstatus === "รอการยืนยัน"
                    ? "ไม่สามารแก้ไขได้"
                    : "แก้ไขการจอง"}
                </TopMenu>
              </WrapTopMenu>
              <WrapFlow>
                <WrapOwn>
                  <div>
                    <span>จองโดย</span> <span>{username}</span>
                  </div>

                  <div>
                    <span>ทำรายการเมื่อ</span>{" "}
                    {dayjs(addBook).format("D MMM YYYY HH:mm น.")} (
                    {dayjs(addBook).fromNow()})
                  </div>
                </WrapOwn>

                <BookContent spacing={2} container>
                  <BookItem item xs={4}>
                    <BookIn>
                      <DateRange style={{ marginBottom: 6 }} />
                      <span>วันที่จอง</span>
                      <Detail>{date}</Detail>
                    </BookIn>
                  </BookItem>
                  <BookItem item xs={4}>
                    <BookIn>
                      <BookmarkBorder style={{ marginBottom: 4 }} />
                      <span>ห้อง</span>
                      <Detail>{findRoom(roomid, roomdata)}</Detail>
                    </BookIn>
                  </BookItem>
                  <BookItem item xs={4}>
                    <BookIn>
                      <WatchLaterOutlined style={{ marginBottom: 6 }} />
                      <span>เวลา</span>
                      <Detail>{showTime(timeStart, timeEnd)}</Detail>
                    </BookIn>
                  </BookItem>

                  <BookItem item xs={4}>
                    <BookIn>
                      <LocationOnOutlined style={{ marginBottom: 4 }} />
                      <span>สถานที่</span>
                      <Detail>
                        {findLocation(findRoom(roomid, roomdata), roomdata)}
                      </Detail>
                    </BookIn>
                  </BookItem>

                  <BookItem item xs={4}>
                    <BookIn>
                      <Brightness4Outlined style={{ marginBottom: 6 }} />
                      <span>วันหมดอายุ</span>
                      <Detail>
                        {bookstatus === "รอหนังสือร้องขอ"
                          ? exp
                          : "ไม่หมดอายุจนถึงวันใช้ห้อง"}
                      </Detail>
                    </BookIn>
                  </BookItem>

                  <BookItem item xs={4}>
                    <BookIn>
                      {bookstatus === "รอการยืนยัน" ||
                      bookstatus === "รอหนังสือร้องขอ" ? (
                        <AssignmentLateOutlined style={{ marginBottom: 4 }} />
                      ) : (
                        <AssignmentTurnedInOutlined
                          style={{ marginBottom: 4 }}
                        />
                      )}
                      <span>สถานะ</span>
                      <Detail>{bookstatus}</Detail>
                    </BookIn>
                  </BookItem>

                  <BookItem item xs={12}>
                    <BookIn other>
                      <BusinessCenterOutlined style={{ marginRight: 4 }} />
                      <span style={{ marginRight: 12 }}>อุปกรณ์</span>
                      <Detail>{assets ? RenderMoreAssets(assets) : "-"}</Detail>
                    </BookIn>
                  </BookItem>

                  <BookItem item xs={12}>
                    <BookIn other>
                      <DescriptionOutlined style={{ marginRight: 4 }} />
                      <span style={{ marginRight: 12 }}>หมายเหตุ</span>
                      <Detail>{detail ? detail : "-"}</Detail>
                    </BookIn>
                  </BookItem>
                </BookContent>
              </WrapFlow>
            </WrapTopDetailPick>
          </WrapDetailOpen>
        )
      )}
    </WrapSeeBook>
  );
};

const WrapFlow = styled.div`
  padding: 12px 18px;
  overflow: auto;
`;

const Detail = styled.div`
  color: #0013e8;
`;

const WrapOwn = styled.div`
  display: flex;
  font-size: 16px;
  margin: 24px;
  flex-direction: column;
  align-items: center;
`;

const BookIn = styled.div`
  display: flex;
  flex-direction: ${props => !props.other && "column"};
  align-items: center;
  padding: 12px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  width: 100%;
  border-radius: 12px;
  background: #ffffff52;
`;

const BookItem = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BookContent = styled(Grid)`
  font-size: 16px;
`;

const detailAnimated = keyframes`
  0% {
      opacity:0;
      transform: scale(0);
  }

  100% {
    opacity:1;
    transform: scale(1);
  }
`;

const WrapDetailOpen = styled.div`
  display: flex;
  width: inherit;
  height: inherit;
  animation: ${detailAnimated} 0.75s ease forwards;
  box-sizing: border-box;
`;

const WrapLoadDis = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
  color: black;
  width: inherit;
`;
const opacity = keyframes`
  0% {
      opacity:0;
  }

  100% {
    opacity:1;
  }
`;

const WrapTopMenu = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.25);
`;

const WrapTopDetailPick = styled.div`
  display: flex;
  width: 100%;
  color: black;
  flex-direction: column;
`;

const TopMenu = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => (props.arrow ? "16px" : "20px")};
  cursor: ${props => (props.arrow ? "pointer" : "default")};
  :hover {
    opacity: ${props => (props.arrow ? 0.6 : 1)};
  }
`;

const WrapSeeBook = styled.div`
  margin-top: ${props =>
    props.inBook === "loading" ? "36px" : props.inBook === "finish" && "0"};
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  width: ${props =>
    props.inBook === "loading"
      ? "160px"
      : props.inBook === "finish" && "725px"};

  height: ${props =>
    props.inBook === "loading" ? "160px" : props.inBook === "finish" && "100%"};

  transition: 1s;
  background: rgba(255, 255, 255, 0.8);
  border-top-left-radius: ${props =>
    props.inBook === "finish" ? "12px" : "48px"};
  border-top-right-radius: ${props =>
    props.inBook === "finish" ? "12px" : "48px"};
  border-bottom-left-radius: ${props =>
    props.inBook === "finish" ? 0 : "48px"};
  border-bottom-right-radius: ${props =>
    props.inBook === "finish" ? 0 : "48px"};
  display: flex;
  align-items: center;
`;

export const renderListScreen = (booksort, list, seeBook, roomdata) => {
  return Object.keys(booksort).length > 0 ? (
    <div>
      {Object.entries(booksort).map((datebook, i) => {
        return (
          Object.values(datebook[1]).length > 0 && (
            <WrapInside key={i}>
              <WrapDate>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <WrapStatus style={{ marginRight: 6 }}>
                    รายการจองวันที่
                  </WrapStatus>
                  {dayjs(datebook[0]).format("D MMMM YYYY")}{" "}
                </div>

                <WrapStatus>({list})</WrapStatus>
              </WrapDate>

              <WrapItem>
                {Object.values(datebook[1]) &&
                  Object.values(datebook[1]).map((res, i) => {
                    return (
                      <Tooltip
                        onClick={() => seeBook(res, datebook[0])}
                        key={i}
                        title="กดเพื่อดูข้อมูลเพิ่มเติม"
                      >
                        <WrapItemIn container index={i}>
                          <WrapTopDetail bookid>
                            <AttachFile />
                            รหัสจอง {res.bookid}
                          </WrapTopDetail>

                          <WrapTopDetail>
                            ทำรายการเมื่อ{" "}
                            {dayjs(res.addBook).format("D MMM YYYY HH:mm น.")} (
                            {dayjs(res.addBook).fromNow()})
                          </WrapTopDetail>

                          <WrapEach item xs={4}>
                            <Bookmark style={{ marginRight: 4 }} />

                            {findRoom(res.roomid, roomdata)}
                          </WrapEach>

                          <WrapEach item xs={4}>
                            <LocationOn style={{ marginRight: 4 }} />

                            {findLocation(
                              findRoom(res.roomid, roomdata),
                              roomdata
                            )}
                          </WrapEach>

                          <WrapEach item xs={4}>
                            <WatchLater style={{ marginRight: 4 }} />
                            เวลา {showTime(res.timeStart, res.timeEnd)}
                          </WrapEach>

                          <WrapEach item xs={4}>
                            {res.bookstatus === "รอการยืนยัน" ||
                            res.bookstatus === "รอหนังสือร้องขอ" ? (
                              <AssignmentLateRounded
                                style={{ marginRight: 4 }}
                              />
                            ) : (
                              <AssignmentTurnedIn style={{ marginRight: 4 }} />
                            )}
                            สถานะ {res.bookstatus}
                          </WrapEach>

                          <WrapEach item xs={4}>
                            <Brightness4 style={{ marginRight: 4 }} />

                            {res.bookstatus === "รอหนังสือร้องขอ"
                              ? `หมดอายุ ${dayjs(res.expired).format(
                                  "D MMM YYYY"
                                )}`
                              : "ไม่มีเวลาสิ้นสุด"}
                          </WrapEach>

                          <WrapEach item xs={4}>
                            <LocalOffer style={{ marginRight: 4 }} />
                            ดูข้อมูลเพิ่มเติม...
                          </WrapEach>
                        </WrapItemIn>
                      </Tooltip>
                    );
                  })}
              </WrapItem>
            </WrapInside>
          )
        );
      })}
    </div>
  ) : (
    <WrapNoData>
      <SNoSim fontSize="large" />
      ไม่มีรายการ
    </WrapNoData>
  );
};

const WrapTopDetail = styled.div`
  display: Flex;
  align-items: center;
  font-size: 14px;
  position: absolute;
  top: 7px;
  color: #565656;
  ${props => (props.bookid ? "left: 6px;" : "right: 10px;")}
`;

const WrapStatus = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4px;
`;
const WrapItemIn = styled(Grid)`
  position: relative;
  z-index: 0;
  color: black;
  padding: 36px 18px 18px 18px;
  background: ${props =>
    props.index % 2 !== 0
      ? "rgba(227, 221, 255, 0.75)"
      : "rgba(255,255,255, 0.75)"};
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.4);
  transition: 0.1s;
  :hover {
    z-index: 1;
    box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.85);
    transform: scale(1.025);
    background: ${props =>
      props.index % 2 !== 0
        ? "rgba(227, 221, 255, 0.9)"
        : "rgba(255,255,255, 0.9)"};
  }
`;

const WrapEach = styled(Grid)`
  display: flex;
  padding: 8px;
  box-sizing: border-box;
`;

const WrapInside = styled.div`
  width: 728px;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`;

const WrapDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WrapItem = styled.div`
  font-size: 16px;
`;

const SNoSim = styled(NoSim)`
  transform: scale(1.6);
  margin-bottom: 30px;
`;

const WrapNoData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  margin-top: 12px;
  opacity: 0;
  animation: ${opacity} 1s ease forwards;
`;
