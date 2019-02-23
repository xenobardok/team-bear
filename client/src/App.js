import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIgloo } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

import NavBar from "./components/layouts/NavBar";
import Landing from "./components/layouts/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

library.add(faIgloo);

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
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
