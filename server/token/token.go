package token

import (
	"casual-nocode-service/models"
	"time"

	"github.com/golang-jwt/jwt"
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
