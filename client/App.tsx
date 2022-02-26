import React, { useState, useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Home from "./components/home.component";
import NotFoundPage from "./components/notfound.component";

import authHeader from "./services/auth-header";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    checkLoginStatus()
  })

  const checkLoginStatus = () => {
    axios.get(process.env.REACT_APP_PRIVATE_API_URL + "/status", { headers: authHeader() })
      .then((response: AxiosResponse) => {
        setIsAuthenticated(true);
      }).catch((error: AxiosError) => {
        setIsAuthenticated(false);
      })
  }

  const processLogout = () => {
    /*TODO*/
    localStorage.removeItem("user");
  }

  const switchNavbar = () => {
    if (isAuthenticated) {
      return (
        <Nav onClick={processLogout}>
          <Nav.Link href={"/"}>
              Logout
          </Nav.Link>
        </Nav>
      )
    } else {
      return (
        <>
          <Nav.Link href={"/login"}>
            Login
          </Nav.Link>
          <Nav.Link href={"/signup"}>
            Sign up
          </Nav.Link>
        </>
      )
    }
  }

  return (
    <div className="App">
      <Navbar collapseOnSelect expand="lg" bg="light" fixed="top">
        <Container fluid>
          <Navbar.Brand href={"/"}>
            cncs
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarTogglerContent" />
          <Navbar.Collapse id="navbarTogglerContent">
            <Nav className="me-auto mb-2 mb-lg-0">
              {switchNavbar()}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;