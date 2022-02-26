import React, { useState, useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Home from "./components/home.component";
import NotFoundPage from "./components/notfound.component";

import authHeader from "./services/auth-header";

function App() {

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
              <Nav.Link href={"/login"}>
                Login
              </Nav.Link>
              <Nav.Link href={"/signup"}>
                Sign up
              </Nav.Link>
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