const dayjs = require('dayjs')

export const filterBook = payload => {
  payload.forEach((monthTime, imonth) => {
    Object.entries(monthTime).forEach(date => {
      Object.values(date[1]).forEach(res => {
        const currDate = dayjs(new Date()).format('YYYY,MM,DD')
        const expDate = dayjs(res.expired).format('YYYY,MM,DD')
        if (dayjs(expDate).isBefore(currDate)) {
          delete payload[imonth][date[0]][res.bookid]
        }
      })
      if (
        payload[imonth][date[0]] &&
        Object.keys(payload[imonth][date[0]]).length === 0
      ) {
        delete payload[imonth][date[0]]
      }
    })
  })

  let dateBP = []

  payload.forEach(res => {
    const dateKeys = Object.keys(res)
    dateKeys.sort((a, b) => {
      return new Date(b) - new Date(a)
    })
    dateBP.push(dateKeys)
  })

  let dateData = {}
  dateBP.forEach((res, i) => {
    res.forEach(data => {
      dateData[data] = Object.values(payload[i][data]).sort((a, b) => {
        const atime = parseFloat(dayjs(a.timeStart).format('HH.mm'))
        const btime = parseFloat(dayjs(b.timeStart).format('HH.mm'))
        return atime - btime
      })
    })
  })

  return Object.keys(dateData).length > 0 ? dateData : []
  // return [];
}

export const filterMyBook = (mybook, bookdata, userid) => {
  const dateBP = Object.keys(mybook)
  dateBP.sort((a, b) => {
    return new Date(b) - new Date(a)
  })

  let dateData = {}

  dateBP.forEach((res, i) => {
    if (bookdata[res]) {
      dateData[res] = bookdata[res].filter(res => res.userid === userid)
    }
  })

  return dateData
}

export const filterChange = (bookdata, status) => {
  const bookEntires = Object.entries(bookdata)
  let newBook = {}
  bookEntires.forEach((date, datei) => {
    let inbook = {}
    Object.entries(date[1]).forEach((book, booki) => {
      if (book[1].bookstatus === status) {
        newBook[date[0]] = (() => {
          inbook[book[0]] = book[1]
          return inbook
        })()
      }
    })
  })

  return newBook
}

export const countBook = bookdef => {
  let count = {
    confirm: 0,
    proceed: 0,
    waiting: 0
  }
  const bookValues = Object.values(bookdef.default)
  bookValues.forEach(res => {
    Object.values(res).forEach(res => {
      switch (res.bookstatus) {
        case 'ยืนยันแล้ว':
          count = {
            ...count,
            confirm: count.confirm + 1
          }
          break

        case 'รอการยืนยัน':
          count = {
            ...count,
            proceed: count.proceed + 1
          }
          break

        case 'รอหนังสือร้องขอ':
          count = {
            ...count,
            waiting: count.waiting + 1
          }
          break
        default:
          break
      }
    })
  })
  return {
    confirm: count.confirm,
    proceed: count.proceed,
    waiting: count.waiting,
    all: count.confirm + count.proceed + count.waiting
  }
}

export const changeBook = (topic, bookdef, history, setBooksort, setlist) => {
  switch (topic) {
    case 'ประวัติการจอง':
      setBooksort(bookdef.default)
      setlist('ทั้งหมด')
      break

    case 'ยืนยันแล้ว':
      setBooksort(bookdef.confirm)
      setlist(topic)

      break

    case 'รอการยืนยัน':
      setBooksort(bookdef.proceed)
      setlist(topic)

      break

    case 'รอหนังสือร้องขอ':
      setBooksort(bookdef.waiting)
      setlist(topic)

      break

    case 'จองห้องเพิ่ม':
      history.push('/')
      break

    case 'ระบบผู้ดูแล':
      history.push('/')
      break

    case 'เช็คการจอง':
      history.push('/allbooks')

      break
    default:
      break
  }
}
