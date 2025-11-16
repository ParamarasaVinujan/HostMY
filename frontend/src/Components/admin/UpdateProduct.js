import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleProduct, updateProducts } from "../../actions/productAction";
import { toast } from "react-toastify";
import { clearError } from "../../slices/productsSlice";
import { clearProductUpdated } from "../../slices/productSlice";
import Sidebar from "./Sidebar"; // 👈 make sure this is correctly imported

function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { id: productId } = useParams();
  const { loading, isProductUpdated, error, product = {} } = useSelector((state) => state.productState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = [
    "Electronics",
    "Accessories",
    "Headphones",
    "Clothes",
    "Outdoor",
    "Home",
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const clearImagesHandler = () => {
    setImages([]);
    setImagePreviews([]);
    setImagesCleared(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("imagesCleared", imagesCleared);
    images.forEach((image) => formData.append("images", image));

    dispatch(updateProducts(productId, formData));
  };

  useEffect(() => {
    if (isProductUpdated) {
      toast("Product updated successfully!", {
        position: "top-right",
        type: "success",
        onOpen: () => dispatch(clearProductUpdated()),
      });
      setImages([]);
      navigate("/admin/products");
    }

    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
    }

    dispatch(getSingleProduct(productId));
  }, [dispatch, isProductUpdated, error, productId,navigate]);

  useEffect(() => {
    if (product._id) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setCategory(product.category);

      const existingImages = product.images?.map((img) => img.image) || [];
      setImagePreviews(existingImages);
    }
  }, [product]);

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
              <h2 className="mb-4 text-center">Update Product</h2>
              <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Price (Rs)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a detailed description..."
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Enter available stock"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Product Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  {imagePreviews.length > 0 && (
                    <>
                      <span
                        className="d-inline-block mt-2 text-danger"
                        onClick={clearImagesHandler}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa fa-trash"></i> Clear Images
                      </span>
                      <div className="mt-3 d-flex flex-wrap gap-3">
                        {imagePreviews.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #ddd",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
