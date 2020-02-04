import jwtDecode from "jwt-decode";
import axios from "axios";

const CheckAuth = ({ title, noDataTitle, data, noData }) => {
  if (localStorage.hasOwnProperty("FBIdToken")) {
    document.title = title ? title : "BR URU";
    try {
      jwtDecode(localStorage.FBIdToken);
      return data;
    } catch (error) {
      document.title = noDataTitle;
      localStorage.removeItem("FBIdToken");
      localStorage.removeItem("mybook");
      delete axios.defaults.headers.common.Authorization;

      return noData;
    }
  } else {
    document.title = noDataTitle;
    return noData;
  }
};

export default CheckAuth;
