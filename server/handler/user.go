package handler

import (
	"casual-nocode-service/models"
	"casual-nocode-service/token"
	"image/png"
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo"
)

// ログインリクエスト
type loginRequest struct {
	Email    string
	Password string
}

// ユーザー登録リクエスト
type signupRequest struct {
	Name     string
	Email    string
	Password string
}

// ユーザーログイン
func (h *Handler) LoginUser(c echo.Context) error {
	param := new(loginRequest)
	if err := c.Bind(param); err != nil {
		return echo.ErrBadRequest
	}

	// 登録済みユーザの検索
	user := new(models.User)
	result := h.DB.Users.
		Where("email == ?", param.Email).
		Limit(1).
		Find(&user)
	if result.Error != nil {
		return result.Error
	}

	// アカウントが無い
	if result.RowsAffected <= 0 {
		return echo.NewHTTPError(
			http.StatusUnauthorized,
			"invalid email")
	}

	// パスワードが異なる
	if !user.Login(param.Password) {
		return echo.NewHTTPError(
			http.StatusUnauthorized,
			"invalid password")
	}

	// トークン生成
	token, err := token.CreateToken(*user)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token": token,
	})
}

// ユーザ作成
func (h *Handler) SignUpUser(c echo.Context) error {
	param := new(signupRequest)
	if err := c.Bind(param); err != nil {
		return echo.ErrBadRequest
	}

	result := h.DB.Users.
		Where("email == ?", param.Email).
		Limit(1).
		Find(&models.User{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected > 0 {
		// emailが登録済み
		return echo.NewHTTPError(
			http.StatusConflict,
			"email already exits")
	}

	user := models.User{Name: param.Name, Email: param.Email}
	err := user.SetPassword(param.Password)
	if err != nil {
		return err
	}
	result = h.DB.Users.Create(&user)
	if result.Error != nil {
		return result.Error
	}

	// トークン生成
	token, err := token.CreateToken(user)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, echo.Map{
		"token": token,
	})
}

// ユーザー情報取得
func (h *Handler) GetUserInfo(c echo.Context) error {
	id := token.GetId(c)
	user := models.User{}
	result := h.DB.Users.First(&user, id)
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(http.StatusOK, echo.Map{
		"username": user.Name,
		"email":    user.Email,
	})
}

func (h *Handler) GetIcon(c echo.Context) error {
	id := token.GetId(c)
	user := models.User{}
	result := h.DB.Users.First(&user, id)
	if result.Error != nil {
		return result.Error
	}

	file, err := os.Open(h.StoragePath + "icon\\" + strconv.FormatUint(uint64(id), 10) + ".png")
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"icon": file,
	})
}

// ユーザーアイコン設定
func (h *Handler) SetIcon(c echo.Context) error {
	id := token.GetId(c)
	user := models.User{}
	result := h.DB.Users.First(&user, id)
	if result.Error != nil {
		return result.Error
	}

	iconFile, err := c.FormFile("icon")
	if err != nil {
		return err
	}

	if iconFile.Size > 100*1024 {
		return echo.NewHTTPError(http.StatusBadRequest, "too large file")
	}

	src, err := iconFile.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	image, err := png.Decode(src)
	size := image.Bounds().Size()
	if err != nil {
		return echo.NewHTTPError(http.StatusUnsupportedMediaType, "not supported file")
	}
	if size.X > 256 || size.Y > 256 {
		return echo.NewHTTPError(http.StatusBadRequest, "image size exceeds 256x256")
	}

	os.MkdirAll(h.StoragePath+"icon/", os.ModePerm)
	dst, err := os.Create(h.StoragePath + "icon/" + strconv.FormatUint(uint64(id), 10) + ".png")
	if err != nil {
		return err
	}
	defer dst.Close()

	err = png.Encode(dst, image)
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}
