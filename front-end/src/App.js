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
            <Navigation />
            <Switch>
              <Redirect from="/" exact to="/home" />
              <Redirect from="/home" to="/books" />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/loading" component={Loading} />
              <Route path="/admin" exact component={Login} />
              <Redirect
                from="/admin/dashboard"
                exact
                to="/admin/dashboard/books"
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/books"
                exact
                component={AdminBookPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/users"
                exact
                component={AdminUserPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/reviews"
                exact
                component={AdminReviewPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/users/create"
                exact
                component={AdminCreateUserPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/reviews/create"
                exact
                component={AdminCreateReviewPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/users/:id/update"
                exact
                component={AdminUpdateUserPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/books/:id/update"
                exact
                component={AdminUpdateBookPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/reviews/:id/update"
                exact
                component={AdminUpdateReviewPage}
              />
              <GuardedRouteAdminAuth
                user={user}
                path="/admin/dashboard/books/create"
                exact
                component={AdminCreateBookPage}
              />
              <Route path="/books" exact component={AllBooks} />
              <Route path="/books/search/:header" component={AllBooks} />
              <GuardedRouteAuth
                exact
                path="/books/:id"
                user={user}
                component={SingleBook}
              />
              <GuardedRouteAuth
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
              />
              <Route path="*" component={NotFound} />
            </Switch>
            <Footer />
          </ExceptionContext.Provider>
        </AuthContext.Provider>
      </LoadingContext.Provider>
    </BrowserRouter>
  );
};

export default App;
