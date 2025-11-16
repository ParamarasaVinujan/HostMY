import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/userAction";
import { Dropdown, Image } from "react-bootstrap";
import { FiShoppingCart, FiPackage, FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdRateReview, MdSupportAgent } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaMicrophone, FaCamera } from "react-icons/fa";
import logo from "../../image/logo.avif";
import Search from "./Search";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const { items } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = items.length;
  const [listening, setListening] = useState(false);

  // ✅ Logout
  const handleLogout = () => {
    dispatch(logoutUser);
  };

  // 🎤 Voice Search
  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support voice search.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      navigate(`/search?keyword=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (err) => {
      console.error(err);
      setListening(false);
    };
  };

  // 🖼️ Image Search
  const handleImageSearch = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("/api/search/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/search", { state: { imageResults: data.products } });
    } catch (error) {
      console.error("Image search failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 🔶 Top Colored Bar */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-orange-500 to-yellow-400"></div>

      {/* 🧭 Main Navbar */}
      <nav className="bg-blue px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* 🖼️ Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover shadow-sm"
            />
            <span className="text-xl font-extrabold text-emerald-600 hover:bg-emerald-50 hover:text-orange-500 transition transform hover:scale-110 shadow-md">
              MangalaShow
            </span>
          </Link>

          {/* 🔍 Search + Tools */}
          <div className="flex flex-1 items-center gap-4 min-w-[200px] max-w-2xl">
            <div className="flex-1">
              <Search />
            </div>

             {/* 🎤 Voice Search Button */}
            <button
              onClick={handleVoiceSearch}
              title="Voice Search"
              className={`p-[2px] rounded-full bg-gradient-to-r from-emerald-500 via-orange-500 to-yellow-400 shadow-md transition `}
            >
              <div
                className={`flex items-center justify-center p-2 rounded-full ${
                  listening
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-orange-500 transition transform hover:scale-110 shadow-md"
                }`}
              >
                <FaMicrophone size={18} />
              </div>
            </button>

            {/* 🖼️ Image Search Button */}
            <label
              htmlFor="imageSearch"
              title="Image Search"
              className="p-[2px] rounded-full bg-gradient-to-r from-emerald-500 via-orange-500 to-yellow-400 cursor-pointer shadow-md "
            >
              <div className="flex items-center justify-center p-2 rounded-full bg-white text-gray-700 hover:bg-emerald-50 hover:text-orange-500 transition transform hover:scale-110 shadow-md">
                <FaCamera size={18} />
                <input
                  type="file"
                  id="imageSearch"
                  accept="image/*"
                  onChange={handleImageSearch}
                  className="hidden"
                />
              </div>
            </label>

           {/* 🛒 Cart — Unique Gradient Heartbeat Style */}

  
  <Link
    to="/cart"
    className="relative flex items-center justify-center p-3 bg-white rounded-full text-emerald-600 hover:text-orange-500 transition transform hover:scale-110"
  >
    <FiShoppingCart size={22} className="drop-shadow-sm" />
    
    {cartCount > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
        {cartCount}
      </span>
    )}
  </Link>


          </div>

          {/* 👤 User Section */}
          {isAuthenticated ? (
            <Dropdown className="d-inline">
              <Dropdown.Toggle
                as="div"
                id="dropdown-basic"
                className="flex items-center gap-2 cursor-pointer"
              >
                
                
<div className="p-[2px] rounded-full bg-gradient-to-r from-emerald-500 via-orange-500 to-yellow-400">
  <Image
    src={user.avatar ?? "/images/default_avatar.png"}
    alt="User Avatar"
    width={40}
    height={40}
    className="rounded-full object-cover bg-white"
  />
</div>

                
                <span className="font-medium text-sm text-gray-800">
                  {user.firstname}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="mt-2 rounded shadow min-w-[250px]">
                {user.role === "admin" ? (
                  <>
                    <Dropdown.Item
                      onClick={() => navigate("/admin/dashboard")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <CgProfile size={18} /> Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate("/myprofile")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <CgProfile size={18} /> Manage My Account
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-danger d-flex align-items-center gap-2"
                    >
                      <FiLogOut size={18} /> Logout
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item
                      onClick={() => navigate("/myprofile")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <CgProfile size={18} /> Manage My Account
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate("/orders")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <FiPackage size={18} /> My Orders
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate("/wishlist")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <AiOutlineHeart size={18} /> My Wishlist
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate("/reviews")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <MdRateReview size={18} /> My Reviews
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate("/returns")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <BiArrowBack size={18} /> My Returns & Cancellations
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate("/help-support")}
                      className="text-dark d-flex align-items-center gap-2"
                    >
                      <MdSupportAgent size={18} /> Help & Support
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-danger d-flex align-items-center gap-2"
                    >
                      <FiLogOut size={18} /> Logout
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-3">
  {/* 🌈 Login Button */}
  <Link
    to="/login"
    className="relative overflow-hidden bg-emerald-500 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 hover:text-white hover:shadow-[0_0_20px_rgba(255,165,0,0.5)]"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
    <span className="relative z-10">Login</span>
  </Link>

  {/* 🌈 Help & Support Button */}
  <Link
    to="/help-support"
    className="relative flex items-center gap-2 overflow-hidden bg-gray-700 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 hover:text-white hover:shadow-[0_0_20px_rgba(255,165,0,0.5)]"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
    <span className="relative z-10 flex items-center gap-2">
      <MdSupportAgent size={18} />
      Help & Support
    </span>
  </Link>
</div>

          )}
        </div>
      </nav>
    </header>
  );
}
