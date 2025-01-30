import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Rating } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProductDetails from "../components/ProductDetails";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../context/AuthContext";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { token, user } = useAuth();
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchProduct(id);
    fetchReviews(id);
    // We only want this to run when 'id' changes, ignoring lint about missing dependencies:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const resp = await api.get(`/products/${productId}/reviews`);
      setReviews(resp.data); // array of reviews
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSaved = async () => {
    setEditingReview(null);
    await fetchReviews(id);
  };

  const handleReviewDeleted = async (reviewId) => {
    try {
      await api.delete(`/products/${id}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (!product) {
    return <Typography sx={{ mt: 4, ml: 2 }}>Loading...</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      {/* Basic product info & add-to-cart functionality */}
      <ProductDetails product={product} />

      {/* Reviews Section */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Reviews
      </Typography>

      {token ? (
        <>
          {editingReview ? (
            <ReviewForm
              productId={id}
              existingReview={editingReview}
              onReviewSaved={handleReviewSaved}
            />
          ) : (
            <ReviewForm productId={id} onReviewSaved={handleReviewSaved} />
          )}
        </>
      ) : (
        <Typography variant="body2">Login to write a review.</Typography>
      )}

      {/* List of existing reviews */}
      <div style={{ marginTop: "20px" }}>
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {/* Display the star rating */}
            <Rating value={r.rating} readOnly />

            {/* Display the review comment */}
            <Typography variant="body1" sx={{ mt: 1 }}>
              {r.comment}
            </Typography>

            {/* Display the user email */}
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              by {r.User?.email || "Unknown User"}
            </Typography>

            {/* Edit/Delete buttons for the review owner or admin */}
            {(user?.id === r.userId || user?.role === "admin") && (
              <div>
                <Button
                  size="small"
                  sx={{ mr: 1, mt: 1 }}
                  onClick={() => setEditingReview(r)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => handleReviewDeleted(r.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}

export default ProductDetailsPage;
