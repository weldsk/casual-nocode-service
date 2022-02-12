package router

import (
	"casual-nocode-service/controller"

	"github.com/labstack/echo"
)

func Init() {
	e := echo.New()
	e.GET("/", controller.GetStatus)
	e.POST("/login", controller.LoginUser)
	e.POST("/signup", controller.SignUpUser)
	e.GET("/status", controller.GetStatus)
	e.Logger.Fatal(e.Start(":1323"))
}
