package handler

import (
	"casual-nocode-service/database"
	"casual-nocode-service/models"
	"casual-nocode-service/token"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/stretchr/testify/assert"
)

func TestSignUpUser(t *testing.T) {
	e := echo.New()
	db := database.CreateMemory()
	defer db.Close()
	h := Handler{db}

	name := "test name"
	email := "email@email.test"
	password := "password"

	json := fmt.Sprintf(`{"name":"%s","email":"%s","password":"%s"}`, name, email, password)
	req := httptest.NewRequest(http.MethodPost, "/signup", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.SignUpUser(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)

		// ユーザの追加を確認
		user := new(models.User)
		db.Users.First(&user)
		assert.Equal(t, user.Name, name)
		assert.Equal(t, user.Email, email)
	}
}

func TestLoginUser(t *testing.T) {
	e := echo.New()
	db := database.CreateMemory()
	defer db.Close()
	h := Handler{db}

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
	assert.Equal(t, echo.ErrUnauthorized, h.LoginUser(c))

	// パスワードが異なる
	json = fmt.Sprintf(`{"email":"%s","password":"%s"}`, email, "abcdef")
	req = httptest.NewRequest(http.MethodPost, "/login", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	// 認証エラー
	assert.Equal(t, echo.ErrUnauthorized, h.LoginUser(c))
}

func TestGetUserInfo(t *testing.T) {
	e := echo.New()
	db := database.CreateMemory()
	defer db.Close()
	h := Handler{db}

	name := "test name"
	email := "email@email.test"
	password := "password"

	// 認証情報作成
	user := models.User{Name: name, Email: email}
	user.SetPassword(password)
	db.Users.Create(&user)
	tokenStr, err := token.CreateToken(user)
	assert.NoError(t, err)

	// ユーザー情報取得
	req := httptest.NewRequest(http.MethodGet, "/userinfo", nil)
	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf(`Bearer %s`, tokenStr))
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	expectJson := fmt.Sprintf(`{"email":"%s","username":"%s"}`, email, name)
	if assert.NoError(t, middleware.JWTWithConfig(token.GetJwtConfig())(h.GetUserInfo)(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.JSONEq(t, expectJson, rec.Body.String())
	}
}
