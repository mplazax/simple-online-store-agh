import React from "react";
import { Container, Typography } from "@mui/material";

function HomePage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to Simple Online Store
      </Typography>
      <Typography variant="body1" align="center">
        Discover amazing products at great prices.
      </Typography>
    </Container>
  );
}

export default HomePage;
