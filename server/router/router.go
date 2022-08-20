package router

import (
	"casual-nocode-service/handler"
	"casual-nocode-service/token"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func Init(handler handler.Handler) *echo.Echo {
	e := echo.New()
	e.Use(middleware.CORS())

	// public
	e.GET("/", handler.GetStatus)
	e.POST("/login", handler.LoginUser)
	e.POST("/signup", handler.SignUpUser)
	e.GET("/status", handler.GetStatus)

	// JWT認証必要
	r := e.Group("/restricted")
	r.Use(middleware.JWTWithConfig(token.GetJwtConfig()))
	r.GET("/status", handler.GetStatus)
	r.GET("/userinfo", handler.GetUserInfo)
	r.GET("/seticon", handler.SetIcon)
	r.GET("/geticon", handler.GetIcon)

	e.Logger.Fatal(e.Start(":1323"))

	return e
}
