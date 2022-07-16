package database

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// DB 接続
func connect(name string, config DatabaseConfig) (*gorm.DB, error) {
	switch config.Connection {
	case Local:
		return gorm.Open(sqlite.Open(name + ".db"))
	case Memory:
		return gorm.Open(sqlite.Open("file::memory:?cache=shared"))
	}
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.User, config.Password, config.Path, name,
	)
	return gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
