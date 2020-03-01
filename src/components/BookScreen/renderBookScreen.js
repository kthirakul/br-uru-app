import React, { Fragment } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import thLocale from 'date-fns/locale/th'
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
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
  LocationOffOutlined,
  Call,
  Send,
  DeleteSweep,
  ClearAll,
  DeleteForever,
  NoSimOutlined
} from '@material-ui/icons'
import { CircularProgress, Button, Grid } from '@material-ui/core'
import dayjs from 'dayjs'
import { listData, menus } from './BookData'
import { findRoom, showTime } from '../../funcs/roomFuncs'
import {
  bookRoom,
  bookChecked,
  checkDateExp,
  setBookTime,
  saveEditBook,
  resetReqSet,
  onReqSetUpdate,
  onUpdateContact,
  undoContact,
  clearMonth
} from '../../funcs/bookFuncs'
import { emptyFunc } from '../../funcs/emptyFunc'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  WrapAdmin,
  SHeaderAdmin,
  TAdmin,
  WrapSearch,
  SInputAdmin,
  WrapAuto,
  BookSettingHead,
  WrapBookSetting,
  WrapChooseSetting,
  InputSet,
  ItemSet,
  SaveReqSet,
  WrapSaveReqSet,
  ErrorReqSet,
  TextReqSet,
  SettingLoading,
  WLoadAllUser,
  WAllUser,
  WEAllUser
} from '../../styled/BookStyled'
import { renderAllBook } from '../AllBooks/AllBookComps'
dayjs.extend(relativeTime)

const renderNoVerified = setOpen => {
  return (
    <Fragment>
      <InfoIcon fontSize="large" />
      <span style={{ fontSize: 26, marginTop: 18 }}>
        กรุณายืนยันอีเมลเพื่อใช้งานระบบ
      </span>
      <span
        style={{
          textAlign: 'center',
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
              color: '#515bff'
            }}
          >
            ส่งอีเมลอีกครั้ง
          </span>
        </SButton>
      </WrapSentEmail>
    </Fragment>
  )
}

export const dialogRemove = () => {
  return <WrapContent>คุณต้องการลบการจองนี้หรือไม่?</WrapContent>
}

export const dialogRemoveMonth = month => {
  return (
    <WrapContent>
      คุณต้องการล้างการจองทั้งหมดในเดือน {month} หรือไม่?
    </WrapContent>
  )
}

export const dialogChangeStatus = () => {
  return <WrapContent>โปรดตรวจสอบก่อนทำการเปลี่ยนสถานะ</WrapContent>
}

export const dialogDetailAdmin = d => {
  const styles = {
    detail: {
      textDecoration: 'underline',
      color: 'blue'
    },
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 12
    },
    exp: {
      color: '#d20000',
      fontStyle: 'italic',
      marginTop: 12
    }
  }

  return (
    <WrapContent>
      <div style={styles.top}>
        <span>
          ทำรายการเมื่อ {dayjs(d.addBook).format('D MMM YYYY เวลา HH:mm น.')} (
          {dayjs(d.addBook).fromNow()})
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={styles.detail}>อุปกรณ์</span> :{' '}
        {d.assets ? RenderMoreAssets(d.assets, 'admin') : ' - '}
      </div>
      <div>
        <span style={styles.detail}>หมายเหตุ</span> :{' '}
        {d.detail ? d.detail : ' - '}
      </div>
      <div style={styles.exp}>
        {d.bookstatus === 'รอหนังสือร้องขอ' ? (
          <Fragment>
            {' '}
            การจองนี้จะหมดอายุใน{' '}
            {dayjs(new Date(d.expired)).format('D MMM YYYY')}
          </Fragment>
        ) : (
          'ไม่มีเวลาหมดอายุจนกว่าจะถึงวันที่ใช้ห้อง'
        )}
      </div>
    </WrapContent>
  )
}
const detailDialog = (loading, success, userSelf, passRef, errors) => {
  return loading ? (
    <WrapLoadinResent>
      <div style={{ marginBottom: 16 }}>
        {success ? <PassedIcon /> : <CircularProgress />}
      </div>
      <span style={{ color: success ? '#645ef2' : 'black' }}>
        {success ? 'ส่งอีเมลเรียบร้อยแล้ว!' : 'กำลังส่งอีเมล..'}
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
      <span style={{ color: 'red' }}>
        {errors.password && errors.password}
        {errors.general && errors.general}
      </span>
    </WrapContent>
  )
}

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
            placeholder="ค้นหาการจองตามรหัส"
            value={d.search}
            onChange={updateSearch}
            type="text"
          />
        </WrapSearch>
      )}
    </SHeaderAdmin>
  )
}

