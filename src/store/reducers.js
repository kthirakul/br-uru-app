import { filterBook } from "../funcs/AllBookFunc";

export const FETCH_BOOKDATE = "FETCH_BOOKDATE";
export const FETCH_ROOMS = "FETCH_ROOMS";
export const FETCH_MYBOOK = "FETCH_MYBOOK";
export const KEEP_SIGNUPDATA = "KEEP_SIGNUPDATA";
export const USER_FETCH = "USER_FETCH";
export const USER_LOGGED = "USER_LOGGED";
export const FETCH_CONTACT = "FETCH_CONTACT";
export const FIRST_LOAD = "FIRST_LOAD";
export const CLEAR_BOOKING = "CLEAR_BOOKING";
export const EDIT_BOOK_TIME = "EDIT_BOOK_TIME";
export const reducers = (state, action) => {
  switch (action.type) {
    case FETCH_BOOKDATE:
      if (Object.keys(action.payload).length > 0) {
        return {
          ...state,
          bookdata: filterBook(action.payload)
        };
      } else {
        return { ...state, bookdata: [] };
      }

    case FETCH_CONTACT:
      return { ...state, contactdata: action.payload };

    case FETCH_ROOMS:
      if (Object.keys(action.payload).length > 0) {
        return {
          ...state,
          roomdata: action.payload.sort((a, b) => {
            return a.roomname.localeCompare(b.roomname);
          })
        };
      } else {
        return state;
      }

    case KEEP_SIGNUPDATA:
      return { ...state, signUpdata: action.payload };

    case FIRST_LOAD:
      return {
        ...state,
        firstLoad: action.payload
      };

    case USER_FETCH:
      return {
        ...state,
        userData: action.payload
      };
    case USER_LOGGED:
      if (action.payload) {
        return {
          ...state,
          logged: action.payload
        };
      } else {
        return {
          ...state,
          userData: [],
          logged: action.payload
        };
      }

    case FETCH_MYBOOK:
      return {
        ...state,
        mybook: Object.keys(action.payload).length > 0 ? action.payload : []
      };

    case EDIT_BOOK_TIME:
      const { newBook, date, bookdata } = action.payload;
      let newState = {
        ...state,
        bookdata: { ...bookdata, [date]: newBook }
      };
      return newState;
    default:
      return state;
  }
};

export const bookReducer = (state, action) => {
  switch (action.type) {
    case CLEAR_BOOKING:
      return {
        date: "",
        time: "",
        room: "",
        assets: []
      };

    default:
      return state;
  }
};
