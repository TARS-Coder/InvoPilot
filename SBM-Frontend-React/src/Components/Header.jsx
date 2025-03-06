import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} to="/invoices">
            Invoices
          </Button>
        </Box>
        <Typography variant="h6">S.B. Moters Pvt. Ltd.</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
