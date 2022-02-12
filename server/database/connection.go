package database

import (
	"casual-nocode-service/models"
	"fmt"
	"os"
	"strconv"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var dbUseLocal, _ = strconv.ParseBool(os.Getenv("SERVER_DB_LOCAL"))
var dbUser = os.Getenv("SERVER_DBUSER")
var dbPassword = os.Getenv("SERVER_DBPASS")
var dbPath = os.Getenv("SERVER_DBPATH")

// DB マイグレーション
func AutoMigrate() {
	// Userテーブル
	db, err := Connect("users")
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&models.User{})
}

// DB 接続
func Connect(dbName string) (*gorm.DB, error) {
	if dbUseLocal {
		return gorm.Open(sqlite.Open("local.db"))
	} else {
		dsn := fmt.Sprintf(
			"%s:%s@tcp(%s/%s?charset=utf8mb4&parseTime=True&loc=Local",
			dbUser, dbPassword, dbPath, dbName,
		)
		return gorm.Open(mysql.Open(dsn), &gorm.Config{})
	}
}
