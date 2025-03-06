import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Invoices from "./Invoices";
import Products from "./Products";
import Header from "./components/Header";
//import "./index.css";

// Create a custom Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Default blue
    },
    secondary: {
      main: "#ff9800", // Orange
    },
    background: {
      default: "#f4f4f4", // Light gray background
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <div className="background">
          <Routes>
            <Route path="/" element={<h1>Welcome to Billing App</h1>} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  </StrictMode>
);
