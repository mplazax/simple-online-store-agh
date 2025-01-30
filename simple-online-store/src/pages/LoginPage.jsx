import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login, registerUser } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (isRegister) {
        await registerUser(email, password);
        setSuccessMsg("Registration successful! You can now log in.");
        setIsRegister(false);
      } else {
        await login(email, password);
        navigate("/products");
      }
    } catch (error) {
      // Extract error message from backend response
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    }
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "sm" }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isRegister ? "Register" : "Login"}
        </Typography>
      </Box>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Email"
        type="email"
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        {isRegister ? "Register" : "Login"}
      </Button>
      <Button
        sx={{ mt: 2 }}
        fullWidth
        onClick={() => {
          setIsRegister(!isRegister);
          setErrorMsg("");
          setSuccessMsg("");
        }}
      >
        {isRegister ? "Have an account? Login" : "No account? Register"}
      </Button>
    </Container>
  );
}

export default LoginPage;
