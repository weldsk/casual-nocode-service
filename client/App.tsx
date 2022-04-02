import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Home from "./components/home.component";
import NotFoundPage from "./components/notfound.component";
import MyPage from "./components/mypage.component";

import TestPage from "./components/testpage.component";

import RedirectRoute from "./services/custom-router";
import AuthProvider from "./services/use-auth";
import NavigationBar from "./components/navbar.component";

function App() {
  useLocation();
  return (
    <div className="App">
      <AuthProvider>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<RedirectRoute
            logined={false}
            redirectPath={"/"}
          />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<RedirectRoute
            logined={true}
            redirectPath={"/login"}
          />}>
            <Route path="/testpage" element={<TestPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
