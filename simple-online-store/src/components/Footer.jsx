import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        p: 2,
        backgroundColor: "#f1f1f1",
      }}
    >
      <Typography variant="body2">
        &copy; 2024 Agnieszka Mirosław, Michał Plaza
      </Typography>
    </Box>
  );
}

export default Footer;
