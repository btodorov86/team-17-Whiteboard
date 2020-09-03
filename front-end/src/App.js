import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from "./Components/Page/Login/Login";
import Register from "./Components/Page/Register/Register";
import Footer from "./Components/Base/Footer/Footer";
import NotFound from "./Components/Page/NotFound/NotFound";
import Loading from "./Components/Page/Loading/Loading";
import AllBooks from "./Components/Book/AllBooks";
import Profile from "./Components/Page/Profile/Profile";
import AuthContext, {
  getToken,
  getUser,
} from "./Providers/Context/AuthContext";
import GuardedRouteAuth from "./Providers/GuardedRoute/GuardedRouteAuth";
import SingleBook from "./Components/Book/SingleBook";
import GuardedRouteAdminAuth from "./Providers/GuardedRoute/GuardedRouteAdminAuth";
import Exception from "./Components/Base/Exception/Exception";
import { exceptionStatus } from "./Constants/Constant";
import ExceptionContext from "./Providers/Context/ExceptionContext";
import Navigation from "./Components/Base/Navigation/Navigation";
import UpdateAvatar from "./Components/Page/Profile/UpdateAvatar";
import AdminBookPage from "./Components/Page/AdminPages/AdminBookPage/AdminBookPage";
import AdminUpdateBookPage from "./Components/Page/AdminPages/AdminBookPage/AdminUpdateBook";
import AdminCreateBookPage from "./Components/Page/AdminPages/AdminBookPage/AdminCreateBook";
import AdminReviewPage from "./Components/Page/AdminPages/AdminReviewPage/AdminReviewPage";
import AdminCreateReviewPage from "./Components/Page/AdminPages/AdminReviewPage/AdminCreateReviewPage";
import AdminUpdateReviewPage from "./Components/Page/AdminPages/AdminReviewPage/AdminUpdateReviewPafe";
import AdminUserPage from "./Components/Page/AdminPages/AdminUserPage/AdminUserPage";
import AdminCreateUserPage from "./Components/Page/AdminPages/AdminUserPage/AdminCreateReviewPage";
import AdminUpdateUserPage from "./Components/Page/AdminPages/AdminUserPage/AdminUpdateReviewPage";
import LoadingContext from "./Providers/Context/LoadingContext";
import Chat from './Chat/Chat';
import BottomAppBar from './Components/Page/Chat/Chat';
import DrawerTest from './Components/Page/Chat/Drawer';
import LoggedUserHomePage from './Components/Page/LoggedUserHome/LoggedUserHome';
import Home from './Components/Page/Home/Home';
import Test from './Test';

const App = () => {
  const [user, setUser] = useState(getUser(getToken()));
  const [open, setOpen] = useState({
    value: false,
    msg: "try again after few seconds",
    statusCode: null,
    statusType: exceptionStatus.error,
  });
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <AuthContext.Provider value={{ user, setUser }}>
          <ExceptionContext.Provider value={{ open, setOpen }}>
            <Exception />
            {/* <Navigation /> */}
            <Switch>
              <Redirect from="/" exact to="/home" />
              <Route path="/home" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/password/reset" exact component={Login} />
              <Route path="/password/change" component={Register} />
              <Route path="/chat" component={Chat} />   {/*test*/}
              <Route path="/chat1" component={Test} />   {/*test*/}
              <Route path="/test" component={BottomAppBar} />   {/*test*/}
              <Route path="/test1" component={DrawerTest} />   {/*test*/}
              <Route path="/register" component={Register} />
              <Route path="/loading" component={Loading} />
              <GuardedRouteAuth
                user={user}
                path="/profile"
                exact
                component={LoggedUserHomePage}
              />
              {/* <GuardedRouteAuth
                path="/account"
                exact
                user={user}
                component={Profile}
              />
              <GuardedRouteAuth
                path="/account/password"
                exact
                user={user}
                component={Profile}
              />
              <GuardedRouteAuth
                path="/account/avatar/upload"
                user={user}
                component={UpdateAvatar}
              /> */}
              <Route path="*" component={NotFound} />
            </Switch>
          </ExceptionContext.Provider>
        </AuthContext.Provider>
      </LoadingContext.Provider>
    </BrowserRouter>
  );
};

export default App;