export const renderAdmin = d => {
  const {
    linkmap,
    department,
    linkview,
    nameDep,
    tell,
    location,
    university
  } = d.keepContact

  let filterBook = {}
  let newBook = {}
  let bookArr = []

  let filterBookDel = {}
  let newBookDel = {}
  let bookArrDel = []

  Object.entries(d.bookdata).forEach((books, i) => {
    books[1].forEach(res => {
      if (
        d.search &&
        res.bookid.toLowerCase().indexOf(d.search.toLowerCase()) !== -1
      ) {
        bookArr.push(res)
        newBook = {
          [books[0]]: bookArr
        }
        Object.assign(filterBook, newBook)
      }

      if (
        d.findDel &&
        res.bookid.toLowerCase().indexOf(d.findDel.toLowerCase()) !== -1
      ) {
        bookArrDel.push(res)
        newBookDel = {
          [books[0]]: bookArrDel
        }
        Object.assign(filterBookDel, newBookDel)
      }
    })
    if (Object.keys(filterBook).indexOf(books[0]) !== -1) {
      bookArr = []
    }
    if (Object.keys(filterBookDel).indexOf(books[0]) !== -1) {
      bookArrDel = []
    }
  })

  const item = menus(d.admin, true).find(res => {
    return res.menu === d.adminPage
  })

  const updateSearch = (e, status) => {
    if (status === 'del') {
      d.setFindDel(e.target.value)
    } else {
      d.setSearch(e.target.value)
    }
  }

  switch (d.adminPage) {
    case 'จัดการการจอง':
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
      )

    case 'ตั้งค่าแอป':
      const checkedSet =
        (d.bookPack.sentBefore !== d.reqSet.sentBefore ||
          d.bookPack.expDay !== d.reqSet.expDay) &&
        d.reqSet.sentBefore > 0 &&
        d.reqSet.expDay > 0 &&
        d.reqSet.expDay > d.reqSet.sentBefore

      const checkedContact =
        d.keepContact &&
        ((d.keepContact.linkmap.trim() === d.contactdata.linkmap.trim() &&
          d.keepContact.department.trim() === d.contactdata.department.trim() &&
          d.keepContact.linkview.trim() === d.contactdata.linkview.trim() &&
          d.keepContact.tell.trim() === d.contactdata.tell.trim() &&
          d.keepContact.location.trim() === d.contactdata.location.trim() &&
          d.keepContact.university.trim() === d.contactdata.university.trim() &&
          d.keepContact.nameDep.trim() === d.contactdata.nameDep.trim()) ||
          d.keepContact.linkmap.trim() === '' ||
          d.keepContact.department.trim() === '' ||
          d.keepContact.linkview.trim() === '' ||
          d.keepContact.tell.trim() === '' ||
          d.keepContact.location.trim() === '' ||
          d.keepContact.university.trim() === '' ||
          d.keepContact.nameDep.trim() === '')

      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
          {d.loading ? (
            <SettingLoading>
              <CircularProgress style={{ marginTop: 24 }} />
              <span style={{ marginTop: 18 }}>กำลังบันทึก..</span>
            </SettingLoading>
          ) : (
            <WrapAuto>
              <WrapBookSetting>
                <BookSettingHead>
                  <Send style={{ marginRight: 4 }} />
                  กำหนดการส่งหนังสือร้องขอ
                </BookSettingHead>

                {d.bookPack.sentBefore && d.bookPack.expDay ? (
                  <WrapChooseSetting>
                    <ItemSet>
                      <TextReqSet up>อย่างเร็วสุดภายใน</TextReqSet>
                      <InputSet
                        onChange={e => d.onChangeReqSet(e, d, 'sentBefore')}
                        type="number"
                        value={d.reqSet.sentBefore ? d.reqSet.sentBefore : ''}
                      />
                      วัน
                      {d.reqSet.sentBefore < 1 && (
                        <ErrorReqSet>*ระยะเวลาผิดพลาด</ErrorReqSet>
                      )}
                    </ItemSet>
                    <ItemSet>
                      <TextReqSet up>อย่างช้าสุดภายใน</TextReqSet>
                      <InputSet
                        onChange={e => d.onChangeReqSet(e, d, 'expDay')}
                        type="number"
                        value={d.reqSet.expDay ? d.reqSet.expDay : ''}
                      />
                      วัน
                      {d.reqSet.expDay < 1 ? (
                        <ErrorReqSet>*ระยะเวลาผิดพลาด</ErrorReqSet>
                      ) : (
                        d.reqSet.expDay <= d.reqSet.sentBefore && (
                          <ErrorReqSet>*ต้องมากกว่าเวลาเร็วสุด</ErrorReqSet>
                        )
                      )}
                    </ItemSet>

                    <WrapSaveReqSet>
                      <SaveReqSet
                        save={'true'}
                        checked={checkedSet ? 1 : 0}
                        onClick={
                          checkedSet === true
                            ? () => onReqSetUpdate(d)
                            : undefined
                        }
                      >
                        บันทึก
                      </SaveReqSet>

                      <SaveReqSet onClick={() => resetReqSet(d)}>
                        คืนค่า
                      </SaveReqSet>
                      <SaveReqSet
                        start={'true'}
                        onClick={() => resetReqSet(d, 'start')}
                      >
                        ค่าเริ่มต้น
                      </SaveReqSet>
                    </WrapSaveReqSet>
                  </WrapChooseSetting>
                ) : (
                  <CircularProgress style={{ marginTop: 24, marginLeft: 24 }} />
                )}
              </WrapBookSetting>

              <WrapBookSetting>
                <BookSettingHead>
                  <Call style={{ marginRight: 4 }} />
                  แก้ไขการติดต่อ
                </BookSettingHead>

                {d.bookPack.sentBefore && d.bookPack.expDay ? (
                  <WrapChooseSetting>
                    <ItemSet>
                      <TextReqSet>ที่ตั้ง</TextReqSet>
                      <InputSet
                        contact={'true'}
                        onChange={e => d.onChangeContact(e, d, 'university')}
                        type="text"
                        value={university}
                      />
                      {d.keepContact.university.trim() === '' && (
                        <ErrorReqSet>*กรุณาใส่ข้อมูลที่ตั้ง</ErrorReqSet>
                      )}
                    </ItemSet>

                    <ItemSet>
                      <TextReqSet>แผนที่ที่ตั้ง</TextReqSet>
                      <InputSet
                        contact={'true'}
                        onChange={e => d.onChangeContact(e, d, 'linkmap')}
                        type="text"
                        value={linkmap}
                      />
                      {d.keepContact.linkmap.trim() === '' && (
                        <ErrorReqSet>*กรุณาใส่ข้อมูลแผนที่ที่ตั้ง</ErrorReqSet>
                      )}
                    </ItemSet>

                    <ItemSet>
                      <TextReqSet>สถานที่</TextReqSet>
                      <InputSet
                        contact={'true'}
                        onChange={e => d.onChangeContact(e, d, 'department')}
                        type="text"
                        value={department}
                      />
                      {d.keepContact.department.trim() === '' && (
                        <ErrorReqSet>*กรุณาใส่ข้อมูลสถานที่</ErrorReqSet>
                      )}
                    </ItemSet>

                    <ItemSet>
                      <TextReqSet>แผนที่สถานที่</TextReqSet>
                      <InputSet
                        contact={'true'}
                        onChange={e => d.onChangeContact(e, d, 'linkview')}
                        type="text"
                        value={linkview}
                      />
                      {d.keepContact.linkview.trim() === '' && (
                        <ErrorReqSet>*กรุณาใส่ข้อมูลแผนที่สถานที่</ErrorReqSet>
                      )}
                    </ItemSet>

                    <ItemSet>
                      <TextReqSet>ห้อง</TextReqSet>
                      <InputSet
                        contact={'true'}
                        onChange={e => d.onChangeContact(e, d, 'nameDep')}
                        type="text"
                        value={nameDep}
                      />
                      {d.keepContact.nameDep.trim() === '' && (
                        <ErrorReqSet>*กรุณาใส่ข้อมูลห้อง</ErrorReqSet>
                      )}
                    </ItemSet>

                    <ItemSet>
                      <TextReqSet>ที่อยู่</TextReqSet>

                      <InputSet
                        contact={'true'}
                        onChange={e => d.onChangeContact(e, d, 'location')}
                        type="text"
                        value={location}
                      />
                      {d.keepContact.location.trim() === '' && (
                        <ErrorReqSet>*กรุณาใส่ข้อมูลที่อยู่</ErrorReqSet>
                      )}
                    </ItemSet>

                    <ItemSet>
                      <TextReqSet>โทร</TextReqSet>
                      <InputSet
                        contact={'true'}
                        onChange={e => d.onChangeContact(e, d, 'tell')}
                        type="text"
                        value={tell}
                      />
                      {d.keepContact.tell.trim() === '' && (
                        <ErrorReqSet>*กรุณาใส่ข้อมูลโทร</ErrorReqSet>
                      )}
                    </ItemSet>

                    <WrapSaveReqSet>
                      <SaveReqSet
                        save={'true'}
                        checked={checkedContact ? 0 : 1}
                        onClick={
                          !checkedContact ? () => onUpdateContact(d) : undefined
                        }
                      >
                        บันทึก
                      </SaveReqSet>
                      <SaveReqSet onClick={() => undoContact(d)}>
                        คืนค่า
                      </SaveReqSet>
                      <SaveReqSet
                        start={'true'}
                        onClick={() => undoContact(d, 'start')}
                      >
                        ค่าเริ่มต้น
                      </SaveReqSet>
                    </WrapSaveReqSet>
                  </WrapChooseSetting>
                ) : (
                  <CircularProgress style={{ marginTop: 24, marginLeft: 24 }} />
                )}
              </WrapBookSetting>
            </WrapAuto>
          )}
        </WrapAdmin>
      )

    case 'ล้างข้อมูล':
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
          <WrapAuto>
            <WrapBookSetting>
              <BookSettingHead style={{ marginBottom: 12 }}>
                <DeleteSweep style={{ marginRight: 4 }} />
                <span style={{ marginRight: 12 }}>ลบการจองตามรหัสจอง</span>

                <InputSet
                  style={{ width: 90, textAlign: 'center' }}
                  contact
                  placeholder="ค้นหา"
                  type="text"
                  value={d.findDel}
                  onChange={e => updateSearch(e, 'del')}
                />
              </BookSettingHead>
              {Object.keys(filterBookDel && d.findDel ? filterBookDel : [])
                .length > 0 ? (
                renderAllBook(
                  filterBookDel && d.findDel ? filterBookDel : [],
                  d.roomdata,
                  d.admin,
                  d.setOpen,
                  d.setMore,
                  d.newStatus,
                  d.setNewStatus,
                  d.loading,
                  d.setLoading,
                  'del'
                )
              ) : (
                <NoData del>
                  <BookOutlined style={{ marginBottom: 12 }} fontSize="large" />
                  ใส่รหัสให้ถูกต้องเพื่อค้นหาการจอง
                </NoData>
              )}
            </WrapBookSetting>
            <WrapBookSetting>
              <BookSettingHead>
                <ClearAll style={{ marginRight: 4 }} />
                ล้างการจองรายเดือน (ที่หมดอายุแล้ว)
              </BookSettingHead>
              {d.loading ? (
                <EditLoading up>
                  <CircularProgress size={35} style={{ marginRight: 12 }} />
                  กำลังล้างการจอง...
                </EditLoading>
              ) : d.monthExp.length > 0 ? (
                d.monthExp.map((res, i) => (
                  <ItemSet up key={i} onClick={() => clearMonth(d, res)}>
                    <DeleteForever style={{ marginRight: 4 }} />
                    <TextReqSet all>
                      {dayjs(res).format('MMMM YYYY')}
                    </TextReqSet>
                  </ItemSet>
                ))
              ) : (
                <NoData del>
                  <NoSimOutlined />
                  ไม่มีรายการจองที่หมดอายุ
                </NoData>
              )}
            </WrapBookSetting>
          </WrapAuto>
        </WrapAdmin>
      )

    case 'จัดการห้อง':
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
          <WrapAuto></WrapAuto>
        </WrapAdmin>
      )

    case 'จัดการผู้ใช้':
      return (
        <WrapAdmin>
          <HeaderAdmin item={item} d={d} />
          <WAllUser topic container>
            <WEAllUser xs={3} item>
              สมัครเมื่อ
            </WEAllUser>
            <WEAllUser xs={3} item>
              ชื่อ-นามสกุล
            </WEAllUser>
            <WEAllUser xs={3} item>
              สถานะ
            </WEAllUser>
            <WEAllUser xs={3} item>
              หน่วยงาน
            </WEAllUser>
          </WAllUser>
          {d.allUserState.alluser.length === 0 ? (
            <WLoadAllUser>
              <CircularProgress />
            </WLoadAllUser>
          ) : (
            <WrapAuto>
              {d.allUserState.alluser.map(res => {
                const createAt = dayjs(new Date(res.createdAt)).format(
                  'DD/MM/YYYY'
                )
                return (
                  <WAllUser container>
                    <WEAllUser xs={3} item>
                      {createAt}
                    </WEAllUser>
                    <WEAllUser xs={3} item>
                      {res.username}
                    </WEAllUser>
                    <WEAllUser xs={3} item>
                      {res.userstatus}
                    </WEAllUser>
                    <WEAllUser xs={3} item>
                      {res.from}
                    </WEAllUser>
                  </WAllUser>
                )
              })}
            </WrapAuto>
          )}
        </WrapAdmin>
      )

    default:
      return
  }
}

