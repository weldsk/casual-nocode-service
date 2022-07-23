import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from "../components/signup.component";
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

describe("SignUp Test", () => {
  it("非ログイン状態のテスト", () => {
    expect(JSON.parse(localStorage.getItem("user") as string)).toBeNull();
  });
  it("初期状態が正しいか", () => {
    const { getByPlaceholderText } = render(<Router><SignUp /></Router>);
    expect(getByPlaceholderText("User name")).toHaveValue("");
    expect(getByPlaceholderText("Enter email")).toHaveValue("");
    expect(getByPlaceholderText("Enter password")).toHaveValue("");
    expect(getByPlaceholderText("Confirm password")).toHaveValue("");
  });
  it("登録失敗失敗パターンのテスト(Email重複)", async () => {
    postApiMock.mockRejectedValue({ response: { status: 409 } });
    const { getByPlaceholderText, getByRole, getByText } = render(<Router><SignUp /></Router>);
    userEvent.type(getByPlaceholderText("User name"), "test");
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.type(getByPlaceholderText("Confirm password"), "12345678Aa");
    userEvent.click(getByRole("button", { name: "Sign Up" }));
    await waitFor(() =>
      expect(getByText("Email is invalid or already registered")).toBeVisible(),
    );
  });
  it("登録失敗パターンのテスト(予期せぬエラー)", async () => {
    postApiMock.mockRejectedValue({});
    const { getByPlaceholderText, getByRole } = render(<Router><SignUp /></Router>);
    userEvent.type(getByPlaceholderText("User name"), "test");
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.type(getByPlaceholderText("Confirm password"), "12345678Aa");
    userEvent.click(getByRole("button", { name: "Sign Up" }));
    await waitFor(() =>
      expect(alerteMock).toBeCalled(),
    );
  });
  it("登録失敗パターンのテスト(token取得失敗)", async () => {
    postApiMock.mockResolvedValue({ data: {} });
    const { getByPlaceholderText, getByRole } = render(<Router><SignUp /></Router>);
    userEvent.type(getByPlaceholderText("User name"), "test");
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.type(getByPlaceholderText("Confirm password"), "12345678Aa");
    userEvent.click(getByRole("button", { name: "Sign Up" }));
    await waitFor(() =>
      expect(alerteMock).toBeCalled(),
    );
  });
  it("登録成功パターンのテスト", async () => {
    postApiMock.mockResolvedValue({ data: { token: "dummyToken" }, status: 200, statusText: "OK" });
    const { getByPlaceholderText, getByRole } = render(<Router><SignUp /></Router>);
    userEvent.type(getByPlaceholderText("User name"), "test");
    userEvent.type(getByPlaceholderText("Enter email"), "test@test.com");
    userEvent.type(getByPlaceholderText("Enter password"), "12345678Aa");
    userEvent.type(getByPlaceholderText("Confirm password"), "12345678Aa");
    userEvent.click(getByRole("button", { name: "Sign Up" }));
    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith("user", JSON.stringify({ token: "dummyToken" }));
      expect(mockNavigator).toHaveBeenCalledWith("/");
    });
  });
});
