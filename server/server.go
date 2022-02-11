package main

import (
	"casual-nocode-service/database"
	"casual-nocode-service/models"
	"net/http"

	"github.com/labstack/echo"
)

func main() {
	// DB 接続
	db, err := database.Connect("User")
	if err != nil {
		panic("failed to connect database")
	}

	// DB マイグレーション
	db.AutoMigrate(&models.User{})

	// ルーティング
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":1323"))
}
