package handler

import (
	"bytes"
	"casual-nocode-service/database"
	"casual-nocode-service/models"
	"casual-nocode-service/token"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/stretchr/testify/assert"
)

// テスト用ハンドラ作成
func createTestHandler() Handler {
	db := database.CreateMemory()
	h := Handler{db, "test_storage/"}
	os.RemoveAll(h.StoragePath)
	return h
}

// テスト用ハンドラクローズ
func (h *Handler) closeTestHandler() {
	h.DB.Close()
	os.RemoveAll(h.StoragePath)
}

// テスト用認証
func createTestToken(h *Handler) string {
	name := "test name"
	email := "email@email.test"
	password := "password"

	// 認証情報作成
	user := models.User{Name: name, Email: email}
	user.SetPassword(password)
	db := h.DB.Users.Create(&user)
	if db.Error != nil {
		os.Exit(1)
	}
	tokenStr, err := token.CreateToken(user)
	if err != nil {
		os.Exit(1)
	}
	return tokenStr
}

func TestMain(m *testing.M) {

	os.RemoveAll("test_storage\\")

	m.Run()

}
func TestSignUpUser(t *testing.T) {
	e := echo.New()
	h := createTestHandler()
	defer h.closeTestHandler()

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
		h.DB.Users.First(&user)
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
	h := createTestHandler()
	defer h.closeTestHandler()

	name := "test name"
	email := "email@email.test"
	password := "password"

	user := models.User{Name: name, Email: email}
	user.SetPassword(password)
	h.DB.Users.Create(&user)

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

func TestGetUserInfo(t *testing.T) {
	e := echo.New()
	h := createTestHandler()
	defer h.closeTestHandler()

	name := "test name"
	email := "email@email.test"
	password := "password"

	// 認証情報作成
	user := models.User{Name: name, Email: email}
	user.SetPassword(password)
	h.DB.Users.Create(&user)
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

func createImage(width int, height int) image.Image {
	img := image.NewRGBA(image.Rect(0, 0, width, height))
	c := uint8(0)
	for x := 0; x < width; x++ {
		for y := 0; y < height; y++ {
			img.SetRGBA(x, y, color.RGBA{c, c, c, 255})
			c++
		}
	}
	return img
}

func createPngBuffer(img image.Image, fieldName string, fileName string) (string, *bytes.Buffer) {
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	file, err := writer.CreateFormFile(fieldName, fileName)
	defer writer.Close()
	if err != nil {
		os.Exit(1)
	}
	err = png.Encode(file, img)
	if err != nil {
		os.Exit(1)
	}
	return writer.FormDataContentType(), body
}

func TestGetIcon(t *testing.T) {
	e := echo.New()
	h := createTestHandler()
	defer h.closeTestHandler()

	tokenStr := createTestToken(&h)

	// 未アップロード
	req := httptest.NewRequest(http.MethodGet, "/geticon", nil)
	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf(`Bearer %s`, tokenStr))
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	assert.EqualError(t, middleware.JWTWithConfig(token.GetJwtConfig())(h.GetIcon)(c),
		echo.NewHTTPError(http.StatusNotFound, "not found icon").Error())

	// 画像生成
	img := createImage(256, 256)

	os.MkdirAll(h.StoragePath+"icon/", os.ModePerm)
	file, err := os.Create(h.StoragePath + "icon/1.png")
	png.Encode(file, img)
	assert.NoError(t, err)

	// 成功
	req = httptest.NewRequest(http.MethodGet, "/geticon", nil)
	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf(`Bearer %s`, tokenStr))
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	if assert.NoError(t, middleware.JWTWithConfig(token.GetJwtConfig())(h.GetIcon)(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		uploadFile, err := ioutil.ReadFile(h.StoragePath + "icon/1.png")
		assert.NoError(t, err)
		assert.ElementsMatch(t, rec.Body.Bytes(), uploadFile)
	}

}

func TestSetIcon(t *testing.T) {
	e := echo.New()
	h := createTestHandler()
	defer h.closeTestHandler()

	tokenStr := createTestToken(&h)

	// 画像生成
	img := createImage(256, 256)
	contentType, body := createPngBuffer(img, "icon", "test.png")

	// 成功
	req := httptest.NewRequest(http.MethodPost, "/seticon", body)
	req.Header.Set(echo.HeaderContentType, contentType)
	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf(`Bearer %s`, tokenStr))
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, middleware.JWTWithConfig(token.GetJwtConfig())(h.SetIcon)(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		uploadFile, err := os.Open(h.StoragePath + "icon/1.png")
		assert.NoError(t, err)
		uploadImg, err := png.Decode(uploadFile)
		assert.NoError(t, err)
		for x := 0; x < 256; x++ {
			for y := 0; y < 256; y++ {
				assert.Equal(t, img.At(x, y), uploadImg.At(x, y))
			}
		}
	}

	// 画像生成
	img = createImage(257, 257)
	contentType, body = createPngBuffer(img, "icon", "test.png")

	// 画像サイズ超過
	req = httptest.NewRequest(http.MethodPost, "/seticon", body)
	req.Header.Set(echo.HeaderContentType, contentType)
	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf(`Bearer %s`, tokenStr))
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	assert.EqualError(t, middleware.JWTWithConfig(token.GetJwtConfig())(h.SetIcon)(c),
		echo.NewHTTPError(http.StatusBadRequest, "image size exceeds 256x256").Error())
}
