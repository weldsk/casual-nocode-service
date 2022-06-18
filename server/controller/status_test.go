package controller

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

func TestGetStatus(t *testing.T) {
	e := echo.New()

	req := httptest.NewRequest("GET", "/status", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, GetStatus(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "Running", rec.Body.String())
	}
}
