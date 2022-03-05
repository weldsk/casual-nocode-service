package token

import (
	"casual-nocode-service/models"
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
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

	return token.SignedString([]byte(GetKey()))
}

func GetJwtConfig() middleware.JWTConfig {
	return middleware.JWTConfig{
		Claims:     &jwtCustomClaims{},
		SigningKey: []byte(GetKey()),
	}
}

func GetKey() string {
	file, err := os.Open("secret_key.pem")
	if err != nil {
		fmt.Println("error")
	}
	defer file.Close()

	key, err := ioutil.ReadAll(file)
	return string(key)
}
