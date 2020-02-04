import React, { Fragment } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import thLocale from "date-fns/locale/th";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  List,
  InfoOutlined,
  MailOutline,
  CheckCircleOutline,
  Create,
  AddCircleOutline,
  Beenhere,
  CreateOutlined,
  BookOutlined,
  Bookmarks,
  ArrowBack,
  DeleteSweepOutlined,
  SaveAlt,
  Search,
  LocationOffOutlined
} from "@material-ui/icons";
import { CircularProgress, Button, Grid } from "@material-ui/core";
import dayjs from "dayjs";
import { listData, menus } from "./BookData";
import { findRoom, showTime } from "../../funcs/roomFuncs";
import {
  bookRoom,
  bookChecked,
  checkDateExp,
  setBookTime,
  saveEditBook
} from "../../funcs/bookFuncs";
import { emptyFunc } from "../../funcs/emptyFunc";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  WrapAdmin,
  SHeaderAdmin,
  TAdmin,
  WrapSearch,
  SInputAdmin,
  WrapAuto
} from "../../styled/BookStyled";
import { renderAllBook } from "../AllBooks/AllBookComps";
dayjs.extend(relativeTime);

const renderNoVerified = setOpen => {
  return (
    <Fragment>
      <InfoIcon fontSize="large" />
      <span style={{ fontSize: 26, marginTop: 18 }}>
        กรุณายืนยันอีเมลเพื่อใช้งานระบบ
      </span>
      <span
        style={{
          textAlign: "center",
          fontSize: 16
        }}
      >
        หากท่านยังไม่ได้รับอีเมล สามารถกด Link ด้านล่างเพื่อขอรับอีเมลอีกครั้ง
      </span>

      <WrapSentEmail onClick={() => setOpen(true)}>
        <SButton>
          <MailIcon fontSize="large" style={{ marginRight: 6 }} />
          <span
            style={{
              fontSize: 14,
              color: "#515bff"
            }}
          >
            ส่งอีเมลอีกครั้ง
          </span>
        </SButton>
      </WrapSentEmail>
    </Fragment>
  );
};

export const dialogRemove = () => {
  return <WrapContent>คุณต้องการลบการจองนี้หรือไม่?</WrapContent>;
};

export const dialogChangeStatus = () => {
  return <WrapContent>โปรดตรวจสอบก่อนทำการเปลี่ยนสถานะ</WrapContent>;
};

export const dialogDetailAdmin = d => {
  const styles = {
    detail: {
      textDecoration: "underline",
      color: "blue"
    },
    top: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12
    }
  };

  return (
    <WrapContent>
      <div style={styles.top}>
        <span>
          สร้างเมื่อ {dayjs(d.addBook).format("D MMM YYYY เวลา HH:mm น.")} (
          {dayjs(d.addBook).fromNow()})
        </span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <span style={styles.detail}>อุปกรณ์</span> :{" "}
        {d.assets ? RenderMoreAssets(d.assets, "admin") : " - "}
      </div>
      <div>
        <span style={styles.detail}>หมายเหตุ</span> :{" "}
        {d.detail ? d.detail : " - "}
      </div>
    </WrapContent>
  );
};
const detailDialog = (loading, success, userSelf, passRef, errors) => {
  return loading ? (
    <WrapLoadinResent>
      <div style={{ marginBottom: 16 }}>
        {success ? <PassedIcon /> : <CircularProgress />}
      </div>
      <span style={{ color: success ? "#645ef2" : "black" }}>
        {success ? "ส่งอีเมลเรียบร้อยแล้ว!" : "กำลังส่งอีเมล.."}
      </span>
    </WrapLoadinResent>
  ) : (
    <WrapContent>
      <EmailSelf>{userSelf.email}</EmailSelf>
      <SInput
        ref={passRef}
        type="password"
        placeholder="ใส่รหัสผ่านเพื่อส่งอีเมลยืนยัน"
      />
      <span style={{ color: "red" }}>
        {errors.password && errors.password}
        {errors.general && errors.general}
      </span>
    </WrapContent>
  );
};

// d = Data from BookScreen

