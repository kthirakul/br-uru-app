import React, { Fragment } from 'react'
import {
  AccountBox,
  WatchLater,
  AssignmentLateRounded,
  AssignmentTurnedIn,
  Bookmark,
  DateRange,
  BrandingWatermark,
  LocalOffer,
  Backspace
} from '@material-ui/icons'
import { Grid, CircularProgress } from '@material-ui/core'
import { findRoom, showTime } from '../../funcs/roomFuncs'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const diaLogOpen = (
  bookstatus,
  expired,
  bookid,
  addBook,
  detail,
  assets,
  setMore,
  admin,
  setOpen,
  change,
  setNewStatus,
  date
) => {
  if (admin) {
    setOpen(true)
    sessionStorage.setItem('addLog', change)
    sessionStorage.setItem('oldStatus', bookstatus)
    if (change === 'status') {
      setNewStatus({
        mouth: dayjs(new Date(date)).format('YYYY,MM'),
        date,
        bookid
      })
    }
    if (change === 'detail') {
      setMore({ assets, detail, addBook, bookid, expired, bookstatus, date })
    }
    if (change === 'delete') {
      setNewStatus({
        mouth: dayjs(new Date(date)).format('YYYY,MM'),
        date,
        bookid
      })
    }
  }
}

export const renderListBook = (
  bookdata,
  roomdata,
  date,
  admin,
  setOpen,
  setNewStatus,
  newStatus,
  loading,
  setMore,
  status
) => {
  return Object.values(bookdata[date]).map((book, ibook) => {
    const XS = admin ? 2 : 3
    return (
      <WrapOutside key={book.bookid}>
        {ibook !== 0 ? null : <Hr />}
        <Container container admin={admin ? admin.toString() : 'false'}>
          {admin && (
            <Item status={book.bookstatus} item xs={XS}>
              <BrandingWatermark style={{ marginRight: 4 }} />
              {book.bookid}
            </Item>
          )}
          <Item status={book.bookstatus} item xs={XS}>
            <AccountBox style={{ marginRight: 4 }} />
            {book.username}
          </Item>

          <Item status={book.bookstatus} item xs={XS}>
            <Bookmark style={{ marginRight: 4 }} />
            {findRoom(book.roomid, roomdata)}
          </Item>

          <Item status={book.bookstatus} item xs={XS}>
            <WatchLater style={{ marginRight: 4 }} />
            {showTime(book.timeStart, book.timeEnd)}
          </Item>

          {loading && book.bookid === newStatus.bookid ? (
            <Item item xs={XS}>
              <CircularProgress size={30} style={{ marginLeft: 30 }} />
            </Item>
          ) : (
            <Item
              status={book.bookstatus}
              item
              xs={XS}
              admin={admin ? admin.toString() : 'false'}
              onClick={() =>
                loading
                  ? null
                  : status === 'del'
                  ? diaLogOpen(
                      book.bookstatus,
                      book.expired,
                      book.bookid,
                      book.addBook,
                      book.detail,
                      book.assets,
                      setMore,
                      admin,
                      setOpen,
                      'delete',
                      setNewStatus,
                      date
                    )
                  : diaLogOpen(
                      book.bookstatus,
                      book.expired,
                      book.bookid,
                      book.addBook,
                      book.detail,
                      book.assets,
                      setMore,
                      admin,
                      setOpen,
                      'status',
                      setNewStatus,
                      date
                    )
              }
            >
              {status === 'del' ? (
                <Fragment>
                  <Backspace
                    style={{
                      marginRight: 4
                    }}
                  />
                  ลบการจองนี้
                </Fragment>
              ) : (
                <Fragment>
                  {book.bookstatus === 'รอการยืนยัน' ||
                  book.bookstatus === 'รอหนังสือร้องขอ' ? (
                    <AssignmentLateRounded
                      style={{
                        marginRight: 4
                      }}
                    />
                  ) : (
                    <AssignmentTurnedIn
                      style={{
                        marginRight: 4
                      }}
                    />
                  )}
                  {book.bookstatus}
                </Fragment>
              )}
            </Item>
          )}

          {admin && (
            <Item
              status={book.bookstatus}
              item
              xs={XS}
              admin={admin ? admin.toString() : 'false'}
              onClick={() =>
                diaLogOpen(
                  book.bookstatus,
                  book.expired,
                  book.bookid,
                  book.addBook,
                  book.detail,
                  book.assets,
                  setMore,
                  admin,
                  setOpen,
                  'detail'
                )
              }
            >
              <LocalOffer style={{ marginRight: 4 }} />
              ข้อมูลเพิ่มเติม..
            </Item>
          )}
        </Container>

        <Hr />
      </WrapOutside>
    )
  })
}

const Hr = styled.hr`
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
`

const WrapOutside = styled.div`
  cursor: default;
  transition: 0.125s;
  :hover {
    background: rgba(255, 255, 255, 0.4);
  }
`
const Container = styled(Grid)`
  margin-bottom: 4px;
  padding: 18px 0;
  font-size: ${props => (props.admin === 'true' ? '14px' : '16px')};
`

const Item = styled(Grid)`
  cursor: ${props => (props.admin === 'true' ? 'pointer' : 'default')};
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: ${props =>
    props.admin === 'true'
      ? 'blue'
      : props.status === 'รอการยืนยัน' || props.status === 'รอหนังสือร้องขอ'
      ? 'black'
      : props.status === 'ยืนยันแล้ว' && '#274de8'};
  :hover {
    color: ${props => props.admin === 'true' && 'red'};
  }
`

export const renderAllBook = (
  bookdata,
  roomdata,
  admin,
  setOpen,
  setMore,
  newStatus,
  setNewStatus,
  loading,
  setLoading,
  status
) => {
  return Object.keys(bookdata).map((date, idate) => {
    const currentDate = dayjs(new Date()).format('YYYY MM DD')
    const checkDate =
      dayjs(date).isAfter(currentDate) || dayjs(date).isSame(currentDate)

    if (checkDate) {
      return (
        <WrapBook
          bg={idate}
          key={idate}
          admin={admin ? admin.toString() : 'false'}
        >
          <DateText
            admin={admin ? admin.toString() : 'false'}
            to={
              !admin
                ? {
                    pathname: `/allbooks/${date}`,
                    state: {
                      date: date,
                      data: bookdata[date]
                    }
                  }
                : {}
            }
          >
            <DateRange style={{ marginRight: 4 }} />
            {dayjs(date).format('D MMM YYYY')}
          </DateText>
          {renderListBook(
            bookdata,
            roomdata,
            date,
            admin,
            setOpen,
            setNewStatus,
            newStatus,
            loading,
            setMore,
            status
          )}
        </WrapBook>
      )
    }
  })
}
const DateText = styled(Link)`
  font-size: ${props => (props.admin === 'true' ? '16px' : '18px')};
  padding-bottom: 6px;
  font-weight: bold;
  color: #304ffe;
  display: flex;
  align-items: center;
  text-decoration: ${props => props.admin === 'true' && 'none'};
  cursor: ${props => props.admin === 'true' && 'default'};
`

const WrapBook = styled.div`
  padding: ${props => (props.admin === 'true' ? '12px' : '18px')};
  /* border-top: rgba(255, 255, 255, 0.4) 2px solid; */
  border-bottom: rgba(0, 0, 0, 0.075) 8px solid;
  background: ${props =>
    props.bg % 2 === 0 ? 'rgba(73, 148, 218, 0.125)' : 'transparent'};
`
