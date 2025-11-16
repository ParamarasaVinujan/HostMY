import React, { useState, useRef, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineUpload, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { authClearError, registerUser } from "../../actions/userAction";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: null,
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, avatar: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("firstname", formData.firstname);
    formDataToSend.append("lastname", formData.lastname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must have uppercase, lowercase, number & special char");
      return;
    }

    dispatch(registerUser(formDataToSend));
  };

  const handleGoogleRegister = () => {
    window.open("http://localhost:8000/api/v1/user/google/register", "_self");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(authClearError()),
      });
    }
  }, [error, navigate, isAuthenticated, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              className="w-1/2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          {/* Avatar upload */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-medium">
              Upload Avatar
            </label>

            <input
              type="file"
              name="avatar"
              accept="image/*"
              id="avatar-upload"
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
            />

            {formData.avatar ? (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={URL.createObjectURL(formData.avatar)}
                  alt="avatar preview"
                  className="w-32 h-32 object-cover rounded-full border-2 border-orange-400 shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="Remove"
                  className="absolute -top-2 -right-2 bg-white border border-red-300 text-red-500 rounded-full p-1 shadow-sm hover:bg-red-50 transition"
                >
                  <AiOutlineClose size={16} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-orange-400 rounded-lg h-32 hover:bg-orange-50 transition text-orange-500"
              >
                <AiOutlineUpload size={40} />
                <span className="mt-2 text-sm">Click or drag image here</span>
                <span className="text-xs text-gray-400 mt-1">(PNG, JPG, GIF)</span>
              </label>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition font-semibold"
          >
            REGISTER
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="my-5 text-center text-gray-500 font-medium">
          Or, register with
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="flex items-center space-x-2 border px-5 py-2 rounded hover:bg-gray-100 transition"
          >
            <FcGoogle size={20} />
            <span>Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