const HeaderAdmin = ({ status, item, d, updateSearch }) => {
  return (
    <SHeaderAdmin>
      <TAdmin>
        {item.icon} {item.menu}
      </TAdmin>
      {status && (
        <WrapSearch>
          <Search />
          <SInputAdmin
            placeholder="ค้นหาจากรหัสการจอง"
            value={d.search}
            onChange={updateSearch}
            type="text"
          />
        </WrapSearch>
      )}
    </SHeaderAdmin>
  );
};

export const renderAdmin = d => {
  let filterBook = {};
  let newBook = {};
  let bookArr = [];
  Object.entries(d.bookdata).forEach((books, i) => {
    books[1].forEach(res => {
      if (
        d.search &&
        res.bookid.toLowerCase().indexOf(d.search.toLowerCase()) !== -1
      ) {
        bookArr.push(res);
        newBook = {
          [books[0]]: bookArr
        };
        Object.assign(filterBook, newBook);
      }
    });
    if (Object.keys(filterBook).indexOf(books[0]) !== -1) {
      bookArr = [];
    }
  });

  const item = menus(d.admin, true).find(res => {
    return res.menu === d.adminPage;
  });

  const updateSearch = e => {
    d.setSearch(e.target.value);
  };

  switch (d.adminPage) {
    case "จัดการการจอง":
      return (
        <WrapAdmin>
          <HeaderAdmin status item={item} d={d} updateSearch={updateSearch} />
          <WrapAuto>
            {Object.keys(filterBook && d.search ? filterBook : d.bookdata)
              .length > 0 ? (
              renderAllBook(
                filterBook && d.search ? filterBook : d.bookdata,
                d.roomdata,
                d.admin,
                d.setOpen,
                d.setMore,
                d.newStatus,
                d.setNewStatus,
                d.loading,
                d.setLoading
              )
            ) : (
              <NoData>
                <LocalOff fontSize="large" />
                ไม่มีรายการจอง
              </NoData>
            )}
          </WrapAuto>
        </WrapAdmin>
      );

    case "ตั้งค่าการจอง":
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
          <WrapAuto>
            start booksetting

          </WrapAuto>
        </WrapAdmin>
      );

    case "ลบการจอง":
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
        </WrapAdmin>
      );

    case "จัดการห้อง":
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
        </WrapAdmin>
      );

    case "จัดการผู้ใช้":
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
        </WrapAdmin>
      );

    case "แก้ไขการติดต่อ":
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
        </WrapAdmin>
      );

    default:
      return;
  }
};

const LocalOff = styled(LocationOffOutlined)`
  transform: scale(1.6);
  margin-bottom: 22px;
`;

