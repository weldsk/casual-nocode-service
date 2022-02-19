import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Home from "./components/home.component";
import NotFoundPage from "./components/notfound.component";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>
            cncs
          </Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/signup"}>
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <div className="auth-wrapper">
              <div className="auth-inner">
                <Login />
              </div>
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="auth-wrapper">
              <div className="auth-inner">
                <SignUp />
              </div>
            </div>
          }
        />
        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </div>
  );
}

export default App;
