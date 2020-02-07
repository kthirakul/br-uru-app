import { EDIT_BOOK_TIME } from "../store/reducers";

import axios from "axios";
import dayjs from "dayjs";

const { FETCH_BOOKDATE, FETCH_MYBOOK } = require("../store/reducers");
const { findRoom } = require("./roomFuncs");

export const checkDateExp = (datebook, bookPack) => {
  const currentDate = new Date();
  const expDate = dayjs(
    currentDate.setDate(currentDate.getDate() + bookPack.expDay)
  ).format("YYYY,MM,DD");

  const current = dayjs(datebook).format("YYYY,MM,DD");

  if (dayjs(expDate).isBefore(current)) {
    const exp = dayjs(expDate).format("D MMM YYYY");
    return { exp, expDate };
  } else {
    const curr = dayjs(
      new Date(datebook).setDate(
        new Date(datebook).getDate() - bookPack.sentBefore
      )
    ).format("D MMM YYYY");
    return {
      curr,
      expDate: dayjs(
        new Date(datebook).setDate(
          new Date(datebook).getDate() - bookPack.sentBefore
        )
      ).format("YYYY,MM,DD")
    };
  }
};

export const bookRoom = (setLoading, bookPack, history, dispatch) => {
  const { datebook, timeStart, timeEnd, roombook, notebook, assets } = bookPack;

  const expDateCheck = () => {
    return checkDateExp(datebook, bookPack)["expDate"];
  };

  const date = dayjs(new Date(datebook)).format("YYYY,MM,DD");
  const data = {
    detail: notebook,
    roomid: roombook,
    timeStart: timeStart,
    timeEnd: timeEnd,
    expired: expDateCheck(),
    assets: assets
  };
  setLoading(true);

  axios.post(`/book/${roombook}/${date}`, data).then(() => {
    axios
      .get("books")
      .then(res => {
        dispatch({
          type: FETCH_BOOKDATE,
          payload: res.data
        });
      })
      .then(() => {
        axios
          .get("/mybook")
          .then(res => {
            dispatch({
              type: FETCH_MYBOOK,
              payload: res.data
            });
          })
          .then(() => {
            setLoading(false);
            history.push("/books");
            bookPack.setCreatePage("create");
          })
          .catch(() => {
            if (window.location.pathname !== "/error") {
              localStorage.removeItem("mybook");
              window.location.href = "/error";
            }
          });
      })
      .catch(() => {
        if (window.location.pathname !== "/error") {
          localStorage.removeItem("mybook");
          window.location.href = "/error";
        }
      });
  });
};

export const bookChecked = (bookPack, bookdata, roomdata) => {
  let errorBook = {};

  if (!bookPack.roombook) {
    errorBook = {
      ...errorBook,
      roomError: "กรุณาเลือกห้อง"
    };
  }

  const bookKeys = Object.keys(bookdata);
  const datebook = dayjs(bookPack.datebook).format("YYYY,MM,DD");
  const newBookData = bookdata[datebook];
  const newDatebook = newBookData && Object.values(newBookData);

  let bookTime = [];
  let roomKeys = [];
  newDatebook &&
    newDatebook.forEach(time => {
      bookTime.push({
        roomname: findRoom(time.roomid, roomdata),
        timeStart: dayjs(time.timeStart).format("HH.mm"),
        timeEnd: dayjs(time.timeEnd).format("HH.mm")
      });

      roomKeys.push(findRoom(time.roomid, roomdata));
    });

  if (
    bookKeys[bookKeys.indexOf(datebook)] &&
    roomKeys[roomKeys.indexOf(findRoom(bookPack.roombook, roomdata))]
  ) {
    const startFormat = dayjs(bookPack.timeStart).format("HH.mm");
    const endFormat = dayjs(bookPack.timeEnd).format("HH.mm");

    const newBookroom = bookTime.filter(res => {
      return (
        res.roomname ===
        roomKeys[roomKeys.indexOf(findRoom(bookPack.roombook, roomdata))]
      );
    });

    newBookroom.forEach((res, i) => {
      const baseStart = parseFloat(res.timeStart);
      const pickStart = parseFloat(startFormat);
      const baseEnd = parseFloat(res.timeEnd);
      const pickEnd = parseFloat(endFormat);

      if (baseStart < pickStart && pickStart < baseEnd) {
        errorBook = {
          ...errorBook,
          startError: "เวลาเริ่มต้นถูกจองแล้ว"
        };
      }

      if (pickStart >= pickEnd) {
        errorBook = {
          ...errorBook,
          endError: "เวลาสิ้นสุดผิดพลาด"
        };
      }
      if (baseStart < pickEnd && pickEnd < baseEnd) {
        errorBook = {
          ...errorBook,
          endError: "เวลาสิ้นสุดถูกจองแล้ว"
        };
      }
      if (baseStart >= pickStart && pickEnd >= baseEnd) {
        errorBook = {
          ...errorBook,
          endError: "ไม่สามารถจองเวลานี้ได้"
        };
      }
    });

    return errorBook;
  } else {
    const startFormat = dayjs(bookPack.timeStart).format("HH.mm");
    const endFormat = dayjs(bookPack.timeEnd).format("HH.mm");
    const pickStart = parseFloat(startFormat);
    const pickEnd = parseFloat(endFormat);

    if (pickStart >= pickEnd) {
      errorBook = {
        ...errorBook,
        endError: "เวลาสิ้นสุดผิดพลาด"
      };
    }

    return errorBook;
  }
};

