import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { adminGetAllProducts } from "../../actions/productAction";
import { clearError } from "../../slices/offerSlice";
  
const AllOffers = () => {
  const dispatch = useDispatch();
  const { adminProducts = [], loading, error } = useSelector(
    (state) => state.offerState
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(adminGetAllProducts);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Flatten all offers from all products
  const allOffers = adminProducts.flatMap((product) =>
    (product.offers || []).map((offer) => ({
      productId: product._id,
      productName: product.name,
      image: product.images?.[0]?.image || "/default.jpg",
      offerType: offer.offerType,
      offerPercentage: offer.offerPercentage,
      offerPrice: offer.offerPrice,
      offerStartDate: offer.offerStartDate,
      offerEndDate: offer.offerEndDate,
      active: offer.active,
    }))
  );

  // Fixed: Search filtering
  const filteredOffers = allOffers.filter((offer) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const productName = offer.productName?.toLowerCase() || "";
    const offerType = offer.offerType?.toLowerCase() || "";
    const offerPercentage = String(offer.offerPercentage || "");
    const offerPrice = String(offer.offerPrice || "");
    const offerStart = new Date(offer.offerStartDate).toISOString().slice(0, 10);
    const offerEnd = new Date(offer.offerEndDate).toISOString().slice(0, 10);
    const status = offer.active ? "active" : "inactive";

    return (
      productName.includes(term) ||
      offerType.includes(term) ||
      offerPercentage.includes(term) ||
      offerPrice.includes(term) ||
      offerStart.includes(term) ||
      offerEnd.includes(term) ||
      status.includes(term)
    );
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
          <Row className="align-items-center mb-3">
            <Col>
              <h2>All Product Offers</h2>
            </Col>
            <Col md="6" className="d-flex justify-content-end gap-2">
              <Form.Control
                type="text"
                placeholder="Search by product, offer type, price, date, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button variant="secondary" onClick={() => setSearchTerm("")}>
                  Clear
                </Button>
              )}
            </Col>
          </Row>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredOffers.length === 0 ? (
            <Alert variant="info">No matching offers found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Product</th>
                    <th>Offer Type</th>
                    <th>Discount (%)</th>
                    <th>Offer Price (Rs)</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={offer.image}
                            alt={offer.productName}
                            width="50"
                            height="50"
                            className="object-fit-contain border rounded"
                          />
                          <span>{offer.productName}</span>
                        </div>
                      </td>
                      <td>{offer.offerType}</td>
                      <td>{offer.offerPercentage}%</td>
                      <td>{offer.offerPrice?.toLocaleString()}</td>
                      <td>{new Date(offer.offerStartDate).toLocaleDateString()}</td>
                      <td>{new Date(offer.offerEndDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge px-2 py-1 ${
                            offer.active ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {offer.active ? "Active" : "Inactive"}
                        </span>
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

export default AllOffers;
