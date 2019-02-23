import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIgloo } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

import NavBar from "./components/layouts/NavBar";

library.add(faIgloo);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <NavBar />
        </Router>
      </Provider>
    );
  }
}

export default App;