export const setBookTime = (
  dispatch,
  bookdata,
  date,
  book,
  keepOldData,
  bookPack
) => {
  const { setOldData, oldData } = keepOldData;
  const { datebook, timeStart, timeEnd, roombook, assets, notebook } = bookPack;

  let oldStart;
  let oldEnd;

  const newBook = Object.values(bookdata[date]).map(res => {
    if (res.bookid === book.bookid) {
      oldStart = res.timeStart;
      oldEnd = res.timeEnd;
      return {
        ...res,
        timeStart: null,
        timeEnd: null
      };
    } else {
      return { ...res };
    }
  });

  setOldData({
    ...oldData,
    datebook: datebook,
    roombook: roombook,
    timeStartBook: timeStart,
    timeEndBook: timeEnd,
    assetbook: assets,
    notebook: notebook,
    timeStart: oldStart,
    timeEnd: oldEnd,
    bookid: book.bookid,
    date: date
  });

  dispatch({
    type: EDIT_BOOK_TIME,
    payload: { newBook, date, bookdata }
  });
};

export const oldTimeReset = (keepOldData, dispatch, bookdata, bookPack) => {
  const {
    timeStart,
    timeEnd,
    bookid,
    date,
    datebook,
    roombook,
    timeStartBook,
    timeEndBook,
    assetbook,
    notebook
  } = keepOldData.oldData;

  const {
    setDatebook,
    setTimeStart,
    setTimeEnd,
    setRoombook,
    setAssets,
    setNotebook
  } = bookPack;

  if (
    datebook ||
    roombook ||
    timeStartBook ||
    timeEndBook ||
    assetbook ||
    notebook
  ) {
    setDatebook(new Date(datebook));
    setTimeStart(new Date(timeStartBook));
    setTimeEnd(new Date(timeEndBook));
    setRoombook(roombook);
    setAssets(assetbook);
    setNotebook(notebook);
  }

  if (timeStart || timeEnd || bookid || date) {
    if (bookdata[date]) {
      const newBook = Object.values(bookdata[date]).map(res => {
        if (res.bookid === bookid) {
          return {
            ...res,
            timeStart: timeStart,
            timeEnd: timeEnd
          };
        } else {
          return {
            ...res
          };
        }
      });

      dispatch({
        type: EDIT_BOOK_TIME,
        payload: {
          newBook,
          date,
          bookdata
        }
      });
    }
  }

  keepOldData.setOldData({
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
};

export const removeBook = (
  datebook,
  bookid,
  setLoading,
  setEditbook,
  dispatch,
  bookdata,
  setOpen
) => {
  setOpen(false);
  setLoading(true);

  const mouth = dayjs(datebook).format("YYYY,MM");
  const date = dayjs(datebook).format("YYYY,MM,DD");
  let getbookdata = false;
  axios
    .delete(`/book/${mouth}/${date}/${bookid}`)
    .then(() => {
      localStorage.removeItem("mybook");
      if (Object.keys(bookdata[date]).length === 1) {
        axios.delete(`/empty/${mouth}/${date}/`).then(() => {
          axios
            .get("books")
            .then(res => {
              dispatch({
                type: FETCH_BOOKDATE,
                payload: res.data
              });
            })
            .then(() => {
              getbookdata = true;
            });
        });
      }
    })
    .then(() => {
      if (getbookdata === true) {
        axios
          .get("/mybook")
          .then(res => {
            dispatch({
              type: FETCH_MYBOOK,
              payload: res.data
            });
          })
          .then(() => {
            setLoading(false);
            setEditbook("pick");
          })
          .catch(() => {
            if (window.location.pathname !== "/error") {
              localStorage.removeItem("mybook");
              window.location.href = "/error";
            }
          });
      } else {
        axios
          .get("books")
          .then(res => {
            dispatch({
              type: FETCH_BOOKDATE,
              payload: res.data
            });
          })
          .then(() => {
            axios
              .get("/mybook")
              .then(res => {
                dispatch({
                  type: FETCH_MYBOOK,
                  payload: res.data
                });
              })
              .then(() => {
                setLoading(false);
                setEditbook("pick");
              })
              .catch(() => {
                if (window.location.pathname !== "/error") {
                  localStorage.removeItem("mybook");
                  window.location.href = "/error";
                }
              });
          })
          .catch(() => {
            if (window.location.pathname !== "/error") {
              localStorage.removeItem("mybook");
              window.location.href = "/error";
            }
          });
      }
    });
};

export const getBookSetting = bookPack => {
  const currentDate = new Date();

  axios.get("/expday").then(res => {
    const sentBefore = currentDate.setDate(
      currentDate.getDate() + res.data.sentBefore
    );
    bookPack.setsentBefore(res.data.sentBefore);
    bookPack.setExpDay(res.data.expDay);
    bookPack.setDatebook(sentBefore);
  });
};

export const saveEditBook = (
  bookPack,
  keepBookid,
  setLoading,
  setEditbook,
  keepOldData,
  dispatch,
  bookdata,
  roomdata
) => {
  const date = dayjs(new Date(bookPack.datebook)).format("YYYY,MM,DD");
  const mouth = dayjs(new Date(bookPack.datebook)).format("YYYY,MM");
  const errorBook = bookChecked(bookPack, bookdata, roomdata);
  const { timeStart, timeEnd, assetbook, notebook } = keepOldData.oldData;

  const checkStartBP = dayjs(new Date(bookPack.timeStart)).format("HH.mm");
  const checkEndBP = dayjs(new Date(bookPack.timeEnd)).format("HH.mm");
  const checkStart = dayjs(new Date(timeStart)).format("HH.mm");
  const checkEnd = dayjs(new Date(timeEnd)).format("HH.mm");

  const checkNoData =
    checkStartBP === checkStart &&
    checkEndBP === checkEnd &&
    bookPack.assets === assetbook &&
    bookPack.notebook === notebook;

  if (errorBook && Object.keys(errorBook).length > 0) {
  } else {
    setLoading(true);
    if (checkNoData) {
      setTimeout(() => {
        setLoading(false);
        setEditbook("pick");
      }, 500);
    } else {
      const newBook = {
        assets: bookPack.assets,
        detail: bookPack.notebook,
        timeEnd: bookPack.timeEnd,
        timeStart: bookPack.timeStart
      };
      axios
        .put(`/book/${mouth}/${date}/${keepBookid}`, newBook)
        .then(() => {
          axios.get("books").then(res => {
            dispatch({
              type: FETCH_BOOKDATE,
              payload: res.data
            });
          });
        })
        .then(() => {
          setLoading(false);
          setEditbook("pick");
        });
    }
  }
};

export const changeStatus = (
  status,
  newStatus,
  close,
  setLoading,
  dispatch
) => {
  close();
  setLoading(true);
  const oldStatus = sessionStorage.getItem("oldStatus");
  if (status !== oldStatus) {
    axios
      .put("/status", { ...newStatus, bookstatus: status })
      .then(() => {
        sessionStorage.removeItem("oldStatus");
        axios
          .get("books")
          .then(res => {
            dispatch({
              type: FETCH_BOOKDATE,
              payload: res.data
            });
          })
          .then(() => {
            axios.get("/mybook").then(res => {
              dispatch({
                type: FETCH_MYBOOK,
                payload: res.data
              });
            });
          })
          .catch(() => {
            if (window.location.pathname !== "/error") {
              localStorage.removeItem("mybook");
              window.location.href = "/error";
            }
          });
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        if (window.location.pathname !== "/error") {
          localStorage.removeItem("mybook");
          window.location.href = "/error";
        }
      });
  } else {
    setTimeout(() => {
      sessionStorage.removeItem("oldStatus");
      setLoading(false);
    }, 500);
  }
};

export const onChangeReqSet = (e, d, type) => {
  e.preventDefault();
  let value = e.target.value;
  if (type === "sentBefore") {
    d.setReqSet({
      ...d.reqSet,
      sentBefore: value < 1 ? 0 : Number(value)
    });
  }
  if (type === "expDay") {
    d.setReqSet({
      ...d.reqSet,
      expDay: value < 1 ? 0 : Number(value)
    });
  }
};

export const resetReqSet = (d, start) => {
  if (start) {
    d.setReqSet({
      sentBefore: 3,
      expDay: 7
    });
  } else {
    d.setReqSet({
      sentBefore: d.bookPack.sentBefore,
      expDay: d.bookPack.expDay
    });
  }
};

export const onReqSetUpdate = d => {
  d.setLoading(true);
  axios
    .put("/period", d.reqSet)
    .then(() => {
      getBookSetting(d.bookPack);
    })
    .then(() => {
      d.setLoading(false);
    })
    .catch(() => {
      if (window.location.pathname !== "/error") {
        localStorage.removeItem("mybook");
        window.location.href = "/error";
      }
    });
};
