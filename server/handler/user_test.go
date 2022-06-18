package handler

import (
	"casual-nocode-service/database"
	"casual-nocode-service/models"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo"
	"github.com/stretchr/testify/assert"
)

func TestSignUpUser(t *testing.T) {
	e := echo.New()
	db := database.CreateMemory()
	defer db.Close()
	h := Handler{db}

	json := `{"name":"test name","email":"email@email.test","password":"password"}`
	req := httptest.NewRequest("POST", "/users", strings.NewReader(json))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if assert.NoError(t, h.SignUpUser(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		user := new(models.User)
		db.Users.First(&user)
		assert.Equal(t, user.Name, "test name")
		assert.Equal(t, user.Email, "email@email.test")
	}
}