const LocalOff = styled(LocationOffOutlined)`
  transform: scale(1.6);
  margin-bottom: 22px;
`

const NoData = styled.div`
  width: 100%;
  margin-top: ${props => (props.del ? '12px' : '44px')};
  font-size: ${props => (props.del ? '18px' : '22px')};
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
`
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
      setadminPage(amenu)
    }
    setEditbook('pick')
    setPage(page)
    setHold(amenu)
  }

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
  )
}

const addData = (
  topic,
  bookPack,
  roomdata,
  loading,
  errorBook,
  bookdata,
  editbook
) => {
  const currentDate = new Date()
  const sentBefore = currentDate.setDate(
    currentDate.getDate() + bookPack.sentBefore
  )

  const datepick = dayjs(bookPack.datebook).format('YYYY,MM,DD')
  switch (topic) {
    case 'วันที่':
      return editbook ? (
        <Fragment>
          <BgPick>
            <div style={{ marginBottom: 12, marginRight: 12 }}>
              {dayjs(bookPack.datebook).format('D MMM YYYY')}
            </div>
          </BgPick>
          <div style={{ marginLeft: 6, color: '#b30000' }}>
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
      )

    case 'เวลาเริ่ม':
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
      )
    case 'เวลาสิ้นสุด':
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
      )
    case 'ห้อง':
      return editbook ? (
        <Fragment>
          <BgPick>
            <div style={{ marginBottom: 12, marginRight: 12 }}>
              {findRoom(bookPack.roombook, roomdata)}
            </div>
          </BgPick>
          <div style={{ marginLeft: 6, color: '#b30000' }}>
            <i>*ไม่สามารถแก้ไขห้องได้</i>
          </div>
        </Fragment>
      ) : roomdata.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
      )

    case 'อุปกรณ์':
      return (
        <SInputPS
          value={bookPack.assets}
          onChange={e => bookPack.setAssets(e.target.value)}
          placeholder="เพิ่มอุปกรณ์ เช่น โต๊ะ 4 ตัว, เก้าอี้ 8 ตัว, ไมค์ลอย 2 ตัว"
        />
      )

    case 'หมายเหตุ':
      return (
        <SInputPS
          value={bookPack.notebook}
          onChange={e => bookPack.setNotebook(e.target.value)}
          placeholder="เพิ่มหมายเหตุ"
        />
      )
    default:
      break
  }
}

