import React, { useState } from "react";
import { Box, TextField, Button, Rating } from "@mui/material";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ReviewForm({ productId, existingReview, onReviewSaved }) {
  const { token } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingReview) {
        await api.put(
          `/products/${productId}/reviews/${existingReview.id}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post(
          `/products/${productId}/reviews`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (onReviewSaved) onReviewSaved();
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
    >
      <Rating
        name="rating"
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
        required
      />
      <TextField
        label="Comment"
        multiline
        minRows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <Button variant="contained" type="submit">
        {existingReview ? "Update Review" : "Submit Review"}
      </Button>
    </Box>
  );
}

export default ReviewForm;
