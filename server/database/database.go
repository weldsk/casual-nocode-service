package database

import (
	"casual-nocode-service/models"
	"database/sql"

	"gorm.io/gorm"
)

type ConnectionType int

const (
	MySql ConnectionType = iota
	Local
	Memory
)

type Database struct {
	Users *gorm.DB
}

type DatabaseConfig struct {
	Connection ConnectionType
	Path       string
	User       string
	Password   string
}

// DB マイグレーション
func (d *Database) AutoMigrate() {
	// Userテーブル
	d.Users.AutoMigrate(&models.User{})
}

func CreateMemory() Database {
	return Open(DatabaseConfig{Connection: Memory})
}

// DB接続初期化
func Open(config DatabaseConfig) Database {
	var err error
	db := Database{}

	// Userテーブル
	db.Users, err = connect("users", config)
	if err != nil {
		panic("failed to connect database")
	}

	// オートマイグレーション
	db.AutoMigrate()
	return db
}

// DBのクローズ
func (d *Database) Close() {
	var db *sql.DB
	var err error
	db, err = d.Users.DB()

	if err != nil {
		db.Close()
	}
}
