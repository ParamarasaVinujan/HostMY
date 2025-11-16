import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Navbar/Loader";
import { toast } from "react-toastify";
import { getProducts } from "../../actions/productAction";
import {
  getWishlist,
  removeFromWishlist,
  addToWishlist,
} from "../../actions/wishlistActions";
import "./ProductSearch.css";

const ProductSearch = () => {
  const { keyword = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [rating, setRating] = useState(0);

  const { products = [], loading, error } = useSelector(
    (state) => state.productsState
  );
  const { wishlist = [] } = useSelector((state) => state.wishlistState);

  // ✅ Load products and wishlist
  useEffect(() => {
    if (error) toast.error(error);
    dispatch(getProducts(keyword, { category, priceRange, rating }));
    dispatch(getWishlist());
  }, [dispatch, error, keyword, category, priceRange, rating]);

  // ✅ Helper: check if a product is in wishlist
  const isInWishlist = (productId) =>
    wishlist.some((item) => (item.product?._id || item._id) === productId);

  // ✅ Toggle wishlist
  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    const inWishlist = isInWishlist(product._id);
    if (inWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info("Removed from wishlist 💔", { position: "top-right" });
    } else {
      dispatch(addToWishlist(product._id));
      toast.success("Added to wishlist ❤️", { position: "top-right" });
    }
  };

  const goToProduct = (product) => navigate(`/product/${product._id}`);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="product-search-page">
          <Row>
            {/* Sidebar Filters */}
            <Col lg={3} className="filters-sidebar">
              <Card className="filter-card">
                <h5 className="filter-title">Filter Products</h5>

                {/* Category */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="custom-select"
                  >
                    <option value="">All</option>
                    <option value="wax">Electronics</option>
                    <option value="shampoo">Accessories</option>
                    <option value="conditioner">Home</option>
                  </Form.Select>
                </Form.Group>

                {/* Price Range */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Price Range (Rs.)
                  </Form.Label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="price-slider"
                  />
                  <div className="d-flex justify-content-between text-muted small">
                    <span>0</span>
                    <span>{priceRange[1]}</span>
                  </div>
                </Form.Group>

                {/* Rating */}
                <Form.Group>
                  <Form.Label className="fw-semibold mb-2">
                    Customer Rating
                  </Form.Label>
                  <div className="rating-filter-horizontal d-flex flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((r) => (
                      <div
                        key={r}
                        onClick={() => setRating(r)}
                        className={`rating-item-horizontal ${
                          rating === r ? "selected" : ""
                        } d-flex align-items-center px-2 py-1 border rounded-3`}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <IoStar
                            key={i}
                            size={18}
                            className={i < r ? "text-warning" : "text-muted-light"}
                          />
                        ))}
                        <span className="ms-1 small text-secondary">({r}+)</span>
                      </div>
                    ))}
                  </div>
                  {rating !== 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-warning mt-2 p-0"
                      onClick={() => setRating(0)}
                    >
                      Clear Rating Filter
                    </Button>
                  )}
                </Form.Group>
              </Card>
            </Col>

            {/* Product Grid */}
            <Col lg={9}>
              {products.length === 0 ? (
                <div className="no-products">No products found 😕</div>
              ) : (
                <Row className="g-4">
                  {products.map((product) => {
                    const inWishlist = isInWishlist(product._id);
                    return (
                      <Col md={6} lg={4} key={product._id}>
                        <Card
                          className="product-card position-relative"
                          onClick={() => goToProduct(product)}
                        >
                          {/* ❤️ Wishlist Icon */}
                          <div
                            className="wishlist-icon position-absolute top-0 end-0 p-2"
                            onClick={(e) => toggleWishlist(e, product)}
                            style={{ zIndex: 5, cursor: "pointer" }}
                          >
                            {inWishlist ? (
                              <AiFillHeart className="text-danger fs-4" />
                            ) : (
                              <AiOutlineHeart className="text-muted fs-4" />
                            )}
                          </div>

                          {/* Product Image */}
                          <Card.Img
                            src={
                              product.images?.[0]?.url ||
                              product.images?.[0]?.image ||
                              "/default.jpg"
                            }
                            className="product-img"
                          />

                          <Card.Body>
                            <Card.Title className="product-title">
                              {product.name}
                            </Card.Title>
                            <Card.Text className="product-price">
                              Rs. {product.price.toLocaleString()}
                            </Card.Text>

                            {/* ⭐ Ratings */}
                            <div className="rating-display">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const full = i < Math.floor(product.ratings);
                                const half =
                                  i === Math.floor(product.ratings) &&
                                  product.ratings % 1 >= 0.5;
                                return full ? (
                                  <IoStar key={i} className="text-warning" />
                                ) : half ? (
                                  <IoStarHalf key={i} className="text-warning" />
                                ) : (
                                  <IoStarOutline
                                    key={i}
                                    className="text-muted-light"
                                  />
                                );
                              })}
                              <span className="review-count">
                                ({product.numOfReviews})
                              </span>
                            </div>

                            <Button
                              variant="dark"
                              className="buy-btn mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToProduct(product);
                              }}
                            >
                              View Details
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Fragment>
  );
};

export default ProductSearch;
