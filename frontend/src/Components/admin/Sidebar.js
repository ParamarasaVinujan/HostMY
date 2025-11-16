import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isDropdownActive = (paths) => paths.some((path) => location.pathname.startsWith(path));

  return (
    <div className="bg-dark text-white vh-100 p-3 sidebar shadow-sm" style={{ minWidth: "250px" }}>
      <h4 className="text-center mb-4">Admin Panel</h4>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-1">
            <Link
              to="/admin/dashboard"
              className={`text-decoration-none d-block py-2 ps-2 ${
                isActive("/admin/dashboard") ? "bg-secondary text-white" : "text-white"
              }`}
            >
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </Link>
          </li>

          {/* Products */}
          <li className="mb-1">
            <NavDropdown
              title={
                <span className={`text-white ${isDropdownActive(["/admin/products", "/admin/product/create"]) ? "bg-secondary rounded" : ""}`}>
                  <i className="fab fa-product-hunt me-2"></i> Products
                </span>
              }
              className="ps-2"
              menuVariant="dark"
              id="products-nav-dropdown"
            >
              <NavDropdown.Item
                onClick={() => navigate("/admin/products")}
                active={isActive("/admin/products")}
              >
                <i className="fas fa-clipboard-list me-2"></i> All
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => navigate("/admin/product/create")}
                active={isActive("/admin/product/create")}
              >
                <i className="fas fa-plus me-2"></i> Create
              </NavDropdown.Item>
            </NavDropdown>
          </li>

          {/* Offers */}
          <li className="mb-1">
            <NavDropdown
              title={
                <span className={`text-white ${isDropdownActive(["/admin/offers", "/admin/offer/create"]) ? "bg-secondary rounded" : ""}`}>
                  <i className="fas fa-tags me-2"></i> Offers
                </span>
              }
              className="ps-2"
              menuVariant="dark"
              id="offers-nav-dropdown"
            >
              <NavDropdown.Item
                onClick={() => navigate("/admin/offers")}
                active={isActive("/admin/offers")}
              >
                <i className="fas fa-tag me-2"></i> All Offers
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => navigate("/admin/offer/create")}
                active={isActive("/admin/offer/create")}
              >
                <i className="fas fa-plus me-2"></i> Create Offer
              </NavDropdown.Item>
            </NavDropdown>
          </li>

          {/* Orders */}
          <li className="mb-1">
            <Link
              to="/admin/orders"
              className={`text-decoration-none d-block py-2 ps-2 ${
                isActive("/admin/orders") ? "bg-secondary text-white" : "text-white"
              }`}
            >
              <i className="fas fa-shopping-basket me-2"></i> Orders
            </Link>
          </li>

          {/* Users */}
          <li className="mb-1">
            <Link
              to="/admin/users"
              className={`text-decoration-none d-block py-2 ps-2 ${
                isActive("/admin/users") ? "bg-secondary text-white" : "text-white"
              }`}
            >
              <i className="fas fa-users me-2"></i> Users
            </Link>
          </li>
    
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
