package controller

import (
	"casual-nocode-service/database"
	"casual-nocode-service/models"
	"casual-nocode-service/token"
	"crypto/sha256"
	"encoding/hex"
	"net/http"

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
func LoginUser(c echo.Context) error {
	param := new(loginRequest)
	if err := c.Bind(param); err != nil {
		return err
	}

	db, err := database.Connect("users")
	if err != nil {
		panic("failed to connect database")
	}

	user := new(models.User)
	result := db.First(&user, "email = ?", param.Email)
	if result.Error != nil {
		return err
	}

	sha256 := sha256.Sum256([]byte(param.Password))
	hashed := hex.EncodeToString(sha256[:])

	if result.RowsAffected <= 0 || hashed != user.PasswordHashed {
		return echo.ErrUnauthorized
	}

	token, err := token.CreateToken(user)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token": token,
	})
}

// ユーザ作成
func SignUpUser(c echo.Context) error {
	param := new(signupRequest)
	if err := c.Bind(param); err != nil {
		return err
	}

	db, err := database.Connect("users")
	if err != nil {
		return err
	}

	result := db.
		Where("email == ?", param.Email).
		Limit(1).
		Find(&models.User{})

	if result.Error != nil {
		return err
	}

	if result.RowsAffected > 0 {
		// emailが登録済み
		return c.NoContent(http.StatusConflict)
	}
	sha256 := sha256.Sum256([]byte(param.Password))
	hashed := hex.EncodeToString(sha256[:])
	user := models.User{Name: param.Name, Email: param.Email, PasswordHashed: hashed}
	result = db.Create(&user)
	if result.Error != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}
