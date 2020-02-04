import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalState from "./store/GlobalState";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
// Pages
import DatePick from "./pages/DatePick";
import Monitor from "./pages/Monitor";
import MainScreen from "./pages/MainScreen";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ListScreen from "./pages/ListScreen";
import AllbookScreen from "./pages/AllbookScreen";
import TellScreen from "./pages/TellScreen";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import EditProfile from "./pages/EditProfile";
import Success from "./pages/Success";
import ForgotPassword from "./pages/ForgotPassword";
import HomeScreen from "./pages/HomeScreen";
import TutorialScreen from "./pages/TutorialScreen";
import RoomScreen from "./pages/RoomScreen";
import ErrorScreen from "./pages/ErrorScreen";

dayjs.locale("th");

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Kanit", "Helvetica", "Arial", sans-serif'
  }
});

axios.defaults.baseURL =
  "https://us-central1-br-uru-674f9.cloudfunctions.net/api";

function App() {
  return (
    <GlobalState>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Monitor>
              <Switch>
                <Route exact path="/" component={MainScreen} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/home" component={HomeScreen} />
                <Route exact path="/tutorial" component={TutorialScreen} />
                <Route exact path="/settings" component={Settings} />
                <Route exact path="/settings/edit" component={EditProfile} />
                <Route exact path="/allbooks" component={AllbookScreen} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/books" component={ListScreen} />
                <Route exact path="/books/:bookid" component={ListScreen} />
                <Route exact path="/contact" component={TellScreen} />
                <Route exact path="/allbooks/:datepick" component={DatePick} />
                <Route exact path="/recover" component={ForgotPassword} />
                <Route path="/success/signin" component={Success} />
                <Route exact path="/rooms" component={RoomScreen} />
                <Route exact path="/rooms/:roomid" component={RoomScreen} />
                <Route exact path="/error" component={ErrorScreen} />
                <Route component={NotFound} />
              </Switch>
            </Monitor>
          </Router>
        </div>
      </MuiThemeProvider>
    </GlobalState>
  );
}

export default App;
