import { render, cleanup, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter, Router } from 'react-router-dom';
import App from '../App';
import userEvent from "@testing-library/user-event";
import axios from "axios";
import TestRenderer from "react-test-renderer";
import { createMemoryHistory } from "history";

const { act, create } = TestRenderer;
jest.mock("axios");
const getApiMock = jest.spyOn(axios, "get").mockName("axios-get");
const setItemMock = jest.spyOn(Storage.prototype, "setItem");
const mockNavigator = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigator,
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup;
});

describe("routing test", () => {
  describe("非ログインセッション", () => {
    it("signupの遷移", async () => {
      const history = createMemoryHistory();
      getApiMock.mockRejectedValue({});
      await waitFor(() => {
        render(<Router location={"/"} navigator={history}><App /></Router>);
      });
      userEvent.click(screen.getByTestId("signup-nav"));
      expect(history.location.pathname).toBe("/signup");
    });
    it("loginの遷移", async () => {
      const history = createMemoryHistory();
      getApiMock.mockRejectedValue({});
      await waitFor(() => {
        render(<Router location={"/"} navigator={history}><App /></Router>);
      });
      userEvent.click(screen.getByTestId("login-nav"));
      expect(history.location.pathname).toBe("/login");
    });
    it("restrictedのリダイレクト確認", async () => {
      const history = createMemoryHistory();
      getApiMock.mockRejectedValue({});
      await waitFor(() => {
        render(<Router location={"/mypage"} navigator={history}><App /></Router>);
      });
      expect(history.location.pathname).toBe("/login");
    });
  });
  describe("ログイン済みセッション", () => {
    it("更新前後でnavbarが変わっていないかの確認", async () => {
    });
    it("signupとloginのリダイレクト確認", async () => {
      const history = createMemoryHistory();
      localStorage.setItem("user", JSON.stringify({ token: "dummyToken" }));
      getApiMock.mockResolvedValue({ status: 200, statusText: "OK" });
      await waitFor(() => {
        render(<Router location={"/login"} navigator={history}><App /></Router>);
      });
      expect(history.location.pathname).toBe("/");
      await waitFor(() => {
        render(<Router location={"/signup"} navigator={history}><App /></Router>);
      });
      expect(history.location.pathname).toBe("/");
    });
    it("restrictedにアクセスできるか", async () => {
      const history = createMemoryHistory();
      localStorage.setItem("user", JSON.stringify({ token: "dummyToken" }));
      getApiMock.mockResolvedValue({ status: 200, statusText: "OK" });
      await waitFor(() => {
        render(<Router location={"/"} navigator={history}><App /></Router>);
      });
      expect(setItemMock).toHaveBeenCalledWith("user", JSON.stringify({ token: "dummyToken" }));
      userEvent.click(screen.getByTestId("mypage-nav"));
      expect(history.location.pathname).toBe("/mypage");
    });
  });
  it("ログアウトのテスト", async () => {
    localStorage.setItem("user", JSON.stringify({ token: "dummyToken" }));
    getApiMock.mockResolvedValue({ status: 200, statusText: "OK" });
    await waitFor(() => {
      render(<BrowserRouter><App /></BrowserRouter>);
    });
    expect(setItemMock).toHaveBeenCalledWith("user", JSON.stringify({ token: "dummyToken" }));
    userEvent.click(screen.getByTestId("logout-nav"));
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("user") as string)).toBeNull();
    });
  });
});