const WrapTextError = styled.div`
  display: flex;
  flex-direction: column;
`

const WrapErrorBook = styled.div`
  display: flex;
  align-items: center;
  color: #b30000;
  margin-left: 6px;
  font-weight: bold;
`

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
  const { datebook, timeStart, timeEnd, roombook, assets, notebook } = bookPack

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
  )

  setKeepBookid(book.bookid)
  editState.setEditbook('edit')
  storeBooking.setstoreBook(data)
  bookPack.setDatebook(new Date(date))
  bookPack.setTimeStart(book.timeStart)
  bookPack.setTimeEnd(book.timeEnd)
  bookPack.setRoombook(book.roomid)
  bookPack.setAssets(book.assets)
  bookPack.setNotebook(book.detail)

  setBookTime(dispatch, bookdata, date, book, keepOldData, bookPack)
}

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
      <EditList top={'true'} container>
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
                {dayjs(date[0]).format('D/MM/YYYY')}
              </EditItem>
              <EditItem item xs={2}>
                {showTime(book.timeStart, book.timeEnd)}
              </EditItem>
              <EditItem item xs={2}>
                {findRoom(book.roomid, roomdata)}
              </EditItem>
              <EditItem item xs={2}>
                {dayjs(book.expired).format('D/MM/YYYY')}
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
          ))
        })
      ) : (
        <WrapNoList>ยังไม่มีรายการจอง</WrapNoList>
      )}
    </WrapView>
  )
}

