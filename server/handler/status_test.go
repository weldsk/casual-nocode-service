package handler

import (
	"casual-nocode-service/database"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

func TestGetStatus(t *testing.T) {
	e := echo.New()
	db := database.CreateMemory()
	defer db.Close()
	h := Handler{db}

	req := httptest.NewRequest(http.MethodGet, "/status", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.GetStatus(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "Running", rec.Body.String())
	}
}
