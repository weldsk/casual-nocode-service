package main

import (
	"casual-nocode-service/database"
	"casual-nocode-service/router"
)

func main() {
	// マイグレーション
	database.AutoMigrate()

	// ルーティング
	router.Init()
}
