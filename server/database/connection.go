package database

import (
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Connect(dbName string) (*gorm.DB, error) {
	dbUser := os.Getenv("SERVER_USER")
	dbPassword := os.Getenv("SERVER_PASS")
	dbPath := os.Getenv("SERVER_DBPATH")
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbPath, dbName,
	)

	return gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
