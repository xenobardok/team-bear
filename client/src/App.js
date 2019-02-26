import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./util/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faIgloo } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

import NavBar from "./components/layouts/NavBar";
import Landing from "./components/layouts/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
// import Dashboard from "./components/dashboard/Dashboard";

// library.add(faIgloo);

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

    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <NavBar />
            <Route exact path="/" component={Landing} />
            <div className="form">
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              {/* <Route exact path="/dashboard" component={Dashboard} /> */}
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