const WrapNoList = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`

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
  const { bookdef } = mybookState
  const bookdefEntries = Object.entries(bookdef.waiting)
  const errorBook = bookChecked(bookPack, bookdata, roomdata)
  const editbook = true

  return (
    <WrapDisplay>
      <WrapTopic>
        {editState.editbook === 'edit' && (
          <ButtonEdit
            backChoose
            onClick={() => editState.setEditbook('pick')}
            style={{ marginRight: 6 }}
          >
            <ArrowBack style={{ marginRight: 2 }} />
            <span style={{ fontSize: 14 }}>กลับ</span>
          </ButtonEdit>
        )}
        <WrapInCreate>
          <Bookmarks style={{ marginRight: 4 }} />

          <span style={{ fontWeight: 'bold' }}>
            แก้ไขการจอง{' '}
            <span style={{ color: 'red' }}>
              {editState.editbook === 'pick'
                ? ' (เฉพาะรอหนังสือร้องขอ)'
                : `รหัสที่ ${keepBookid}`}
            </span>
          </span>
        </WrapInCreate>
        {editState.editbook === 'edit' &&
          (loading ? (
            <CircularProgress />
          ) : (
            <ButtonEdit
              wrapedit
              style={{ display: 'flex', alignItems: 'center' }}
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
      ) : editState.editbook === 'pick' ? (
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
  )
}

const WrapEditLoad = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
`

