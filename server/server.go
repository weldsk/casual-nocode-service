package main

import (
	"casual-nocode-service/database"
	"casual-nocode-service/handler"
	"casual-nocode-service/router"
	"os"
	"strconv"
)

func main() {
	dbUseLocal, _ := strconv.ParseBool(os.Getenv("SERVER_DB_LOCAL"))
	dbUser := os.Getenv("SERVER_DBUSER")
	dbPassword := os.Getenv("SERVER_DBPASS")
	dbPath := os.Getenv("SERVER_DBPATH")
	storagePath := os.Getenv("SERVER_STORAGEPATH")

	dbConfig := database.DatabaseConfig{
		Connection: database.MySql,
		User:       dbUser,
		Password:   dbPassword,
		Path:       dbPath,
	}

	if dbUseLocal {
		dbConfig.Connection = database.Local
	}

	// DB設定
	db := database.Open(dbConfig)
	defer db.Close()

	h := handler.Handler{DB: db, StoragePath: storagePath}

	// ルーティング
	router.Init(h)
}