const NoData = styled.div`
  width: 100%;
  margin-top: 44px;
  font-size: 22px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const renderTabMenu = (
  setPage,
  setEditbook,
  admin,
  setadminPage,
  hold,
  setHold
) => {
  const onSetPage = (page, amenu) => {
    if (admin) {
      setadminPage(amenu);
    }
    if (page === "booking") {
      setEditbook("pick");
    }
    setPage(page);
    setHold(amenu);
  };

  return (
    <Fragment>
      <WrapChoose head>
        <List style={{ marginRight: 18 }} />
        เมนู
      </WrapChoose>
      {menus(admin).map((res, i) => (
        <WrapChoose
          key={i}
          onClick={() => onSetPage(res.page, res.menu)}
          hold={hold}
          menu={res.menu}
        >
          {res.icon}
          {res.menu}
        </WrapChoose>
      ))}
    </Fragment>
  );
};

const addData = (
  topic,
  bookPack,
  roomdata,
  loading,
  errorBook,
  bookdata,
  editbook
) => {
  const currentDate = new Date();
  const sentBefore = currentDate.setDate(
    currentDate.getDate() + bookPack.sentBefore
  );

  const datepick = dayjs(bookPack.datebook).format("YYYY,MM,DD");
  switch (topic) {
    case "วันที่":
      return editbook ? (
        <Fragment>
          <BgPick>
            <div style={{ marginBottom: 12, marginRight: 12 }}>
              {dayjs(bookPack.datebook).format("D MMM YYYY")}
            </div>
          </BgPick>
          <div style={{ marginLeft: 6, color: "#b30000" }}>
            <i>*ไม่สามารถแก้ไขวันที่ได้</i>
          </div>
        </Fragment>
      ) : (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={thLocale}>
          <BgPick>
            {bookPack.datebook ? (
              <DatePicker
                minDate={sentBefore}
                style={{ marginTop: 0, width: 120 }}
                disableToolbar
                InputProps={{
                  disableUnderline: true
                }}
                // variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                value={bookPack.datebook}
                onChange={date => bookPack.setDatebook(date)}
              />
            ) : (
              <CircularProgress size={30} style={{ marginRight: 12 }} />
            )}
          </BgPick>
        </MuiPickersUtilsProvider>
      );

    case "เวลาเริ่ม":
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Fragment>
            <BgPick>
              <TimePicker
                ampm={false}
                InputProps={{
                  disableUnderline: true
                }}
                style={{ marginTop: 0, width: 120 }}
                margin="normal"
                value={bookPack.timeStart}
                onChange={bookPack.setTimeStart}
              />
            </BgPick>

            {errorBook && Object.keys(errorBook).length > 0
              ? errorBook.startError && (
                  <WrapErrorBook>
                    <InfoOutlined style={{ marginRight: 4 }} />

                    <WrapTextError>
                      {errorBook.startError}

                      <Link
                        to={{
                          pathname: `/allbooks/${datepick}`,
                          state: {
                            date: datepick,
                            data: bookdata[datepick]
                          }
                        }}
                      >
                        เช็คการจอง
                      </Link>
                    </WrapTextError>
                  </WrapErrorBook>
                )
              : null}
          </Fragment>
        </MuiPickersUtilsProvider>
      );
    case "เวลาสิ้นสุด":
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Fragment>
            <BgPick>
              <TimePicker
                ampm={false}
                InputProps={{
                  disableUnderline: true
                }}
                style={{ marginTop: 0, width: 120 }}
                margin="normal"
                value={bookPack.timeEnd}
                onChange={bookPack.setTimeEnd}
              />
            </BgPick>
            {errorBook && Object.keys(errorBook).length > 0
              ? errorBook.endError && (
                  <WrapErrorBook>
                    <InfoOutlined style={{ marginRight: 4 }} />

                    <WrapTextError>
                      {errorBook.endError}

                      <Link
                        to={{
                          pathname: `/allbooks/${datepick}`,
                          state: {
                            date: datepick,
                            data: bookdata[datepick]
                          }
                        }}
                      >
                        เช็คการจอง
                      </Link>
                    </WrapTextError>
                  </WrapErrorBook>
                )
              : null}
          </Fragment>
        </MuiPickersUtilsProvider>
      );
    case "ห้อง":
      return editbook ? (
        <Fragment>
          <BgPick>
            <div style={{ marginBottom: 12, marginRight: 12 }}>
              {findRoom(bookPack.roombook, roomdata)}
            </div>
          </BgPick>
          <div style={{ marginLeft: 6, color: "#b30000" }}>
            <i>*ไม่สามารถแก้ไขห้องได้</i>
          </div>
        </Fragment>
      ) : roomdata.length > 0 ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <SSelect
            value={bookPack.roombook}
            onChange={e => bookPack.setRoombook(e.target.value)}
          >
            <Option choose value="">
              เลือกห้อง
            </Option>
            {roomdata.map(room => (
              <Option key={room.roomid} value={room.roomid}>
                {room.roomname}
              </Option>
            ))}
          </SSelect>
          {errorBook && Object.keys(errorBook).length > 0
            ? errorBook.roomError && (
                <WrapErrorBook>
                  <InfoOutlined style={{ marginRight: 4 }} />
                  กรุณาเลือกห้อง
                </WrapErrorBook>
              )
            : null}
        </div>
      ) : (
        <BgPick loading={loading.toString()}>
          <CircularProgress size={30} />
        </BgPick>
      );

    case "อุปกรณ์":
      return (
        <SInputPS
          value={bookPack.assets}
          onChange={e => bookPack.setAssets(e.target.value)}
          placeholder="เพิ่มอุปกรณ์ เช่น โต๊ะ 4 ตัว, เก้าอี้ 8 ตัว, ไมค์ลอย 2 ตัว"
        />
      );

    case "หมายเหตุ":
      return (
        <SInputPS
          value={bookPack.notebook}
          onChange={e => bookPack.setNotebook(e.target.value)}
          placeholder="เพิ่มหมายเหตุ"
        />
      );
    default:
      break;
  }
};

const WrapTextError = styled.div`
  display: flex;
  flex-direction: column;
