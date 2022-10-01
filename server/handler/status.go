package handler

import (
	"net/http"

	"github.com/labstack/echo"
)

func (h *Handler) GetStatus(c echo.Context) error {
	return c.String(http.StatusOK, "Running")
}
