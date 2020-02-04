const task = `


1
-room display
-room สถานะเปิดให้จองได้ // ไม่เปิดให้จอง(หมายถึง อาจจะมีการซ่อมแซม)

2
-book room (main)

2.1
-ทำ book dialog ไว้แสดง (มี path จ่าก pushState) ซึ่งสามารถกดเข้าไปแก้ไขได้
-พอกดแก้ไขมันจะไปหน้า /book/:bookid

3
-แก้ไข book
-view book ก่อน
-status
  -หมดอายุวันที่
  -หมดอายุแล้ว
  -บันทึกการจองแล้ว

หมดอายุ ไม่ต้องลบ ให้เขาลบเอง หรือ admin สามารถเคลียร์เองได้
-หนังสือหมดอายุ
-สถานะหนังสือกันแก้ไข และลบ
 -จองห้อง จะมีวันหมดอายุและสามารถแก้ไขได้

 (จากนี้จะแก้ไขและลยไม่ได้แล้ว)
 -เมื่อส่งหนังสือแล้วสถานะหนังสือจะเปลี่ยนเป็น บันทึกการจองแล้ว
 -เมื่อยืนยันแล้วจะเป็นเป็น สามารถใช้ห้องได้

expired มี 3 สถานะ
-หมดอายุ 12 ธ.ค. 2019
-ใบการจองหมดอายุ *ไม่ยื้นใบก่อนกำหนด
-บันทึกการจองแล้ว *ส่งใบแล้ว พนง พิมรหัสใบบันทึกเพื่อคอนเฟิร์ม




4
-การจอง(ในปฏิทิน)จะหายไปเมื่อถึงวันจอง(และหมดอายุ) คนอื่นจะสามารถจองวันนั้นได้

5
-แก้ error 429 โดยให้ลบ FBTokenId ออก
-จะเด้ง dialog ขึ้นมาให้กดว่า จะเริ่มต้นระบบใหม่ไหม
  -เริ่มต้นระบบใหม่จะลบ token และ refresh หน้า 

-วันหมดอายุุให้ทำใน cli ค่อยไปถามพี่เขาตอนทำเสร็จว่าให้หมดอายุยังไง

*วิธีใช้งาน ด้านล่างสุดจะเป็นคำว่า "จองตอนนี้*
`;

// exp date
// const currentDate = new Date();
// const expDate = dayjs(currentDate.setDate(currentDate.getDate() + 7)).format(
//   "D MMM YYYY"
// )




export const filterBook = payload => {
  console.log("AllBookFunc.js |payload| = ", payload);
  console.log("AllBookFunc.js |payload| = ", payload);

  let newBookData = [];
  payload.forEach((mouth, i) => {
    mouth &&
      Object.keys(mouth).forEach(date => {
        const currDate = dayjs(new Date()).format("YYYY,MM,DD");
        const bookDate = dayjs(date.slice(0, 10)).format("YYYY,MM,DD");
        const bookExp = dayjs(date.slice(11, 21)).format("YYYY,MM,DD");
        console.log(
          `${bookExp} isSame ${currDate}`,
          dayjs(bookExp).isSame(currDate)
        );
        if (
          dayjs(bookExp).isAfter(currDate) ||
          dayjs(bookExp).isSame(currDate)
        ) {
          newBookData.push({
            [i]: {
              [bookDate]: payload[i][date]
            }
          });
        }
      });
  });




  exports.addBook = (req, res) => {
  // เอาไว้ไปถามเขาอีกทีว่าจะให้หมดอายุภายในกี่วัน
  const result = `${req.params.roomid.slice(0, 5)}${Date.now()
    .toString()
    .slice(6)}${req.user.uid.slice(0, 5)}`.toUpperCase();

  let bookid = "";
  let charactersLength = result.length;
  for (let i = 0; i < 9; i++) {
    bookid += result.charAt(Math.floor(Math.random() * charactersLength));
  }

  const dateFormat = dayjs(new Date(req.params.date)).format("YYYY,MM");
  const dateExp = dayjs(new Date(req.body.expired)).format("YYYY,MM,DD");
  const newBook = {
    [`${req.params.date},${dateExp}`]: {
      [bookid]: {
        bookid,
        detail: req.body.detail,
        roomid: req.params.roomid,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        addBook: new Date().toISOString(),
        userid: req.user.uid,
        username: req.user.username,
        bookstatus: "รอหนังสือร้องขอ",
        expired: req.body.expired,
        assets: req.body.assets
      }
    }
  };

  return db
    .doc(`/books/${dateFormat}`)
    .set(newBook, { merge: true })

    .then(() => {
      db.doc(`/userbooks/${req.user.uid}`)
        .get()
        .then(userbook => {
          if (userbook.data()) {
            // ลอง get ช้อมูลมาละ ค่อย push ลงไปอีกที

            const date = userbook.data()[req.params.date];
            const mybook = {
              [req.params.date]: date ? date.concat(bookid) : [bookid]
            };
            return db
              .doc(`/userbooks/${req.user.uid}`)
              .set(mybook, { merge: true });
          } else {
            const mybook = {
              [req.params.date]: [bookid]
            };

            return db
              .doc(`/userbooks/${req.user.uid}`)
              .set(mybook, { merge: true });
          }
        })
        .then(() => {
          res.json({
            message: `ทำการจองรียบร้อยแล้ว!`
          });
        });
    })

    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};