`;

const WrapErrorBook = styled.div`
  display: flex;
  align-items: center;
  color: #b30000;
  margin-left: 6px;
  font-weight: bold;
`;

export const onSetEdit = (
  editState,
  book,
  storeBooking,
  bookPack,
  bookdata,
  date,
  dispatch,
  setKeepBookid,
  keepOldData
) => {
  const { datebook, timeStart, timeEnd, roombook, assets, notebook } = bookPack;

  const data = Object.assign(
    {},
    {
      datebook,
      timeStart,
      timeEnd,
      roombook,
      assets,
      notebook
    }
  );

  setKeepBookid(book.bookid);
  editState.setEditbook("edit");
  storeBooking.setstoreBook(data);
  bookPack.setDatebook(new Date(date));
  bookPack.setTimeStart(book.timeStart);
  bookPack.setTimeEnd(book.timeEnd);
  bookPack.setRoombook(book.roomid);
  bookPack.setAssets(book.assets);
  bookPack.setNotebook(book.detail);

  setBookTime(dispatch, bookdata, date, book, keepOldData, bookPack);
};

const renderEditScreen = (
  firstLoad,
  bookdefEntries,
  roomdata,
  editState,
  storeBooking,
  bookPack,
  bookdata,
  dispatch,
  setKeepBookid,
  keepOldData
) => {
  return (
    <WrapView>
      <EditList top={"true"} container>
        <EditItem item xs={2}>
          วันที่จอง
        </EditItem>
        <EditItem item xs={2}>
          เวลาใช้งาน
        </EditItem>
        <EditItem item xs={2}>
          ห้องที่ใช้
        </EditItem>
        <EditItem item xs={2}>
          วันหมดอายุ
        </EditItem>
        <EditItem item xs={2}>
          ทำรายการเมื่อ
        </EditItem>
      </EditList>
      {firstLoad ? (
        <EditLoading>
          <CircularProgress />
        </EditLoading>
      ) : bookdefEntries.length > 0 ? (
        bookdefEntries.map((date, idate) => {
          return Object.values(date[1]).map((book, ibook) => (
            <EditList container key={ibook}>
              <EditItem item xs={2}>
                {dayjs(date[0]).format("D/MM/YYYY")}
              </EditItem>
              <EditItem item xs={2}>
                {showTime(book.timeStart, book.timeEnd)}
              </EditItem>
              <EditItem item xs={2}>
                {findRoom(book.roomid, roomdata)}
              </EditItem>
              <EditItem item xs={2}>
                {dayjs(book.expired).format("D/MM/YYYY")}
              </EditItem>
              <EditItem item xs={2}>
                {dayjs(book.addBook).fromNow()}
              </EditItem>
              <EditItem item xs={2}>
                <EditButton
                  onClick={() =>
                    onSetEdit(
                      editState,
                      book,
                      storeBooking,
                      bookPack,
                      bookdata,
                      date[0],
                      dispatch,
                      setKeepBookid,
                      keepOldData
                    )
                  }
                >
                  <Create style={{ marginRight: 4 }} />
                  แก้ไข
                </EditButton>
              </EditItem>
            </EditList>
          ));
        })
      ) : (
        <WrapNoList>ยังไม่มีรายการจอง</WrapNoList>
      )}
    </WrapView>
  );
};

const WrapNoList = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const renderEditBook = (
  mybookState,
  bookPack,
  firstLoad,
  roomdata,
  editState,
  loading,
  bookdata,
  storeBooking,
  dispatch,
  keepBookid,
  setKeepBookid,
  keepOldData,
  setLoading,
  setOpen,
  editLoad
) => {
  const { bookdef } = mybookState;
  const bookdefEntries = Object.entries(bookdef.waiting);
  const errorBook = bookChecked(bookPack, bookdata, roomdata);
  const editbook = true;

  return (
    <WrapDisplay>
      <WrapTopic>
        {editState.editbook === "edit" && (
          <ButtonEdit
            backChoose
            onClick={() => editState.setEditbook("pick")}
            style={{ marginRight: 6 }}
          >
            <ArrowBack style={{ marginRight: 2 }} />
            <span style={{ fontSize: 14 }}>กลับ</span>
          </ButtonEdit>
        )}
        <WrapInCreate>
          <Bookmarks style={{ marginRight: 4 }} />

          <span style={{ fontWeight: "bold" }}>
            แก้ไขการจอง{" "}
            <span style={{ color: "red" }}>
              {editState.editbook === "pick"
                ? " (เฉพาะรอหนังสือร้องขอ)"
                : `รหัสที่ ${keepBookid}`}
            </span>
          </span>
        </WrapInCreate>
        {editState.editbook === "edit" &&
          (loading ? (
            <CircularProgress />
          ) : (
            <ButtonEdit
              wrapedit
              style={{ display: "flex", alignItems: "center" }}
            >
              <CreateText
                remBook
                style={{ marginRight: 6 }}
                onClick={() => setOpen(true)}
              >
                <SCreateButton color="inherit">
                  <WrapAddBook>
                    <DeleteSweepOutlined style={{ marginRight: 4 }} />
                    ลบการจองนี้
                  </WrapAddBook>
                </SCreateButton>
              </CreateText>

              <CreateText
                onClick={() =>
                  saveEditBook(
                    bookPack,
                    keepBookid,
                    setLoading,
                    editState.setEditbook,
                    keepOldData,
                    dispatch,
                    bookdata,
                    roomdata
                  )
                }
              >
                <SCreateButton color="inherit">
                  <WrapAddBook>
                    <SaveAlt style={{ marginRight: 4 }} />
                    บันทึกข้อมูล
                  </WrapAddBook>
                </SCreateButton>
              </CreateText>
            </ButtonEdit>
          ))}
      </WrapTopic>
      {editLoad === true ? (
        <WrapEditLoad>
          <CircularProgress style={{ marginTop: 24 }} />
        </WrapEditLoad>
      ) : editState.editbook === "pick" ? (
        renderEditScreen(
          firstLoad,
          bookdefEntries,
          roomdata,
          editState,
          storeBooking,
          bookPack,
          bookdata,
          dispatch,
          setKeepBookid,
          keepOldData
        )
      ) : (
        listData(
          bookPack.datebook,
          bookPack.timeStart,
          bookPack.timeEnd,
          bookPack.roombook,
          bookPack.notebook,
          bookPack.assets
        ).map((res, i) => (
          <WrapList key={i} index={i} editbook>
            {res.icon}
            <WrapTextList editbook>{res.topic}</WrapTextList>
            {addData(
              res.topic,
              bookPack,
              roomdata,
              loading,
              errorBook,
              bookdata,
              editbook
            )}
          </WrapList>
        ))
      )}
    </WrapDisplay>
  );
};

const WrapEditLoad = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
`;

