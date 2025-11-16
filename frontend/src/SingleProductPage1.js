import React from "react";
import { Star, Heart, ShoppingCart, Truck, RefreshCw } from "lucide-react";

export default function SingleProductPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sticky Add to Cart (Mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between md:hidden z-50">
        <button className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-md">
          <ShoppingCart size={18} /> Add to Cart
        </button>
        <button className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 shadow-md">
          Buy Now
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Left: Product Images */}
        <div>
          <img
            src="https://via.placeholder.com/500x500"
            alt="Product"
            className="rounded-xl w-full"
          />
          <div className="flex gap-3 mt-3">
            <img src="https://via.placeholder.com/100" alt="thumb1" className="w-20 h-20 rounded-md border" />
            <img src="https://via.placeholder.com/100" alt="thumb2" className="w-20 h-20 rounded-md border" />
            <img src="https://via.placeholder.com/100" alt="thumb3" className="w-20 h-20 rounded-md border" />
          </div>
        </div>

        {/* Right: Product Details */}
        <div>
          {/* Title & Brand */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Wireless Bluetooth Headphones</h1>
            <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded">Best Seller</span>
          </div>
          <p className="text-gray-500">Brand: Sony | Category: Electronics</p>

          {/* Ratings */}
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} />
            <span className="ml-2 text-gray-600">(120 Reviews)</span>
          </div>

          {/* Price & Offer */}
          <div className="mt-4">
            <span className="text-3xl font-bold text-red-500">Rs. 4,999</span>
            <span className="ml-3 line-through text-gray-400">Rs. 7,499</span>
            <span className="ml-3 text-green-600 font-semibold">33% OFF</span>
          </div>

          {/* Variants */}
          <div className="mt-4">
            <h3 className="font-semibold">Available Colors:</h3>
            <div className="flex gap-3 mt-2">
              <div className="w-8 h-8 bg-black rounded-full border"></div>
              <div className="w-8 h-8 bg-blue-600 rounded-full border"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full border"></div>
            </div>
          </div>

          {/* Stock & Quantity */}
          <div className="mt-4">
            <p className="text-green-600 font-semibold">In Stock (Only 5 left!)</p>
            <input
              type="number"
              defaultValue={1}
              min={1}
              className="w-20 mt-2 p-2 border rounded-md"
            />
          </div>

          {/* Delivery & Return */}
          <div className="mt-4 space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <Truck size={18} /> Delivery in 3-5 days | Cash on Delivery available
            </p>
            <p className="flex items-center gap-2">
              <RefreshCw size={18} /> 7-Day Easy Return Policy
            </p>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="flex gap-4 mt-6 hidden md:flex">
            <button className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-md">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 shadow-md">
              Buy Now
            </button>
            <button className="p-3 rounded-xl border hover:bg-gray-100">
              <Heart />
            </button>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-3">Product Description</h2>
        <p className="text-gray-700 leading-relaxed">
          Experience high-quality sound with Sony’s Wireless Bluetooth Headphones. 
          Designed for comfort with noise cancellation and 20 hours of battery life. 
          Perfect for music, calls, and gaming.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">Specifications</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Bluetooth Version: 5.0</li>
          <li>Battery Life: 20 Hours</li>
          <li>Charging Time: 1.5 Hours</li>
          <li>Noise Cancellation: Active</li>
          <li>Warranty: 1 Year</li>
        </ul>
      </div>

      {/* Star Rating Breakdown */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Rating Breakdown</h2>
        {[5,4,3,2,1].map((star) => (
          <div key={star} className="flex items-center gap-2 mb-2">
            <span className="w-6">{star}⭐</span>
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className={`bg-yellow-500 h-2 rounded`}
                style={{ width: `${star*15}%` }}
              ></div>
            </div>
            <span className="ml-2 text-gray-600">{star*5} reviews</span>
          </div>
        ))}
      </div>

      {/* Related Products */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((item)=>(
            <div key={item} className="border rounded-xl p-3 hover:shadow-md transition">
              <img src="https://via.placeholder.com/150" alt="related" className="w-full rounded-md"/>
              <h3 className="text-sm font-semibold mt-2">Wireless Earbuds</h3>
              <p className="text-red-500 font-bold">Rs. 2,499</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {[1,2].map((review)=>(
          <div key={review} className="border-b pb-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} />
              <Star size={16} />
              <span className="ml-2 text-gray-600 text-sm">by User{review}</span>
            </div>
            <p className="text-gray-700 mt-2">
              🎧 Great product! Loved the comfort and sound quality.
            </p>
          </div>
        ))}
        <button className="mt-4 px-4 py-2 bg-gray-100 border rounded-md hover:bg-gray-200">Load More Reviews</button>
      </div>

      {/* Q&A Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8 mb-10">
        <h2 className="text-xl font-bold mb-4">Questions & Answers</h2>
        {[1,2].map((q)=>(
          <div key={q} className="border-b pb-4 mb-4">
            <p className="font-semibold">Q: Question {q}?</p>
            <p className="text-gray-700 mt-1">A: ✅ Answer {q} goes here.</p>
          </div>
        ))}
        <input type="text" placeholder="Ask a question..." className="w-full border p-2 rounded-md mt-2"/>
        <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">Submit Question</button>
      </div>
    </div>
  );
}
