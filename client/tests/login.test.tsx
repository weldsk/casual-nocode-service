import { render, cleanup, waitFor, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Login from "../components/login.component";
import userEvent from "@testing-library/user-event";
import axios from "axios";

jest.mock("axios");
const postApiMock = jest.spyOn(axios, "post").mockName("axios-post");
const alerteMock = jest.spyOn(window, "alert").mockImplementation();
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
afterEach(cleanup);

describe("Login Test", () => {
  it("非ログイン状態のテスト", () => {
    expect(JSON.parse(localStorage.getItem("user") as string)).toBeNull();
  });
  it("初期状態が正しいか", () => {
    const { getByPlaceholderText } = render(<Router><Login /></Router>);
    expect(getByPlaceholderText("Enter email")).toHaveValue("");
    expect(getByPlaceholderText("Enter password")).toHaveValue("");
  });
  it("ログイン失敗パターンのテスト", async () => {
    postApiMock.mockRejectedValue({ response: { status: 401 } });
    const { getByPlaceholderText, getByTestId, getByRole } = render(<Router><Login /></Router>);
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.click(getByTestId("login-btn"));
    await waitFor(() =>
      expect(getByRole("alert")).toBeVisible(),
    );
  });
  it("ログイン失敗パターンのテスト(予期せぬエラー)", async () => {
    postApiMock.mockRejectedValue({});
    const { getByPlaceholderText, getByTestId } = render(<Router><Login /></Router>);
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.click(getByTestId("login-btn"));
    await waitFor(() =>
      expect(alerteMock).toBeCalled(),
    );
  });
  it("ログイン失敗パターンのテスト(token取得失敗)", async () => {
    postApiMock.mockResolvedValue({ data: {} });
    const { getByPlaceholderText, getByTestId } = render(<Router><Login /></Router>);
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.click(getByTestId("login-btn"));
    await waitFor(() =>
      expect(alerteMock).toBeCalled(),
    );
  });
  it("ログイン成功パターンのテスト", async () => {
    postApiMock.mockResolvedValue({ data: { token: "dummyToken" }, status: 200, statusText: "OK" });
    const { getByPlaceholderText, getByTestId } = render(<Router><Login /></Router>);
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.click(getByTestId("login-btn"));
    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith("user", JSON.stringify({ token: "dummyToken" }));
      expect(mockNavigator).toHaveBeenCalledWith("/");
    });
  });
});
