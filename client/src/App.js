import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./util/setAuthToken";
import { clearCurrentProfile } from "./actions/profileActions";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import ReduxToastr from "react-redux-toastr";
import "./App.css";
import NavBar from "./components/layouts/NavBar";
import Landing from "./components/layouts/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./common/PrivateRoute";

// Code that checks for token
if (localStorage.jwtToken) {
  //Set auth token header
  setAuthToken(localStorage.jwtToken);
  //Decode token and get user info
  const decoded = jwt_decode(localStorage.jwtToken);
  // setuser and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/" component={NavBar} />
            <Route exact path="/login" component={NavBar} />
            <Route exact path="/register" component={NavBar} />
            <Switch>
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
            {/* <Route path="/rubrics" component={Rubrics} /> */}
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </div>
        </Router>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
          closeOnToastrClick
        />
      </Provider>
    );
  }
}

export default App;
