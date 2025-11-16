import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar"; 
import { adminGetUser, adminUpdateUser } from "../../actions/userAction";
import { clearError, clearUserUpdated } from "../../slices/userSlice";

function UpdateUser() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { id: userId } = useParams();

  const { loading, isUserUpdated, error, user } = useSelector((state) => state.userState);
  const {  user:authuser } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("role", role);

    dispatch(adminUpdateUser(userId, formData));
  };

  useEffect(() => {
    if (isUserUpdated) {
      toast.success("User updated successfully!", {
        position: "top-right",
        onOpen: () => dispatch(clearUserUpdated()),
      });
      navigate("/admin/users"); // Redirect after update, optional
      return;
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }

    dispatch(adminGetUser(userId));
  }, [dispatch, isUserUpdated, error, userId, navigate]);

  useEffect(() => {
    if (user && user._id === userId) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }
  }, [user, userId]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 col-12 p-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="col-md-10 col-12 p-4">
          <div className="card shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Update User</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="firstname" className="form-label fw-semibold">
                    First Name
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    className="form-control"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="lastname" className="form-label fw-semibold">
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    className="form-control"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label fw-semibold">
                    Role
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    disabled={user._id === authuser._id}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                >
                  {loading ? "Updating..." : "Update User"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
