const axios = require("axios");
const {
  USER_LOGGED,
  USER_FETCH,
  FETCH_MYBOOK,
  CLEAR_BOOKING
} = require("../store/reducers");
const dayjs = require("dayjs");
exports.onLoginForm = (values, setLoading, dispatch, history, setErrors) => {
  const { email, password } = values;

  setLoading(true);

  axios
    .post("/login", { email, password })
    .then(res => {
      dispatch({ type: USER_LOGGED, payload: true });
      const FBIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FBIdToken", FBIdToken);
      axios.defaults.headers.common["Authorization"] = FBIdToken;
      history.push("/");
    })
    .then(() => {
      axios.get("/mybook").then(res => {
        dispatch({
          type: FETCH_MYBOOK,
          payload: res.data
        });
      });
    })
    .catch(err => {
      setLoading(false);
      setErrors(err.response.data);
    });
};

exports.onRepassword = (values, setLoading, setMessage) => {
  const { email } = values;
  setLoading(true);

  axios
    .post("/recover", {
      email
    })
    .then(res => {
      setMessage(res.data);
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
      setMessage(err.response.data);
    });
};

const isNumeric = n => {
  let data = n.replace(" ", "");
  let str = data.match(/[0-9]/g);
  return str ? true : false;
};

const isNotName = name => {
  if (name.trim().split(" ").length > 1) {
    return false;
  } else {
    return true;
  }
};

exports.singupFuncs = (values, setLoading, setErrors, history, dispatch) => {
  if (isNumeric(values.username) || isNotName(values.username)) {
    return setErrors({ username: "กรุณาใส่ชื่อและนามสกุลให้ถูกต้อง" });
  }

  setLoading(true);
  axios
    .post("/signup", values)
    .then(res => {
      if (res.data.email === "อีเมลนี้ถูกใช้แล้ว") {
        setLoading(false);
        return setErrors(res.data);
      } else {
        const FBIdToken = `Bearer ${res.data.token}`;
        localStorage.setItem("FBIdToken", FBIdToken);

        axios.defaults.headers.common["Authorization"] = FBIdToken;
        dispatch({
          type: USER_LOGGED,
          payload: true
        });
        history.push("/");
      }
    })
    .catch(err => {
      setLoading(false);
      return setErrors(err.response.data);
    });
};

exports.signOut = (
  history,
  setLoading,
  setOpen,
  dispatch,
  bookPack,
  mybookState
) => {
  setOpen(false);
  setLoading(true);
  axios
    .post("/signout")
    .then(res => {
      localStorage.removeItem("FBIdToken");
      localStorage.removeItem("mybook");
      delete axios.defaults.headers.common.Authorization;
      setLoading(false);
      history.push("/");
    })
    .then(() => {
      const pickStart = `${dayjs(new Date()).format("YYYY-MM-DD")}T11:00`;
      const pickEnd = `${dayjs(new Date()).format("YYYY-MM-DD")}T13:00`;
      const currentDate = new Date();
      const sentBefore = currentDate.setDate(
        currentDate.getDate() + bookPack.sentBefore
      );

      bookPack.setDatebook(sentBefore);
      bookPack.setTimeStart(pickStart);
      bookPack.setTimeEnd(pickEnd);
      bookPack.setRoombook("");
      bookPack.setAssets("");
      bookPack.setNotebook("");
      bookPack.setCreatePage("create");
      mybookState.setBooksort({});
      mybookState.setBookdef({
        default: {},
        confirm: {},
        proceed: {}
      });

      dispatch({ type: USER_LOGGED, payload: false });
      dispatch({ type: CLEAR_BOOKING });
    })
    .catch(err => {
      setLoading(false);
    });
};

exports.resentEmail = (
  password,
  setLoading,
  setSuccess,
  setOpen,
  setErrors
) => {
  setLoading(true);
  axios
    .post("/resent", { password })
    .then(() => {
      setSuccess(true);
    })
    .then(() => {
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        setSuccess(false);
      }, 3000);
    })
    .catch(err => {
      setLoading(false);
      setErrors(err.response.data);
    });
};

const isTel = tel => {
  if (tel.trim().length === 10) {
    return true;
  } else return false;
};

const isSame = (newData, oldData) => {
  const checkname = newData.username === oldData.username;
  const checkstatus = newData.userstatus === oldData.userstatus;
  const checkfrom = newData.from === oldData.from;
  const checktell = newData.tell === oldData.tell;

  if (checkname && checkstatus && checkfrom && checktell) {
    return true;
  } else return false;
};

exports.updateProfile = (
  data,
  setMessage,
  setLoading,
  dispatch,
  history,
  userData
) => {
  if (isNotName(data.username) || isNumeric(data.username)) {
    return setMessage({
      username: "กรุณาใส่ชื่อและนามสกุลให้ถูกต้อง"
    });
  }
  if (!isTel(data.tell) || !isNumeric(data.tell)) {
    return setMessage({
      tell: "กรุณาใส่เบอร์โทรให้ถูกต้อง"
    });
  }

  if (isSame(data, userData)) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      return history.push("/profile");
    }, 500);
  }

  setLoading(true);
  setMessage({});
  axios
    .put("/user", data)
    .then(res => {
      axios
        .get("/user")
        .then(res =>
          dispatch({
            type: USER_FETCH,
            payload: res.data
          })
        )
        .then(() => {
          history.push("/profile");
        });
    })
    .catch(err => {
      setLoading(false);
      return setMessage(err.response.data);
    });
};
