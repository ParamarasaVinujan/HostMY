import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spinner, Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { clearError } from "../../slices/productsSlice";
import { deleteProducts, getAdminProducts } from "../../actions/productAction";
import { clearProductDeleted } from "../../slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector((state) => state.productsState);
  const { isProductDeleted, error: productError } = useSelector((state) => state.productState);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteProducts(id));
  };

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: "top-right",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }

    if (isProductDeleted) {
      toast("Product deleted successfully!", {
        position: "top-right",
        type: "success",
        onOpen: () => dispatch(clearProductDeleted()),
      });
    }

    dispatch(getAdminProducts);
  }, [dispatch, error, productError, isProductDeleted]);

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p._id.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term) ||
      String(p.stock).includes(term) ||
      String(p.price).includes(term)
    );
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 col-12 p-0">
          <Sidebar />
        </div>

        <div className="col-md-10 col-12 p-4">
          <h1 className="my-1 text-lg text-teal-900">All Products</h1>

          <div className="row mb-3">
            <div className="col-md-8"></div>
            <div className="col-md-4">
              <Form.Control
                type="text"
                placeholder="Search by ID, Name, Stock or Price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : filteredProducts.length === 0 ? (
            <Alert variant="info">No matching products found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Price (Rs.)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod, index) => (
                    <tr key={prod._id}>
                      <td>{index + 1}</td> {/* Sequential ID */}
                      <td className="d-flex align-items-center gap-2 justify-content-start">
                        <img
                          src={prod.images?.[0]?.image || "/default-product.png"}
                          alt={prod.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <span>{prod.name}</span>
                      </td>
                      <td>{prod.stock}</td>
                      <td>{prod.price.toLocaleString()}</td>
                      <td className="d-flex flex-wrap gap-2 justify-content-center">
                        <Link
                          to={`/admin/product/${prod._id}`}
                          className="btn btn-sm btn-outline-warning"
                          title="Edit Product"
                        >
                          <FaEdit />
                        </Link>
                        <Link
                          to={`/admin/reviews/${prod._id}`}
                          className="btn btn-sm btn-outline-info"
                          title="View Reviews"
                        >
                          Reviews
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => handleDelete(e, prod._id)}
                          title="Delete Product"
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

export default Products;
