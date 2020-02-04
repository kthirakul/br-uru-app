const dayjs = require("dayjs");

export const findRoom = (roomid, roomdata) => {
  const room = roomdata.find(res => res.roomid === roomid);
  return room ? room.roomname : "ไม่มีข้อมูลห้อง";
};

export const showTime = (start, end) => {
  const onStart = dayjs(start).format("HH:mm");

  const onEnd = dayjs(end).format("HH:mm");
  if (onStart === "Invalid Date" || onEnd === "Invalid Date") {
    return "";
  }

  return `${onStart} - ${onEnd}`;
};

export const findLocation = (roomname, roomdata) => {
  const room = roomdata.find(res => res.roomname === roomname);
  return room ? room.location : "ไม่มีข้อมูลสถานที่";
};
