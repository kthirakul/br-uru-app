import React from "react";
import BookScreen from "./BookScreen";
import LoginScreen from "./LoginScreen";
import CheckAuth from "../util/CheckAuth";

const MainScreen = ({ history }) => {
  return (
    <CheckAuth
      title={"การจองห้อง"}
      data={<BookScreen history={history} />}
      noData={<LoginScreen history={history} />}
      noDataTitle={"ยินดีต้องรับสู่ระบบ BR URU"}
    />
  );
};

export default MainScreen;
