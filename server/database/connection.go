package database

import (
	"fmt"
	"os"
	"strconv"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DbUseLocal, _ = strconv.ParseBool(os.Getenv("SERVER_DB_LOCAL"))
var DbUser = os.Getenv("SERVER_DBUSER")
var DbPassword = os.Getenv("SERVER_DBPASS")
var DbPath = os.Getenv("SERVER_DBPATH")

func Connect(dbName string) (*gorm.DB, error) {
	if DbUseLocal {
		return gorm.Open(sqlite.Open("local.db"))
	} else {
		dsn := fmt.Sprintf(
			"%s:%s@tcp(%s/%s?charset=utf8mb4&parseTime=True&loc=Local",
			DbUser, DbPassword, DbPath, dbName,
		)
		return gorm.Open(mysql.Open(dsn), &gorm.Config{})
	}
}
