package handler

import (
	"casual-nocode-service/database"
	"casual-nocode-service/models"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

func TestSignUpUser(t *testing.T) {
	e := echo.New()
	db := database.CreateMemory()
	defer db.Close()
	h := Handler{DB: db}

	name := "test name"
	email := "email@email.test"
	password := "password"

	json := fmt.Sprintf(`{"name":"%s","email":"%s","password":"%s"}`, name, email, password)
	req := httptest.NewRequest(http.MethodPost, "/signup", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.SignUpUser(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)

		// ユーザの追加を確認
		user := new(models.User)
		db.Users.First(&user)
		assert.Equal(t, user.Name, name)
		assert.Equal(t, user.Email, email)
	}
	// アドレスが未登録
	json = fmt.Sprintf(`{"name":"%s","email":"%s","password":"%s"}`, name, email, password)
	req = httptest.NewRequest(http.MethodPost, "/signup", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	// 登録済みのアドレス
	assert.EqualError(t, h.SignUpUser(c), echo.NewHTTPError(
		http.StatusConflict, "email already exits").Error())
}

func TestLoginUser(t *testing.T) {
	e := echo.New()
	db := database.CreateMemory()
	defer db.Close()
	h := Handler{DB: db}

	name := "test name"
	email := "email@email.test"
	password := "password"

	user := models.User{Name: name, Email: email}
	user.SetPassword(password)
	db.Users.Create(&user)

	// ログイン成功
	json := fmt.Sprintf(`{"email":"%s","password":"%s"}`, email, password)
	req := httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	// 認証成功
	if assert.NoError(t, h.LoginUser(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}

	// アドレスが未登録
	json = fmt.Sprintf(`{"email":"%s","password":"%s"}`, "abc@abc.test", password)
	req = httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	// 認証エラー
	assert.EqualError(t, h.LoginUser(c), echo.NewHTTPError(
		http.StatusUnauthorized, "invalid email").Error())

	// パスワードが異なる
	json = fmt.Sprintf(`{"email":"%s","password":"%s"}`, email, "abcdef")
	req = httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	// 認証エラー
	assert.EqualError(t, h.LoginUser(c), echo.NewHTTPError(
		http.StatusUnauthorized, "invalid password").Error())
}
