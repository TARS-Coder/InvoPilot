import React, { StrictMode, useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Invoices from "./Invoices";
import Products from "./Products";
import Header from "./components/Header";
import "./styles/overrides.css"

function App() {

const [darkMode, setDarkMode]= useState(false)

function toggleTheme() {
  darkMode ? setDarkMode(false) : setDarkMode(true)
}

const theme = useMemo(() =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
  },
  }),[darkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header mode={darkMode} toggleTheme={toggleTheme}/>
        <div className="background">
          <Routes>
            <Route index path="/" element={<h1 style={ {textAlign: "center"}}>Welcome to S.B. Moters Digital Invoicing Dashboard</h1>} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App/>
      </StrictMode>
)