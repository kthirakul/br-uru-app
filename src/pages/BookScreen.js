import 'date-fns'
import React, { useState, useRef, useContext, useEffect } from 'react'
import {} from 'react-router-dom'
import Context from '../store/Context'
import jwtDecode from 'jwt-decode'
import styled from 'styled-components'
import WrapContainer from '../util/WrapContainer'
import {
  LocalLibraryOutlined,
  PresentToAllOutlined,
  DeleteSweepOutlined,
  AssignmentReturnOutlined,
  AssignmentOutlined,
  DeleteForeverOutlined
} from '@material-ui/icons'
import { DialogUI } from '../util/DialogUI'
import { resentEmail } from '../funcs/userFuncs'
import { SENTEMAIL } from '../util/DialogUI'
import {
  renderListBook,
  renderTabMenu,
  renderNoVerified,
  detailDialog,
  renderEditBook,
  dialogRemove,
  onSetEdit,
  renderAdmin,
  dialogChangeStatus,
  dialogDetailAdmin
} from '../components/BookScreen/renderBookScreen'
import {
  oldTimeReset,
  removeBook,
  onChangeReqSet,
  onChangeContact,
  keepBookMonth
} from '../funcs/bookFuncs'

const BookScreen = ({ history }) => {
  const context = useContext(Context)
  const {
    bookPack,
    roomdata,
    userData,
    dispatch,
    bookdata,
    mybookState,
    firstLoad,
    storeBooking,
    keepOldData,
    editState,
    contactdata
  } = context

  const {
    linkmap,
    department,
    linkview,
    nameDep,
    tell,
    location,
    university
  } = contactdata

  const [keepContact, setkeepContact] = useState({
    linkmap: '',
    department: '',
    linkview: '',
    nameDep: '',
    tell: '',
    location: '',
    university: ''
  })

  useEffect(() => {
    setkeepContact({
      linkmap,
      department,
      linkview,
      nameDep,
      tell,
      location,
      university
    })
  }, [contactdata])

  const { editbook, setEditbook } = editState
  const [editLoad, seteditLoad] = useState(false)
  const [page, setPage] = useState('booking')

  const [hold, setHold] = useState('')
  const [reqSet, setReqSet] = useState({
    sentBefore: 0,
    expDay: 0
  })
  const admin = userData.email === 'br.uru.app@gmail.com' ? true : false

  useEffect(() => {
    setHold('สร้างการจอง')
    sessionStorage.setItem('addLog', 'status')
  }, [])

  useEffect(() => {
    setReqSet({
      sentBefore: bookPack.sentBefore,
      expDay: bookPack.expDay
    })
  }, [bookPack.sentBefore, bookPack.expDay])

  useEffect(() => {
    if (admin) {
      if (sessionStorage.hasOwnProperty('bookThis')) {
        setPage('booking')
        sessionStorage.removeItem('bookThis')
      } else {
        setPage('admin')
        setHold('จัดการการจอง')
      }
    }
  }, [userData])

  useEffect(() => {
    if (history.location.state) {
      if (Object.keys(bookdata).length > 0) {
        setPage('bookedit')
        setHold('แก้ไขการจอง')
        seteditLoad(true)
        setTimeout(() => {
          onSetEdit(
            editState,
            history.location.state.keepMyBook,
            storeBooking,
            bookPack,
            bookdata,
            history.location.state.datebook,
            dispatch,
            setKeepBookid,
            keepOldData
          )
          seteditLoad(false)
        }, 200)
      } else {
        history.replace('', null)
      }
    }
  }, [history.location.state])

  const userSelf = jwtDecode(localStorage.FBIdToken)
  const emailVerified = userSelf.email_verified
  // <-- Ref
  const passRef = useRef(null)
  // <-- State
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [keepBookid, setKeepBookid] = useState('')
  const [adminPage, setadminPage] = useState('จัดการการจอง')
  const [search, setSearch] = useState('')
  const [findDel, setFindDel] = useState('')

  // const [editbook, setEditbook] = useState("pick");

  // const editState = {
  //   editbook,
  //   setEditbook
  // };
  const [more, setMore] = useState({})

  const [newStatus, setNewStatus] = useState({
    mouth: '',
    date: '',
    bookid: ''
  })





  useEffect(() => {
    if ((editbook === 'pick' && bookPack.roombook) || hold === '') {
      oldTimeReset(keepOldData, dispatch, bookdata, bookPack)
    }
  }, [editbook])

  const dialog = () => {
    if (page === 'booking') {
      return {
        title: 'ส่งอีเมลอีกครั้ง',
        detail: detailDialog(loading, success, userSelf, passRef, errors),
        action: loading ? [] : ['ยกเลิก', SENTEMAIL],
        funcs: {
          resentEmail: () =>
            resentEmail(
              passRef.current.value,
              setLoading,
              setSuccess,
              setOpen,
              setErrors
            )
        },
        close: () => setOpen(false),
        icon: <PresentToAllOutlined style={{ marginRight: 6 }} />,
        loading: loading,
        open: open
      }
    }

    if (page === 'bookedit') {
      return {
        title: 'ลบการจองนี้',
        detail: dialogRemove(),
        action: ['ยกเลิก', 'ลบการจอง'],
        funcs: {
          removeBook: () =>
            removeBook(
              bookPack.datebook,
              keepBookid,
              setLoading,
              editState.setEditbook,
              dispatch,
              bookdata,
              setOpen
            )
        },
        close: () => setOpen(false),
        icon: <DeleteSweepOutlined style={{ marginRight: 6 }} />,
        loading: loading,
        open: open
      }
    }

    if (page === 'admin') {
      const addLog = sessionStorage.getItem('addLog')
      if (addLog === 'status') {
        return {
          title: 'สถานะการจอง',
          detail: dialogChangeStatus(),
          action: ['รอหนังสือร้องขอ', 'รอการยืนยัน', 'ยืนยันแล้ว'],
          close: () => setOpen(false),
          icon: <AssignmentReturnOutlined style={{ marginRight: 6 }} />,
          loading: loading,
          open: open
        }
      }
      if (addLog === 'detail') {
        return {
          title: `การจอง ${more.bookid}`,
          detail: dialogDetailAdmin(more),
          action: ['ปิดหน้าต่าง'],
          close: () => setOpen(false),
          icon: <AssignmentOutlined style={{ marginRight: 6 }} />,
          loading: loading,
          open: open
        }
      }
      if (addLog === 'delete') {
        return {
          title: `ลบการจอง ${more.bookid}`,
          detail: dialogRemove(),
          action: ['ปิดหน้าต่าง', 'ลบการจอง'],
          funcs: {
            removeBook: () =>
              removeBook(
                newStatus.date,
                newStatus.bookid,
                setLoading,
                editState.setEditbook,
                dispatch,
                bookdata,
                setOpen,
                setFindDel
              )
          },
          close: () => setOpen(false),
          icon: <DeleteForeverOutlined style={{ marginRight: 6 }} />,
          loading: loading,
          open: open
        }
      }
    }
  }


  return (
    <WrapContainer
      icon={<LocalLibraryOutlined style={{ marginRight: 6 }} />}
      header={'การจองห้อง'}
    >
      <DialogUI
        {...dialog()}
        newStatus={newStatus}
        setLoading={setLoading}
        dispatch={dispatch}
      />
      {emailVerified ? (
        <WrapAll>
          <WrapMenu>
            {renderTabMenu(
              setPage,
              setEditbook,
              admin,
              setadminPage,
              hold,
              setHold
            )}
          </WrapMenu>

          <WrapListBook page={page}>
            <WrapInList page={page} editbook={editbook}>
              {page === 'booking'
                ? renderListBook(
                    bookPack,
                    dispatch,
                    loading,
                    roomdata,
                    userData.username,
                    setLoading,
                    history,
                    bookdata
                  )
                : page === 'bookedit'
                ? renderEditBook(
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
                  )
                : page === 'admin' &&
                  renderAdmin({
                    adminPage,
                    admin,
                    bookdata,
                    roomdata,
                    search,
                    setSearch,
                    setOpen,
                    setMore,
                    newStatus,
                    setNewStatus,
                    loading,
                    setLoading,
                    reqSet,
                    setReqSet,
                    onChangeReqSet,
                    bookPack,
                    keepContact,
                    onChangeContact,
                    setkeepContact,
                    contactdata,
                    dispatch,
                    history,
                    setPage,
                    setHold,
                    findDel,
                    setFindDel
                  })}
            </WrapInList>
          </WrapListBook>
        </WrapAll>
      ) : (
        <WrapNoVerified>{renderNoVerified(setOpen)}</WrapNoVerified>
      )}
    </WrapContainer>
  )
}

const WrapInList = styled.div`
  width: ${props =>
    props.page === 'booking'
      ? '600px'
      : props.page === 'bookedit'
      ? '800px'
      : props.page === 'admin' && '100%'};
  transition: 0.1s;
  background: ${props =>
    props.page === 'admin' ? 'transparent' : 'rgba(255, 255, 255, 0.5)'};
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.1);
  padding: 12px;
  overflow: ${props => (props.page === 'admin' ? 'hidden' : 'auto')};
`

const WrapMenu = styled.div`
  background: rgba(0, 0, 0, 0.075);
`

const WrapListBook = styled.div`
  flex-grow: 1;
  padding-top: ${props => (props.page === 'admin' ? 0 : '24px')};
  display: flex;
  justify-content: center;
`

const WrapAll = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`

const WrapNoVerified = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default BookScreen
