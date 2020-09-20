import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import NotFound from "./Components/Page/NotFound/NotFound";
import Loading from "./Components/Page/Loading/Loading";
import AuthContext, {
  getToken,
  getUser,
} from "./Providers/Context/AuthContext";
import GuardedRouteAuth from "./Providers/GuardedRoute/GuardedRouteAuth";
import Exception from "./Components/Base/Exception/Exception";
import { exceptionStatus } from "./Constants/Constant";
import ExceptionContext from "./Providers/Context/ExceptionContext";
import LoadingContext from "./Providers/Context/LoadingContext";
import LoggedUserHomePage from './Components/Page/LoggedUserHome/LoggedUserHome';
import Home from './Components/Page/Home/Home';
import GuestUserHomePage from './Components/Page/LoggedUserHome/GuestUserHomePage';

const App = () => {
  const [user, setUser] = useState(getUser(getToken()));
  const [open, setOpen] = useState({
    value: false,
    msg: "Please try again after a few seconds",
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
            <Switch>
              <Redirect from="/" exact to="/home" />
              <Route path="/home" component={Home} />
              <Route path="/profile/guest" exact component={GuestUserHomePage} />
              <Route path="/loading" component={Loading} />
              <GuardedRouteAuth
                user={user}
                path="/profile/:id"
                component={LoggedUserHomePage}
              />
              <Route path="*" component={NotFound} />
            </Switch>
          </ExceptionContext.Provider>
        </AuthContext.Provider>
      </LoadingContext.Provider>
    </BrowserRouter>
  );
};

export default App;
