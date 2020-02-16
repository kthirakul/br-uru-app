import React, { useContext, useState, useEffect } from 'react'
import Context from '../store/Context'
import styled from 'styled-components'
import { dv } from '../util/sizeDevice'
import { ViewDayOutlined, LocationOffOutlined } from '@material-ui/icons'
import { DialogUI } from '../util/DialogUI'
import WrapContainer from '../util/WrapContainer'
import { renderAllBook } from '../components/AllBooks/AllBookComps'
import dayjs from 'dayjs'
import { oldTimeReset } from '../funcs/bookFuncs'

const AllBookScreen = ({ history }) => {
  const context = useContext(Context)
  const {
    bookdata,
    roomdata,
    editState,
    keepOldData,
    dispatch,
    bookPack
  } = context
  const { editbook, setEditbook } = editState


  useEffect(() => {
    if (
      sessionStorage.hasOwnProperty('pathname') &&
      Object.keys(bookdata).length > 0
    ) {
      const pathname = sessionStorage.getItem('pathname')
      const datepick = pathname.slice(10, 20)
      history.push({
        pathname,
        state: { date: datepick, data: bookdata[datepick] }
      })
      sessionStorage.removeItem('pathname')
    }
  }, [bookdata])

  useEffect(() => {
    if (editbook === 'edit') {
      oldTimeReset(keepOldData, dispatch, bookdata, bookPack)
    }
  }, [editbook])

  const countBooks = () => {
    let counts = 0
    const dateFilter = Object.keys(bookdata).filter(date => {
      return (
        dayjs(date).isAfter(dayjs(new Date()).format('YYYY MM DD')) ||
        dayjs(date).isSame(dayjs(new Date()).format('YYYY MM DD'))
      )
    })

    let newbooks = {}
    dateFilter.forEach(res => {
      newbooks[res] = bookdata[res]
    })

    Object.values(newbooks).forEach((res, i) => {
      counts = counts + Object.keys(res).length || 0
    })
    return counts
  }
  document.title = `รายการจองทั้งหมด (${countBooks()})`
  // filter in book

  const handleClose = () => {
    setDialog({ ...dialog, open: false })
  }
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    detail: '',
    action: []
  })
  const { open, title, action, detail } = dialog

  return (
    <WrapChild>
      <DialogUI
        title={title}
        action={action}
        detail={detail}
        handleClose={handleClose}
        open={open}
      />
      <WrapContainer
        icon={<ViewDayOutlined style={{ marginRight: 6 }} />}
        header={`รายการจองทั้งหมด (${countBooks()})`}
      >
        {Object.keys(bookdata).length > 0 ? (
          renderAllBook(bookdata, roomdata)
        ) : (
          <NoData>
            <LocalOff fontSize="large" />
            ไม่มีรายการจอง
          </NoData>
        )}
      </WrapContainer>
    </WrapChild>
  )
}

const LocalOff = styled(LocationOffOutlined)`
  transform: scale(1.6);
  margin-bottom: 22px;
`

const NoData = styled.div`
  width: 100%;
  margin-top: 44px;
  font-size: 22px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const WrapChild = styled.div`
  position: relative;
  width: 100%;
  height: inherit;
  @media ${dv.tablet} {
    height: 100%;
  }
  overflow: hidden;
`

export default AllBookScreen