const ButtonEdit = styled.div`
  display: flex;
  align-items: center;
  cursor: ${props => (props.wrapedit ? null : "pointer")};
  padding: ${props => props.backChoose && "2px 13px 2px 7px;"};
  border: ${props => props.backChoose && "2px solid #888888"};
  border-radius: ${props => props.backChoose && "99px"};
  color: #888888;
  transition: 0.25s;
  :hover {
    color: black;
    border: ${props => props.backChoose && "2px solid black"};
  }
`;

const EditLoading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const EditButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: blue;
  cursor: pointer;
  :hover {
    color: red;
  }
`;

const EditList = styled(Grid)`
  /* font-weight: ${props => props.top && "bold"}; */
  border-top: ${props => props.top && " rgba(0, 0, 0, 0.1) solid 2px"};
  /* font-size: ${props => props.top && "18px"}; */
  padding: 18px 12px;
  border-bottom: rgba(0, 0, 0, 0.1) solid 2px;
  cursor: default;
  transition: 0.1s;
  background:${props => props.top && "#ffa4a440"};
  :hover {
    background: ${props => !props.top && "rgba(0, 0, 0, 0.035)"};
  }
`;

const EditItem = styled(Grid)``;

const renderListBook = (
  bookPack,
  dispatch,
  loading,
  roomdata,
  username,
  setLoading,
  history,
  bookdata
) => {
  const errorBook = bookChecked(bookPack, bookdata, roomdata);

  const onChangeCreate = () => {
    if (bookPack.roombook) {
      if (bookPack.createPage === "create") {
        setLoading(true);
        if (
          errorBook &&
          Object.keys(errorBook).length > 0 &&
          bookPack.datebook === "Invalid Date"
        ) {
          return setLoading(false);
        } else {
          setTimeout(() => {
            setLoading(false);
            bookPack.setCreatePage("confirm");
          }, 300);
        }
      } else if (bookPack.createPage === "confirm") {
        bookPack.setCreatePage("create");
      }
    }
  };

  return (
    <WrapDisplay>
      <WrapTopic>
        <WrapInCreate>
          {bookPack.createPage === "create" ? (
            <Create style={{ marginRight: 4 }} />
          ) : (
            <Beenhere style={{ marginRight: 4 }} />
          )}

          <span style={{ fontWeight: "bold" }}>
            {bookPack.createPage === "create" ? "สร้างการจอง" : "ตรวจสอบการจอง"}
          </span>
        </WrapInCreate>

        {loading ? (
          <CircularProgress size={43} />
        ) : (
          <CreateText onClick={() => onChangeCreate()}>
            <SCreateButton color="inherit">
              <span style={{ fontSize: 18 }}>
                <WrapAddBook>
                  {bookPack.createPage === "create" ? (
                    <Fragment>
                      <AddCircleOutline style={{ marginRight: 4 }} />
                      ทำการจอง
                    </Fragment>
                  ) : (
                    <Fragment>
                      <CreateOutlined style={{ marginRight: 4 }} />
                      กลับไปแก้ไข
                    </Fragment>
                  )}
                </WrapAddBook>
              </span>
            </SCreateButton>
          </CreateText>
        )}
      </WrapTopic>
      <WrapView>
        {bookPack.createPage === "create"
          ? listData(
              bookPack.datebook,
              bookPack.timeStart,
              bookPack.timeEnd,
              bookPack.roombook,
              bookPack.notebook,
              bookPack.assets
            ).map((res, i) => (
              <WrapList key={i} index={i}>
                {res.icon}
                <WrapTextList>{res.topic}</WrapTextList>
                <SAddData topic={res.topic}>
                  {addData(
                    res.topic,
                    bookPack,
                    roomdata,
                    loading,
                    errorBook,
                    bookdata
                  )}
                  {res.topic === "อุปกรณ์" && (
                    <CommaText>*โปรดใส่จุลภาค(comma) "," ตามตัวอย่าง</CommaText>
                  )}
                </SAddData>
              </WrapList>
            ))
          : renderConfirmPage(
              bookPack,
              username,
              roomdata,
              loading,
              setLoading,
              history,
              dispatch
            )}
      </WrapView>
    </WrapDisplay>
  );
};
const CommaText = styled.div`
  margin-top: 6px;
  margin-bottom: 0;
  color: #0037ff;
