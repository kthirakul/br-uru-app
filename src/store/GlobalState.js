import React, { useReducer, useEffect, useState } from "react";
import { reducers } from "./reducers";
import Context from "./Context";
import { userFetch, fetchAll } from "../funcs/fetchFuncs";
import { filterMyBook, filterChange } from "../funcs/AllBookFunc";
import axios from "axios";
import dayjs from "dayjs";
import { getBookSetting, oldTimeReset } from "../funcs/bookFuncs";

const GlobalState = ({ children }) => {
  const initailState = {
    bookdata: [],
    roomdata: [],
    signUpdata: {},
    confirmData: {},
    userData: {},
    logged: null,
    contactdata: [],
    firstLoad: false,
    mybook: [],
    oldTimeStart: null,
    oldTimeEnd: null
  };

  const [state, dispatch] = useReducer(reducers, initailState);

  // datebook / roombook / timeStartBook / assetbook / notebook เอาไว้เก็บ state หน้า สร้างการจอง
  const [oldData, setOldData] = useState({
    datebook: null,
    roombook: null,
    timeStartBook: null,
    timeEndBook: null,
    assetbook: null,
    notebook: null,
    timeStart: null,
    timeEnd: null,
    bookid: null,
    date: null
  });

  const keepOldData = {
    oldData,
    setOldData
  };

  const [editbook, setEditbook] = useState("pick");
  const editState = {
    editbook,
    setEditbook
  };
  const pickStart = `${dayjs(new Date()).format("YYYY-MM-DD")}T11:00`;
  const pickEnd = `${dayjs(new Date()).format("YYYY-MM-DD")}T13:00`;
  const [sentBefore, setsentBefore] = useState(null);

  const [datebook, setDatebook] = useState(null);
  const [timeStart, setTimeStart] = useState(pickStart);
  const [timeEnd, setTimeEnd] = useState(pickEnd);
  const [roombook, setRoombook] = useState("");
  const [assets, setAssets] = useState("");
  const [notebook, setNotebook] = useState("");
  const [expDay, setExpDay] = useState(null);
  const [createPage, setCreatePage] = useState("create");
  const bookPack = {
    datebook,
    setDatebook,
    timeStart,
    setTimeStart,
    timeEnd,
    setTimeEnd,
    roombook,
    setRoombook,
    assets,
    setAssets,
    notebook,
    setNotebook,
    expDay,
    setExpDay,
    sentBefore,
    setsentBefore,
    createPage,
    setCreatePage
  };

  const [serverPass, setServerPass] = useState(null);
  const server = {
    serverPass,
    setServerPass
  };

  const [booksort, setBooksort] = useState({});
  const [bookdef, setBookdef] = useState({
    default: {},
    confirm: {},
    proceed: {},
    waiting: {}
  });

  const mybookState = {
    booksort,
    setBooksort,
    bookdef,
    setBookdef
  };

  const [storeBook, setstoreBook] = useState({});

  const storeBooking = {
    storeBook,
    setstoreBook
  };

  useEffect(() => {
    userFetch(dispatch);
  }, [state.logged]);

  useEffect(() => {
    const getBooks = async () => await axios.get("/books");
    const getrooms = async () => await axios.get("/rooms");
    const getcontact = async () => await axios.get("/contact");
    const getAll = [getBooks(), getrooms(), getcontact()];
    fetchAll(dispatch, getAll, setServerPass);
  }, []);

  useEffect(() => {
    const check =
      Object.keys(state.mybook).length > 0 &&
      Object.keys(state.bookdata).length > 0;
    if (check) {
      const ownbook = filterMyBook(
        state.mybook,
        state.bookdata,
        state.userData.userid
      );
      setBookdef({
        default: ownbook,
        confirm: filterChange(ownbook, "ยืนยันแล้ว"),
        proceed: filterChange(ownbook, "รอการยืนยัน"),
        waiting: filterChange(ownbook, "รอหนังสือร้องขอ")
      });
    } else {
      setBookdef({
        default: {},
        confirm: {},
        proceed: {},
        waiting: {}
      });
    }
  }, [state.mybook, state.bookdata]);

  useEffect(() => {
    if (Object.keys(state.userData).length > 0 && bookPack.datebook === null) {
      getBookSetting(bookPack);
    }
  }, [state.userData]);

  useEffect(() => {
    setBooksort(bookdef.default);
  }, [bookdef]);

  return (
    <Context.Provider
      value={{
        dispatch: dispatch,
        bookdata: state.bookdata,
        roomdata: state.roomdata,
        signUpdata: state.signUpdata,
        confirmData: state.confirmData,
        userData: state.userData,
        logged: state.logged,
        contactdata: state.contactdata,
        firstLoad: state.firstLoad,
        mybook: state.mybook,
        bookPack,
        mybookState,
        storeBooking,
        keepOldData,
        server,
        editState
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default GlobalState;
