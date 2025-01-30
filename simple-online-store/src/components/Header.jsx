import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
            Simple Online Store
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/products">
          Products
        </Button>
        {isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/cart">
              Cart
            </Button>
            <Button color="inherit" component={Link} to="/orders">
              Orders
            </Button>
          </>
        )}
        {isAuthenticated ? (
          <Button color="inherit" onClick={logout}>
            Logout ({user?.email})
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