const ButtonEdit = styled.div`
  display: flex;
  align-items: center;
  cursor: ${props => (props.wrapedit ? null : 'pointer')};
  padding: ${props => props.backChoose && '2px 13px 2px 7px;'};
  border: ${props => props.backChoose && '2px solid #888888'};
  border-radius: ${props => props.backChoose && '99px'};
  color: #888888;
  transition: 0.25s;
  :hover {
    color: black;
    border: ${props => props.backChoose && '2px solid black'};
  }
`

const EditLoading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${props => (props.up ? '12px' : '40px')};
  align-items: ${props => props.up && 'center'};
`

const EditButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: blue;
  cursor: pointer;
  :hover {
    color: red;
  }
`

const EditList = styled(Grid)`
  /* font-weight: ${props => props.top && 'bold'}; */
  border-top: ${props => props.top && ' rgba(0, 0, 0, 0.1) solid 2px'};
  /* font-size: ${props => props.top && '18px'}; */
  padding: 18px 12px;
  border-bottom: rgba(0, 0, 0, 0.1) solid 2px;
  cursor: default;
  transition: 0.1s;
  background:${props => props.top && '#ffa4a440'};
  :hover {
    background: ${props => !props.top && 'rgba(0, 0, 0, 0.035)'};
  }
`

