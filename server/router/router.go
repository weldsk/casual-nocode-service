package router

import (
	"casual-nocode-service/controller"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func Init() {
	e := echo.New()
	e.Use(middleware.CORS())

	e.GET("/", controller.GetStatus)
	e.POST("/login", controller.LoginUser)
	e.POST("/signup", controller.SignUpUser)
	e.GET("/status", controller.GetStatus)

	e.Logger.Fatal(e.Start(":1323"))
}
