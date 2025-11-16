import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Spinner,
  Alert,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import {
  adminGetAllReviews,
  adminDeleteReview,
} from "../../actions/productAction";
import {
  clearError,
  clearReviewDeleted,
} from "../../slices/productSlice";

// ⭐ Helper: render horizontal stars (left to right)
const renderStars = (rating) => {
  const stars = [];
  const rounded = Math.floor(rating);
  const hasHalf = rating - rounded >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) stars.push(<IoStar key={i} />);
    else if (i === rounded + 1 && hasHalf) stars.push(<IoStarHalf key={i} />);
    else stars.push(<IoStarOutline key={i} />);
  }

  return (
    <div
      style={{
        color: "#ffc107",
        fontSize: "1.5rem",
        display: "flex",
        gap: "2px",
        justifyContent: "center",
      }}
    >
      {stars}
    </div>
  );
};

const ReviewLists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const { reviews = [], loading, error, isReviewDeleted } = useSelector(
    (state) => state.productState
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("highest");

  const handleDelete = (e, reviewId) => {
    e.target.disabled = true;
    dispatch(adminDeleteReview(productId, reviewId));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isReviewDeleted) {
      toast.success("Review deleted successfully!", {
        position: "top-right",
        onOpen: () => dispatch(clearReviewDeleted()),
      });
    }

    if (productId.length === 24) {
      dispatch(adminGetAllReviews(productId));
    }
  }, [dispatch, error, isReviewDeleted, productId]);

  // 🔃 Filter + Sort
  const filteredReviews = [...reviews]
    .filter((review) => {
      const term = searchTerm.toLowerCase();
      return (
        review._id.toLowerCase().includes(term) ||
        review.name?.toLowerCase().includes(term) ||
        review.comment?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 col-12 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-10 col-12 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Product Reviews</h2>
            <Button variant="secondary" onClick={() => navigate("/admin/products")}>
              <FaArrowLeft className="me-1" /> Back to Products
            </Button>
          </div>

          {reviews.length > 0 && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search by review ID, name, comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="highest">Sort by: Highest Rating</option>
                  <option value="lowest">Sort by: Lowest Rating</option>
                </Form.Select>
              </Col>
            </Row>
          )}

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <Alert variant="info">No reviews found for this product.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Review ID</th>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review._id}>
                      <td>{review._id}</td>
                      <td>{review.user?.lastname || "Unknown"}</td>
                      <td>{renderStars(review.rating)}</td>
                      <td>{review.comment}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={loading}
                          onClick={(e) => handleDelete(e, review._id)}
                          title="Delete Review"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewLists;
