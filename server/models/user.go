package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name           string `json:"name"`
	Email          string `json:"email"`
	PasswordHashed []byte
}

func (u *User) Login(password string) bool {
	err := bcrypt.CompareHashAndPassword(u.PasswordHashed, []byte(password))
	return err == nil
}

func (u *User) SetPassword(password string) error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 10)

	if err == nil {
		u.PasswordHashed = hashed
	}
	return err
}
