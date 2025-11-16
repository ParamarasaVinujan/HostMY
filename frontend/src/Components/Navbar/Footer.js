// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* 🏢 Company Info */}
        <div>
          <h2 className="text-white text-lg font-bold mb-4">MangalaShowRoom</h2>
          <p className="text-gray-400">
            Your one-stop shop for electronics, fashion, home essentials, and more.
            Quality products at great prices.
          </p>
        </div>

        {/* ⚡ Quick Links */}
        <div>
          <h3 className="text-white text-md font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-orange-400 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-orange-400 transition">Products</Link></li>
            <li><Link to="/offers" className="hover:text-orange-400 transition">Offers</Link></li>
            <li><Link to="/help-support" className="hover:text-orange-400 transition">Contact Us</Link></li>
            <li><Link to="/help-support" className="hover:text-orange-400 transition">About Us</Link></li>
          </ul>
        </div>

        {/* 💬 Support */}
        <div>
          <h3 className="text-white text-md font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-orange-400 transition">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-orange-400 transition">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-orange-400 transition">Returns</Link></li>
            <li><Link to="/privacy" className="hover:text-orange-400 transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* ✉️ Newsletter & Social */}
        <div>
          <h3 className="text-white text-md font-semibold mb-4">Subscribe</h3>
          <p className="text-gray-400 mb-4">
            Get updates about latest offers and products.
          </p>

          {/* Subscribe Input */}
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l bg-gray-800 text-gray-200 border-none focus:outline-none w-full"
            />
            <button
              onClick={() => alert("🎉 Subscribed successfully!")}
              className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-400 hover:opacity-90 text-white px-4 rounded-r transition font-semibold"
            >
              Subscribe
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-5 mt-6 text-lg">
            <a
              href="https://www.facebook.com/share/19tjP7XaPt/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 hover:scale-110 hover:shadow-[0_0_10px_rgba(59,130,246,0.6)] transition duration-300"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 hover:scale-110 hover:shadow-[0_0_10px_rgba(236,72,153,0.6)] transition duration-300"
            >
              <FaInstagram />
            </a>

            <a
              href="https://twitter.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 hover:scale-110 hover:shadow-[0_0_10px_rgba(56,189,248,0.6)] transition duration-300"
            >
              <FaTwitter />
            </a>

            <a
              href="https://linkedin.com/company/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 hover:scale-110 hover:shadow-[0_0_10px_rgba(59,130,246,0.6)] transition duration-300"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-gradient bg-gradient-to-r from-emerald-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent font-semibold">
          MangalaShowRoom
        </span>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