`;
const SAddData = styled.div`
  display: flex;
  flex-direction:${props => props.topic === "อุปกรณ์" && "column"}
`;

const addDetail = (res, roomdata) => {
  switch (res.topic) {
    case "วันที่":
      return `จองวันที่ ${dayjs(res.data).format("D MMMM YYYY")}`;

    case "เวลาเริ่ม":
      return `เวลาเริ่ม ${dayjs(res.data).format("HH:mm")}`;
    case "เวลาสิ้นสุด":
      return `เวลาสิ้นสุด ${dayjs(res.data).format("HH:mm")}`;
    case "ห้อง":
      return `ห้อง ${findRoom(res.data, roomdata)}`;

    case "อุปกรณ์":
      return `เพิ่ม ${res.data ? res.data : "-"}`;

    case "หมายเหตุ":
      return `${res.data ? res.data : "หมายเหตุ -"}`;
    default:
      break;
  }
};

const renderConfirmPage = (
  bookPack,
  username,
  roomdata,
  loading,
  setLoading,
  history,
  dispatch
) => {
  const { datebook, timeStart, timeEnd, roombook, notebook, assets } = bookPack;

  const expDateCheck = () => {
    const checked = checkDateExp(datebook, bookPack);
    if (Object.keys(checked)[0] === "exp") {
      return `${checked["exp"]} (${bookPack.expDay} วันหลังจากนี้)`;
    } else {
      return `${checked["curr"]} (ก่อนกำหนดการจอง ${bookPack.sentBefore} วัน)`;
    }
  };

  return (
    <WrapConfirm>
      <WrapConfirmHead>
        <div>จองโดย {username}</div>
        <div>
          ทำรายการเมื่อ {dayjs(new Date()).format("D MMM YYYY HH:mm น.")}
        </div>
      </WrapConfirmHead>
      <DetailConfirm>
        <HeadDetail>
          <BookOutlined style={{ marginRight: 4 }} />
          การจองของคุณ
        </HeadDetail>

        <Container container>
          {listData(
            datebook,
            timeStart,
            timeEnd,
            roombook,
            notebook,
            assets
          ).map((res, i) => (
            <ItemDetail key={i} xs={6} item>
              {res.icon}
              {addDetail(res, roomdata)}
            </ItemDetail>
          ))}
        </Container>
        <WrapSentBefore>
          <i>กรุณาส่งหนังสือร้องขอ (หนังสือบันทึกช้อความ)</i>
          <i>ภายในวันที่ {expDateCheck()}</i>
        </WrapSentBefore>
        <CreateText
          created="true"
          onClick={() =>
            loading
              ? emptyFunc()
              : bookRoom(setLoading, bookPack, history, dispatch)
          }
        >
          <SButton
            created="true"
            color="inherit"
            type={loading ? null : "submit"}
          >
            <span style={{ fontSize: 18 }}>
              {loading ? (
                <WrapLoading>
                  <CircularProgress
                    color="inherit"
                    size={25}
                    style={{ marginRight: 12 }}
                  />
                  <WrapLoading>กำลังจองห้อง...</WrapLoading>
                </WrapLoading>
              ) : (
                "ยืนยันการจอง"
              )}
            </span>
          </SButton>
        </CreateText>
      </DetailConfirm>
    </WrapConfirm>
  );
};

export const RenderMoreAssets = (assets, page) => {
  return assets.split(",").map((res, i) => {
    if (res.trim().length === 0 && i > 0) {
      return null;
    }

    if (res.trim().length === 0 && i === 0) {
      return "-";
    }
    if (res.trim() !== "-") {
      return (
        <AssetsSpan page={page} key={i}>
          {res.trim()}
        </AssetsSpan>
      );
    } else {
      if (res.trim() && i > 0) {
        return null;
      } else {
        return " - ";
      }
    }
  });
};

const AssetsSpan = styled.span`
  padding: 4px 8px;
  background: ${props => (props.page === "admin" ? "#e4e1fd" : "white")};
  margin-right: 8px;
  border-radius: 99px;
