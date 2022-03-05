package token

import (
	"casual-nocode-service/models"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type jwtCustomClaims struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	jwt.StandardClaims
}

func CreateToken(user *models.User) (string, error) {
	claims := &jwtCustomClaims{
		user.ID,
		user.Name,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte("secret_key"))
}

func GetJwtConfig() middleware.JWTConfig {
	return middleware.JWTConfig{
		Claims:     &jwtCustomClaims{},
		SigningKey: []byte("secret_key"),
	}
}

func GetName(c echo.Context) string {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*jwtCustomClaims)
	return claims.Name
}

func GetId(c echo.Context) uint {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*jwtCustomClaims)
	return claims.ID
}
