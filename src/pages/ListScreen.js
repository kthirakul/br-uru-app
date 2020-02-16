import React, { useContext, useState, Fragment, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { countBook, changeBook } from "../funcs/AllBookFunc";
import Context from "../store/Context";
import NoData from "./NoData";
import CheckAuth from "../util/CheckAuth";
import dayjs from "dayjs";
import {
  AccessTime,
  Check,
  CallMade,
  HourglassEmptyOutlined,
  LocalLibraryOutlined,
  ViewDayOutlined
} from "@material-ui/icons";
import {
  CircularProgress,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  renderListScreen,
  renderPickedBook
} from "../components/ListScreen/renderListScreen";
import { oldTimeReset } from "../funcs/bookFuncs";

dayjs.extend(relativeTime);

const ListScreen = ({ history }) => {
  const context = useContext(Context);
  const {
    userData: { email },
    firstLoad,
    roomdata,
    mybookState,
    bookdata,
    keepOldData,
    dispatch,
    bookPack
  } = context;
  const [list, setlist] = useState("ทั้งหมด");
  const [onBook, setOnBook] = useState("default");
  const { booksort, setBooksort, bookdef } = mybookState;
  const [keepMyBook, setkeepMyBook] = useState({});
  const theme = createMuiTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: "1em"
        }
      }
    }
  });

  useEffect(() => {
    if (localStorage.hasOwnProperty("mybook")) {
      if (bookPack.roombook) {
        oldTimeReset(keepOldData, dispatch, bookdata, bookPack);
        localStorage.removeItem("mybook");
      }
    }
  }, []);

  useEffect(() => {
    const pathname = window.location.pathname.slice(
      7,
      window.location.pathname.length
    );
    const mybook = JSON.parse(localStorage.getItem("mybook"));
    let datebook, bookid;

    if (mybook) {
      datebook = mybook.datebook;
      bookid = mybook.bookid;
    } else {
      history.push("/books");
    }
    if (
      localStorage.hasOwnProperty("mybook") &&
      Object.keys(bookdata).length > 0
    ) {
      setOnBook("loading");
      if (bookdata[datebook]) {
        const findbook = bookdata[datebook].find(res => res.bookid === bookid);
        if (pathname === bookid && findbook) {
          setkeepMyBook(findbook);
          setTimeout(() => {
            setOnBook("finish");
          }, 1000);
        } else {
          history.push("/books");
          setOnBook("default");
        }
      }
    }
  }, [bookdata]);

  const WrapButton = (topic, icon) => {
    const count = str => {
      switch (str) {
        case "ประวัติการจอง":
          return `(${countBook(bookdef).all})`;

        case "ยืนยันแล้ว":
          return `(${countBook(bookdef).confirm})`;

        case "รอการยืนยัน":
          return `(${countBook(bookdef).proceed})`;

        case "รอหนังสือร้องขอ":
          return `(${countBook(bookdef).waiting})`;
        default:
          break;
      }
    };

    return topic.map((res, i) => (
      <SButton
        onClick={() => changeBook(res, bookdef, history, setBooksort, setlist)}
        key={i}
      >
        <div style={{ width: 40 }}>{icon[i]}</div>
        {res} {count(res)}
      </SButton>
    ));
  };

  const seeBook = (keep, datebook) => {
    const state = {
      datebook,
      bookid: keep.bookid
    };

    localStorage.setItem("mybook", JSON.stringify(state));
    window.history.pushState(null, null, `/books/${keep.bookid}`);
    setkeepMyBook(keep);
    setOnBook("loading");
    setTimeout(() => {
      setOnBook("finish");
    }, 500);
  };

  const renderData = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <WrapWhole>
          {firstLoad || onBook === "finish" ? null : (
            <WrapMenu>
              <WrapLeft>
                {WrapButton(
                  [
                    `ประวัติการจอง`,
                    `ยืนยันแล้ว`,
                    `รอการยืนยัน`,
                    `รอหนังสือร้องขอ`
                  ],
                  [
                    <AccessTime />,
                    <Check />,
                    <CallMade />,
                    <HourglassEmptyOutlined />
                  ]
                )}
              </WrapLeft>

              <WrapLeft>
                {WrapButton(
                  [
                    email === "br.uru.app@gmail.com"
                      ? "ระบบผู้ดูแล"
                      : "จองห้องเพิ่ม",
                    "เช็คการจอง"
                  ],
                  [<LocalLibraryOutlined />, <ViewDayOutlined />]
                )}
              </WrapLeft>
            </WrapMenu>
          )}

          <WrapContent>
            {firstLoad ? (
              <WrapLoadBook>
                <CircularProgress
                  color="inherit"
                  style={{ marginBottom: 24 }}
                />
                กำลังโหลดการจอง..
              </WrapLoadBook>
            ) : onBook !== "default" ? (
              renderPickedBook({
                keepMyBook,
                setOnBook,
                onBook,
                roomdata,
                history
              })
            ) : (
              <Fragment>
                {renderListScreen(booksort, list, seeBook, roomdata)}
              </Fragment>
            )}
          </WrapContent>
        </WrapWhole>
      </MuiThemeProvider>
    );
  };

  return (
    <CheckAuth
      title={
        Object.keys(keepMyBook).length > 0 &&
        window.location.pathname.slice(7, window.location.pathname.length) ===
          keepMyBook.bookid
          ? `การจอง ${keepMyBook.bookid}`
          : "ประวัติการจอง"
      }
      data={renderData()}
      noData={<NoData page={"ประวัติการจอง"} />}
      noDataTitle={"BR URU"}
    />
  );
};

const WrapLoadBook = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
`;

const opacity = keyframes`
  0% {
      opacity:0;
  }

  100% {
    opacity:1;

  }
`;

const SButton = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 16px 6px 12px;
  transition: 0.125s;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  cursor: pointer;
  :hover {
    background: rgba(0, 0, 0, 0.25);
    color: white;
  }
`;

const WrapLeft = styled.div`
  border-radius: 12px;
  overflow: hidden;
  font-size: 14px;
  margin-bottom: 36px;
  border: solid rgba(255, 255, 255, 0.5) 1.25px;
  padding: 6px 0;
`;

const WrapMenu = styled.div`
  position: absolute;
  top: 0;
  left: 21px;
`;

const WrapContent = styled.div`
  display: flex;
  overflow: auto;
  width: 100%;
  justify-content: center;
`;

const WrapWhole = styled.div`
  font-size: 28px;
  color: white;
  width: 100%;
  display: flex;
  animation: ${opacity} 0.25s ease forwards;
  position: relative;
`;

export default ListScreen;
