package controller

import (
	"net/http"

	"github.com/labstack/echo"
)

func GetStatus(c echo.Context) error {
	return c.String(http.StatusOK, "Running")
}
