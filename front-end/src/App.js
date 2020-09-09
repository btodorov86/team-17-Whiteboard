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
              {/* <Route path="/login" component={Login} /> */}
              <Route path="/chat1" component={Test} />   {/*test*/}
              {/* <Route path="/register" component={Register} /> */}
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