const EditItem = styled(Grid)``

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
  const errorBook = bookChecked(bookPack, bookdata, roomdata)

  const onChangeCreate = () => {
    if (
      bookPack.roombook &&
      bookPack.datebook !== 'Invalid Date' &&
      bookPack.datebook !== null
    ) {
      if (bookPack.createPage === 'create') {
        setLoading(true)
        if (
          (errorBook && Object.keys(errorBook).length > 0) ||
          bookPack.datebook === 'Invalid Date'
        ) {
          return setLoading(false)
        } else {
          setTimeout(() => {
            setLoading(false)
            bookPack.setCreatePage('confirm')
          }, 300)
        }
      } else if (bookPack.createPage === 'confirm') {
        bookPack.setCreatePage('create')
      }
    }
  }

  return (
    <WrapDisplay>
      <WrapTopic>
        <WrapInCreate>
          {bookPack.createPage === 'create' ? (
            <Create style={{ marginRight: 4 }} />
          ) : (
            <Beenhere style={{ marginRight: 4 }} />
          )}

          <span style={{ fontWeight: 'bold' }}>
            {bookPack.createPage === 'create' ? 'สร้างการจอง' : 'ตรวจสอบการจอง'}
          </span>
        </WrapInCreate>

        {loading ? (
          <CircularProgress size={43} />
        ) : (
          <CreateText onClick={() => onChangeCreate()}>
            <SCreateButton color="inherit">
              <span style={{ fontSize: 18 }}>
                <WrapAddBook>
                  {bookPack.createPage === 'create' ? (
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
        {bookPack.createPage === 'create'
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
                  {res.topic === 'อุปกรณ์' && (
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
  )
}
const CommaText = styled.div`
  margin-top: 6px;
  margin-bottom: 0;
  color: #0037ff;
`
const SAddData = styled.div`
  display: flex;
  flex-direction: ${props => props.topic === 'อุปกรณ์' && 'column'};
`

const addDetail = (res, roomdata) => {
  switch (res.topic) {
    case 'วันที่':
      return `จองวันที่ ${dayjs(res.data).format('D MMMM YYYY')}`

    case 'เวลาเริ่ม':
      return `เวลาเริ่ม ${dayjs(res.data).format('HH:mm')}`
    case 'เวลาสิ้นสุด':
      return `เวลาสิ้นสุด ${dayjs(res.data).format('HH:mm')}`
    case 'ห้อง':
      return `ห้อง ${findRoom(res.data, roomdata)}`

    case 'อุปกรณ์':
      return `เพิ่ม ${res.data ? res.data : '-'}`

    case 'หมายเหตุ':
      return `${res.data ? res.data : 'หมายเหตุ -'}`
    default:
      break
  }
}

const renderConfirmPage = (
  bookPack,
  username,
  roomdata,
  loading,
  setLoading,
  history,
  dispatch
) => {
  const { datebook, timeStart, timeEnd, roombook, notebook, assets } = bookPack

  const expDateCheck = () => {
    const checked = checkDateExp(datebook, bookPack)
    if (Object.keys(checked)[0] === 'exp') {
      return `${checked['exp']} (${bookPack.expDay} วันหลังจากนี้)`
    } else {
      return `${checked['curr']} (ก่อนกำหนดการจอง ${bookPack.sentBefore} วัน)`
    }
  }

  return (
    <WrapConfirm>
      <WrapConfirmHead>
        <div>จองโดย {username}</div>
        <div>
          ทำรายการเมื่อ {dayjs(new Date()).format('D MMM YYYY HH:mm น.')}
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
            type={loading ? null : 'submit'}
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
                'ยืนยันการจอง'
              )}
            </span>
          </SButton>
        </CreateText>
      </DetailConfirm>
    </WrapConfirm>
  )
}

export const RenderMoreAssets = (assets, page) => {
  return assets.split(',').map((res, i) => {
    if (res.trim().length === 0 && i > 0) {
      return null
    }

    if (res.trim().length === 0 && i === 0) {
      return '-'
    }
    if (res.trim() !== '-') {
      return (
        <AssetsSpan page={page} key={i}>
          {res.trim()}
        </AssetsSpan>
      )
    } else {
      if (res.trim() && i > 0) {
        return null
      } else {
        return ' - '
      }
    }
  })
}

const AssetsSpan = styled.span`
  padding: 4px 8px;
  background: ${props => (props.page === 'admin' ? '#e4e1fd' : 'white')};
  margin-right: 8px;
  border-radius: 99px;
`

const WrapSentBefore = styled.div`
  color: #d20000;
  font-size: 16px;
  display: flex;
  margin-top: 14px;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
`

const Container = styled(Grid)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  padding: 6px;
`

const ItemDetail = styled(Grid)`
  display: flex;
  align-items: center;
  padding: 12px;
`

const HeadDetail = styled.div`
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
  padding-bottom: 12px;
`

const DetailConfirm = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
`

const WrapConfirmHead = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: solid 2px rgba(0, 0, 0, 0.125);
  padding-bottom: 12px;
`

const WrapConfirm = styled.div`
  padding-top: 12px;
  border-top: solid 2px rgba(0, 0, 0, 0.125);
`

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
`

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
`
const Option = styled.option`
  color: ${props => props.choose && '#9e9e9e'};
`

const BgPick = styled.div`
  background: white;
  transition: 0.1s;
  padding: ${props =>
    props.asset ? '0px' : props.loading ? '12px 12px 0 12px' : '12px 0 0 12px'};
  border-radius: 12px;
  :hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
`
/* <div>กรุณาส่งหนังสือบันทึกข้อความก่อนวันที่ {expDate}</div>
     <div>มิฉะนั้นการจองฉบับนี้จะถูกลบอัตโนมัติ</div> */

const WrapInCreate = styled.div`
  display: flex;
  align-items: center;
  cursor: ${props => props.backspace && 'pointer'};
`

const WrapAddBook = styled.div`
  display: flex;
  align-items: center;
`

// <-- renderTabMenu

const WrapList = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.more && 'center'};
  border-bottom: solid 2px rgba(0, 0, 0, 0.125);
  border-top: ${props => props.index === 0 && 'solid 2px rgba(0, 0, 0, 0.125)'};
  color: ${props => props.more && '#d20000'};
  font-style: ${props => props.more && 'italic'};
  padding: 14px 0;
  flex-direction: ${props => props.more && 'column'};
  margin: ${props => props.editbook && '12px 12px 0'};
`
const WrapChoose = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 26px 12px 17px;
  font-size: ${props => (props.head ? '16px' : '14px')};
  border-bottom: ${props => props.head && '1px solid rgba(0,0,0,.3)'};
  cursor: ${props => (props.head ? 'default' : 'pointer')};
  transition: 0.1s;
  background: ${props =>
    !props.head && props.hold === props.menu
      ? 'rgba(0, 0, 0, 0.6)'
      : 'transparent'};
  color: ${props =>
    !props.head && props.hold === props.menu ? 'white' : 'black'};
  :hover {
    background: ${props =>
      !props.head && props.hold !== props.menu && 'rgba(0, 0, 0, 0.125)'};
    color: ${props => !props.head && props.hold !== props.menu && 'black'};
  }
  :active {
    background: ${props =>
      !props.head && props.hold === props.menu
        ? 'rgba(0, 0, 0, 0.7)'
        : 'transparent'};
  }
`

// <-- renderListBook

const SCreateButton = styled(Button)``

const CreateText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.created ? '#d84315' : props.remBook ? 'red' : '#2962ff'};
  color: white;
  border-radius: 6px;
  overflow: hidden;
  margin-top: ${props => props.created && '36px'};
`

const WrapTextList = styled.div`
  width: ${props => (props.editbook ? '132px' : '92px')};
`

const WrapView = styled.div`
  padding: 12px;
`

const WrapTopic = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`

const WrapDisplay = styled.div``

// <-- renderNoVerified
const SButton = styled(Button)`
  width: ${props => props.created && '100%'};
  padding: 8px 12px;
`

const WrapSentEmail = styled.span`
  margin-top: 22px;
  border-radius: 99px;
  overflow: hidden;
  border: 2px #515bff solid;
`

const MailIcon = styled(MailOutline)`
  color: #515bff;
`

const InfoIcon = styled(InfoOutlined)`
  transform: scale(1.6);
`

// detailDialog
const WrapContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SInput = styled.input`
  padding: 12px 18px;
  border-radius: 12px;
  width: 190px;
  border: 2px solid #448aff;
  text-align: center;
  ::placeholder {
    color: #90caf9;
    font-family: 'Kanit', sans-serif;
    font-size: 16px;
  }
  outline: none;
`

const WrapLoading = styled.div`
  display: flex;
  align-items: center;
`

const WrapLoadinResent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`
const scale = keyframes`
  0% {transform: scale(0)}
  100% {transform: scale(2)}
`
const PassedIcon = styled(CheckCircleOutline)`
  animation: ${scale} 0.75s ease forwards;
  color: #9d99ff;
`

const EmailSelf = styled.div`
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #2962ff;
`

export {
  renderTabMenu,
  renderListBook,
  renderNoVerified,
  detailDialog,
  renderEditBook
}
