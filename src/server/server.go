package main

import (
    nethttp

    github.comlabstackecho
)

func main() {
    e = echo.New()
    e.GET(, func(c echo.Context) error {
        return c.String(http.StatusOK, Hello, World!)
    })
    e.Logger.Fatal(e.Start(1323))
}