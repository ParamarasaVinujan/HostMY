import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Modal,
  Form,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../Navbar/Loader";
import {
  authClearError,
  updateUserPassword,
  updateUserProfile,
} from "../../actions/userAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearUpdatedError } from "../../slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isUpdated, error, isPasswordUpdated } = useSelector(
    (state) => state.authState
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (isUpdated) {
      toast.success("Profile updated successfully!", {
        position: "top-right",
        onOpen: () => dispatch(clearUpdatedError()),
      });
      handleClose();
    }

    if (error) {
      toast.error(error, {
        position: "top-right",
        onOpen: () => dispatch(authClearError),
      });
    }

    if (isPasswordUpdated) {
      toast.success("Password updated successfully!", {
        position: "top-right",
      });
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    }
  }, [isUpdated, error, isPasswordUpdated, dispatch]);

  const handleChange = (e) => {
    const inputName = e.target.name;

    if (inputName === "avatar") {
      const file = e.target.files[0];
      if (file) {
        setAvatarFile(file);
        setFormData((prevData) => ({
          ...prevData,
          avatar: URL.createObjectURL(file),
        }));
      }
    } else {
      const value = e.target.value;
      setFormData((prevData) => ({
        ...prevData,
        [inputName]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("firstname", formData.firstname);
    formDataToSend.append("lastname", formData.lastname);
    formDataToSend.append("email", formData.email);
    if (avatarFile) {
      formDataToSend.append("avatar", avatarFile);
    }
    dispatch(updateUserProfile(formDataToSend));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right" });
      return;
    }
    dispatch(updateUserPassword({ oldPassword, password }));
  };

  if (!user) {
    return (
      <Container className="p-5 text-center">
        <Loader />
      </Container>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <h4 className="mb-4">My Profile</h4>
            <Row className="mb-3">
              <Col md={4} className="fw-semibold">
                Full Name
              </Col>
              <Col md={8}>
                {user.firstname} {user.lastname}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4} className="fw-semibold">
                Email Address
              </Col>
              <Col md={8}>{user.email || "Not provided"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={4} className="fw-semibold">
                Mobile
              </Col>
              <Col md={8}>{user.phone || "Not provided"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={4} className="fw-semibold">
                Address
              </Col>
              <Col md={8}>{user.address || "Not provided"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={4} className="fw-semibold">
                Created At
              </Col>
              <Col md={8}>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </Col>
            </Row>
            <div className="d-flex gap-3 mt-3">
              <Button variant="primary" onClick={handleShow}>
                Edit Profile
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
          </>
        );
      case "returns":
        return (
          <>
            <h4 className="mb-4">My Returns</h4>
            <p>You have no returns at the moment.</p>
          </>
        );
      case "cancellations":
        return (
          <>
            <h4 className="mb-4">My Cancellations</h4>
            <p>You have no cancellations.</p>
          </>
        );
      case "reviews":
        return (
          <>
            <h4 className="mb-4">My Reviews</h4>
            <p>You haven't reviewed any products yet.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}
    >
      {/* Back Button */}
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      <Row>
        <Col
          md={3}
          className="bg-white p-4 shadow-sm d-flex flex-column align-items-center"
        >
          <Image
            src={user.avatar || "https://via.placeholder.com/120"}
            roundedCircle
            width={150}
            height={150}
            alt="User Profile"
            className="mb-3"
            style={{ objectFit: "cover" }}
          />
          <h6 className="text-muted mb-4">Hello, {user.email}</h6>

          <div className="w-100">
            <div className="mb-4">
              <strong>Manage My Account</strong>
              <ul className="list-unstyled mt-2">
                <li>
                  <button
                    className={`btn btn-link text-decoration-none p-0 w-100 text-start ${
                      activeTab === "profile" ? "text-info fw-bold" : "text-dark"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    My Profile
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </Col>

        <Col md={9} className="bg-white p-4 shadow-sm">
          {renderContent()}
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="avatar">
              <Form.Label className="d-block">Avatar Image</Form.Label>
              <div className="position-relative d-inline-block">
                <Image
                  src={formData.avatar || "https://via.placeholder.com/150"}
                  alt="Avatar Preview"
                  roundedCircle
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "2px solid #ced4da",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => document.getElementById("avatarInput").click()}
                />
                <div
                  className="position-absolute top-100 start-50 translate-middle-x mt-1 text-center"
                  style={{
                    fontSize: "0.85rem",
                    color: "#0d6efd",
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("avatarInput").click()}
                >
                  Change Avatar
                </div>
              </div>
              <Form.Control
                type="file"
                name="avatar"
                accept="image/*"
                id="avatarInput"
                onChange={handleChange}
                className="d-none"
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
