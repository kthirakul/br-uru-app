import React from "react";
import {
  DateRange,
  BookmarkBorder,
  AccessTimeOutlined,
  Create,
  Bookmarks,
  BusinessCenterOutlined,
  Update,
  DescriptionOutlined,
  Assessment,
  DeleteSweep,
  PermDataSetting,
  EditLocation,
  Person,
  CallEnd
} from "@material-ui/icons";

export const listData = (
  datebook,
  timeStart,
  timeEnd,
  roombook,
  notebook,
  assets
) => [
  {
    topic: "วันที่",
    icon: <DateRange style={{ marginRight: 4 }} />,
    data: datebook
  },
  {
    topic: "ห้อง",
    icon: <BookmarkBorder style={{ marginRight: 4 }} />,
    data: roombook
  },
  {
    topic: "เวลาเริ่ม",
    icon: <AccessTimeOutlined style={{ marginRight: 4 }} />,
    data: timeStart
  },
  {
    topic: "เวลาสิ้นสุด",
    icon: <Update style={{ marginRight: 4 }} />,
    data: timeEnd
  },

  {
    topic: "อุปกรณ์",
    icon: <BusinessCenterOutlined style={{ marginRight: 4 }} />,
    data: assets.length > 0 ? assets : null
  },
  {
    topic: "หมายเหตุ",
    icon: <DescriptionOutlined style={{ marginRight: 4 }} />,
    data: notebook
  }
];

export const menus = (admin, render) => {
  const adminMenu = [
    {
      menu: "จัดการการจอง",
      icon: <Assessment style={{ marginRight: render ? 6 : 18 }} />,
      page: "admin"
    },
    {
      menu: "ลบการจอง",
      icon: <DeleteSweep style={{ marginRight: render ? 6 : 18 }} />,
      page: "admin"
    },
    {
      menu: "ตั้งค่าคำร้อง",
      icon: <PermDataSetting style={{ marginRight: render ? 6 : 18 }} />,
      page: "admin"
    },
    {
      menu: "จัดการห้อง",
      icon: <EditLocation style={{ marginRight: render ? 6 : 18 }} />,
      page: "admin"
    },
    {
      menu: "จัดการผู้ใช้",
      icon: <Person style={{ marginRight: render ? 6 : 18 }} />,
      page: "admin"
    },
    {
      menu: "แก้ไขการติดต่อ",
      icon: <CallEnd style={{ marginRight: render ? 8 : 18 }} />,
      page: "admin"
    }
  ];

  const userMenu = [
    {
      menu: "สร้างการจอง",
      icon: <Create style={{ marginRight: 18 }} />,
      page: "booking"
    },
    {
      menu: "แก้ไขการจอง",
      icon: <Bookmarks style={{ marginRight: 18 }} />,
      page: "bookedit"
    }
  ];

  return admin ? [...adminMenu, ...userMenu] : userMenu;
};
