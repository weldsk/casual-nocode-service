package router

import (
	"casual-nocode-service/controller"
	"casual-nocode-service/token"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func Init() {
	e := echo.New()
	e.Use(middleware.CORS())

	// public
	e.GET("/", controller.GetStatus)
	e.POST("/login", controller.LoginUser)
	e.POST("/signup", controller.SignUpUser)
	e.GET("/status", controller.GetStatus)

	// JWT認証必要
	r := e.Group("/restricted")
	r.Use(middleware.JWTWithConfig(token.GetJwtConfig()))
	r.GET("/status", controller.GetStatus)
	r.GET("/userinfo", controller.GetUserInfo)

	e.Logger.Fatal(e.Start(":1323"))
}
