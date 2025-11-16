import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spinner, Alert, Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaTrash } from "react-icons/fa";

import { adminGetUsers, adminDeleteUser } from "../../actions/userAction"; 
import { clearError, clearUserDeleted } from "../../slices/userSlice"; 
import Sidebar from "./Sidebar";

const UsersList = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error, isUserDeleted } = useSelector(state => state.userState);

  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (e, id) => {
    e.target.disabled = true;
    dispatch(adminDeleteUser(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isUserDeleted) {
      toast.success("User deleted successfully!", {
        position: "top-right",
        onOpen: () => dispatch(clearUserDeleted()),
      });
    }

    dispatch(adminGetUsers); 
  }, [dispatch, error, isUserDeleted]);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.firstname && user.firstname.toLowerCase().includes(term)) ||
      (user.lastname && user.lastname.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.role && user.role.toLowerCase().includes(term))
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
              <h2>All Users</h2>
            </Col>
            <Col md="6" className="d-flex justify-content-end gap-2">
              <Form.Control
                type="text"
                placeholder="Search by Name, Email, or Role..."
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
          ) : filteredUsers.length === 0 ? (
            <Alert variant="info">No matching users found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle text-center">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td> {/* Sequential ID */}
                      <td>{user.firstname} {user.lastname}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge px-2 py-1 ${
                            user.role === "admin"
                              ? "bg-danger"
                              : user.role === "user"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/user/${user._id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                          title="View User"
                        >
                          <FaEye />
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => handleDelete(e, user._id)}
                          title="Delete User"
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

export default UsersList;