`;

const WrapSentBefore = styled.div`
  color: #d20000;
  font-size: 16px;
  display: flex;
  margin-top: 14px;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
`;

const Container = styled(Grid)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  padding: 6px;
`;

const ItemDetail = styled(Grid)`
  display: flex;
  align-items: center;
  padding: 12px;
`;

const HeadDetail = styled.div`
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
  padding-bottom: 12px;
`;

const DetailConfirm = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

const WrapConfirmHead = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: solid 2px rgba(0, 0, 0, 0.125);
  padding-bottom: 12px;
`;

const WrapConfirm = styled.div`
  padding-top: 12px;
  border-top: solid 2px rgba(0, 0, 0, 0.125);
`;

const SInputPS = styled.input`
  font-family: Kanit, sans-serif;
  width: 426px;
  font-size: 16px;
  padding: 12px;
  border-radius: 12px;
  border: none;
  outline: none;
  :focus {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
  ::placeholder {
    font-family: Kanit, sans-serif;
    color: rgba(0, 0, 0, 0.45);
  }
`;

const SSelect = styled.select`
  font-family: Kanit, sans-serif;
  font-size: 16px;
  padding: 12px;
  border-radius: 12px;
  border: none;
  outline: none;
  :focus {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
`;
const Option = styled.option`
  color: ${props => props.choose && "#9e9e9e"};
`;

const BgPick = styled.div`
  background: white;
  transition: 0.1s;
  padding: ${props =>
    props.asset ? "0px" : props.loading ? "12px 12px 0 12px" : "12px 0 0 12px"};
  border-radius: 12px;
  :hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
`;
/* <div>กรุณาส่งหนังสือบันทึกข้อความก่อนวันที่ {expDate}</div>
     <div>มิฉะนั้นการจองฉบับนี้จะถูกลบอัตโนมัติ</div> */

const WrapInCreate = styled.div`
  display: flex;
  align-items: center;
  cursor: ${props => props.backspace && "pointer"};
`;

const WrapAddBook = styled.div`
  display: flex;
  align-items: center;
`;

// <-- renderTabMenu

const WrapList = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.more && "center"};
  border-bottom: solid 2px rgba(0, 0, 0, 0.125);
  border-top: ${props => props.index === 0 && "solid 2px rgba(0, 0, 0, 0.125)"};
  color: ${props => props.more && "#d20000"};
  font-style: ${props => props.more && "italic"};
  padding: 14px 0;
  flex-direction: ${props => props.more && "column"};
  margin: ${props => props.editbook && "12px 12px 0"};
`;
const WrapChoose = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 26px 12px 17px;
  font-size: ${props => (props.head ? "16px" : "14px")};
  border-bottom: ${props => props.head && "1px solid rgba(0,0,0,.3)"};
  cursor: ${props => (props.head ? "default" : "pointer")};
  transition: 0.1s;
  background: ${props =>
    !props.head && props.hold === props.menu
      ? "rgba(0, 0, 0, 0.6)"
      : "transparent"};
  color: ${props =>
    !props.head && props.hold === props.menu ? "white" : "black"};
  :hover {
    background: ${props =>
      !props.head && props.hold !== props.menu && "rgba(0, 0, 0, 0.125)"};
    color: ${props => !props.head && props.hold !== props.menu && "black"};
  }
`;

// <-- renderListBook

const SCreateButton = styled(Button)``;

const CreateText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.created ? "#d84315" : props.remBook ? "red" : "#2962ff"};
  color: white;
  border-radius: 6px;
  overflow: hidden;
  margin-top: ${props => props.created && "36px"};
`;

const WrapTextList = styled.div`
  width: ${props => (props.editbook ? "132px" : "92px")};
`;

const WrapView = styled.div`
  padding: 12px;
`;

const WrapTopic = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`;

const WrapDisplay = styled.div``;

// <-- renderNoVerified
const SButton = styled(Button)`
  width: ${props => props.created && "100%"};
  padding: 8px 12px;
`;

const WrapSentEmail = styled.span`
  margin-top: 22px;
  border-radius: 99px;
  overflow: hidden;

  border: 2px #515bff solid;
`;

const MailIcon = styled(MailOutline)`
  color: #515bff;
`;

const InfoIcon = styled(InfoOutlined)`
  transform: scale(1.6);
`;

// detailDialog
const WrapContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SInput = styled.input`
  padding: 12px 18px;
  border-radius: 12px;
  width: 190px;
  border: 2px solid #448aff;
  text-align: center;
  ::placeholder {
    color: #90caf9;
    font-family: "Kanit", sans-serif;
    font-size: 16px;
  }
  outline: none;
`;

const WrapLoading = styled.div`
  display: flex;
  align-items: center;
`;

const WrapLoadinResent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const scale = keyframes`
  0% {transform: scale(0)}
  100% {transform: scale(2)}
`;
const PassedIcon = styled(CheckCircleOutline)`
  animation: ${scale} 0.75s ease forwards;
  color: #9d99ff;
`;

const EmailSelf = styled.div`
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #2962ff;
`;

export {
  renderTabMenu,
  renderListBook,
  renderNoVerified,
  detailDialog,
  renderEditBook
};
