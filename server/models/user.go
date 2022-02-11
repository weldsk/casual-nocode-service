package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name       string
	EMail      string
	HashedPass string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
