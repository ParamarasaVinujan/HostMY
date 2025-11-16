import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spinner, Alert, Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaTrash } from "react-icons/fa";
import { adminGetOrders, adminDeleteOrders } from "../../actions/orderAction";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";
import Sidebar from "./Sidebar";

const Orders = () => {
  const dispatch = useDispatch();
  const { adminOrders = [], loading, error, isOrderDeleted } = useSelector(
    (state) => state.orderState
  );

  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (e, id) => {
    e.target.disabled = true;
    dispatch(adminDeleteOrders(id));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "top-right",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isOrderDeleted) {
      toast("Order deleted successfully!", {
        position: "top-right",
        type: "success",
        onOpen: () => dispatch(clearOrderDeleted()),
      });
    }

    dispatch(adminGetOrders);
  }, [dispatch, error, isOrderDeleted]);

  const filteredOrders = adminOrders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      String(order.totalPrice).includes(term) ||
      order.orderStatus.toLowerCase().includes(term)
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
              <h2>All Orders</h2>
            </Col>
            <Col md="6" className="d-flex justify-content-end gap-2">
              <Form.Control
                type="text"
                placeholder="Search by Status or Amount..."
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
          ) : filteredOrders.length === 0 ? (
            <Alert variant="info">No matching orders found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th> {/* Sequential ID */}
                    <th>Image</th> {/* Order Image */}
                    <th>No. of Items</th>
                    <th>Total Amount (Rs)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td> {/* Incremental ID */}
                      <td>
                        {order.orderItems[0]?.image ? (
                          <img
                            src={order.orderItems[0].image}
                            alt={order.orderItems[0].name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <img
                            src="/default-product.png"
                            alt="default"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        )}
                      </td>
                      <td>{order.orderItems.length}</td>
                      <td>{order.totalPrice.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge px-2 py-1 ${
                            order.orderStatus.toLowerCase() === "delivered"
                              ? "bg-success"
                              : order.orderStatus.toLowerCase() === "shipped"
                              ? "bg-info text-dark"
                              : order.orderStatus.toLowerCase() === "processing"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/order/${order._id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                          title="View Order"
                        >
                          <FaEye />
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => handleDelete(e, order._id)}
                          title="Delete Order"
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

export default Orders;
