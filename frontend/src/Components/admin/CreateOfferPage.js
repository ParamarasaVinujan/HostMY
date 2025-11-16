import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { createOffer, getAdminProducts } from "../../actions/productAction";
import { clearError, clearOfferCreated } from "../../slices/offerSlice";

const CreateOfferPage = () => {
  const dispatch = useDispatch();

  const { products = [], loading: productsLoading, error: productsError } =
    useSelector((state) => state.productsState);

  const {
    loading: offerLoading,
    isOfferCreated: offerSuccess,
    error: offerError,
  } = useSelector((state) => state.offerState);

  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const [offerData, setOfferData] = useState({
    offerType: "",
    offerPercentage: "",
    offerStartDate: "",
    offerEndDate: "",
  });

  useEffect(() => {
    dispatch(getAdminProducts);
  }, [dispatch]);

  useEffect(() => {
    if (productsError) {
      toast.error(productsError);
    }
  }, [productsError]);

  useEffect(() => {
    if (offerError) {
      toast.error(offerError);
      dispatch(clearError());
    }
    if (offerSuccess) {
      toast.success("Offer(s) created successfully!");
      setSelectedProductIds([]);
      setOfferData({
        offerType: "",
        offerPercentage: "",
        offerStartDate: "",
        offerEndDate: "",
      });
      dispatch(clearOfferCreated());
    }
  }, [offerError, offerSuccess, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProductIds.length === 0) {
      toast.warning("Please select at least one product.");
      return;
    }

    selectedProductIds.forEach((productId) => {
      dispatch(createOffer(productId, offerData));
    });
  };

  return (
    <div className="container-fluid">
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="p-4">
          <h2 className="mb-4">Create New Offer</h2>

          {(productsLoading || offerLoading) && (
            <Spinner animation="border" variant="primary" />
          )}

          {products.length === 0 && !productsLoading && (
            <Alert variant="info">No products available to create offer.</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Products</Form.Label>
              <Form.Select
                multiple
                value={selectedProductIds}
                onChange={(e) =>
                  setSelectedProductIds(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                required
              >
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text>Select one or more products</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Offer Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Festival, Clearance..."
                value={offerData.offerType}
                onChange={(e) =>
                  setOfferData({ ...offerData, offerType: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 20"
                value={offerData.offerPercentage}
                onChange={(e) =>
                  setOfferData({
                    ...offerData,
                    offerPercentage: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={offerData.offerStartDate}
                onChange={(e) =>
                  setOfferData({
                    ...offerData,
                    offerStartDate: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={offerData.offerEndDate}
                onChange={(e) =>
                  setOfferData({ ...offerData, offerEndDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={offerLoading || productsLoading}
            >
              {offerLoading ? "Creating..." : "Create Offer"}
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CreateOfferPage;
