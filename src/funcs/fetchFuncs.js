const {
  USER_FETCH,
  USER_LOGGED,
  FETCH_BOOKDATE,
  FETCH_ROOMS,
  FETCH_CONTACT,
  FIRST_LOAD,
  FETCH_MYBOOK
} = require('../store/reducers')
const jwtDecode = require('jwt-decode')
const axios = require('axios')

export const fetchAll = (dispatch, getAll, setServerPass) => {
  dispatch({
    type: FIRST_LOAD,
    payload: true
  })
  axios
    .all(getAll)
    .then(res => {
      setServerPass(true)
      return res
    })
    .then(res => {
      ;[FETCH_BOOKDATE, FETCH_ROOMS, FETCH_CONTACT].forEach((fetch, index) => {
        dispatch({
          type: fetch,
          payload: res[index].data
        })
      })
    })
    .then(() => {
      dispatch({
        type: FIRST_LOAD,
        payload: false
      })
    })
    .catch(err => {
      if (window.location.pathname !== '/error') {
        localStorage.removeItem('mybook')
        window.location.href = '/error'
      }
    })
}

export const userFetch = dispatch => {
  if (localStorage.hasOwnProperty('FBIdToken')) {
    const decodedToken = jwtDecode(localStorage.FBIdToken)
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('FBIdToken')
      localStorage.removeItem('mybook')
      delete axios.defaults.headers.common.Authorization
      dispatch({
        type: USER_LOGGED,
        payload: false
      })
      window.location.href = '/'
    } else {
      axios.defaults.headers.common['Authorization'] = localStorage.FBIdToken
      axios
        .get('/user')
        .then(res => {
          dispatch({
            type: USER_FETCH,
            payload: res.data
          })
          dispatch({
            type: USER_LOGGED,
            payload: true
          })
        })
        .then(() => {
          axios.get('/mybook').then(res => {
            dispatch({
              type: FETCH_MYBOOK,
              payload: res.data
            })
          })
        })
        .catch(() => {
          if (window.location.pathname !== '/error') {
            localStorage.removeItem('mybook')
            window.location.href = '/error'
          }
        })
    }
  }
}

// export const getExpDate = (setLoading, bookPack) => {
//   axios
//     .get("/expDay")
//     .then(res => {
//       bookPack.setExpDay(res.data);
//     })
//     .then(() => {
//       setLoading(false);
//       bookPack.setCreatePage("confirm");
//     })
//     .catch(() => {
//       if (window.location.pathname !== "/error") {
//         window.location.href = "/error";
//       }
//     });
// };
