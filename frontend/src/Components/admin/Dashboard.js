import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../../actions/productAction";
import { Link } from "react-router-dom";
import {
  DollarSignIcon,
  ShoppingBagIcon,
  UsersIcon,
  PackageIcon,
} from "lucide-react";
import axios from "axios";
import ChartComponent from "./Chart.js";
import CategoryChart from "./CategoryChart";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products = [] } = useSelector((state) => state.productsState);
  const { users = [] } = useSelector((state) => state.userState);
  const { adminOrders = [], totalAmount } = useSelector(
    (state) => state.orderState
  );

  let outOfStock = 0;
  if (products.length > 0) {
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock += 1;
      }
    });
  }

  useEffect(() => {
    dispatch(getAdminProducts);
  }, [dispatch]);

  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get("/api/admin/stats", {
        withCredentials: true,
      });
      setStats(data.stats);
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 pr-6 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 text-base mt-2">
              Welcome back! Here's your store performance overview.
            </p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {/* Revenue */}
          <div className="group p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <DollarSignIcon className="text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-4xl mt-4 font-extrabold text-gray-900 tracking-tight">
              {stats.revenue?.toFixed(2)}
            </p>
          </div>

          {/* Orders */}
          <div className="group p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <ShoppingBagIcon className="text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-4xl mt-4 font-extrabold text-gray-900 tracking-tight">
              {stats.orders}
            </p>
            <Link
              to={"/admin/orders"}
              className="text-blue-600 text-sm font-semibold hover:underline mt-2 inline-block"
            >
              View Details →
            </Link>
          </div>

          {/* Customers */}
          <div className="group p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Total Customers
              </p>
              <UsersIcon className="text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-4xl mt-4 font-extrabold text-gray-900 tracking-tight">
              {stats.customers}
            </p>
            <Link
              to={"/admin/users"}
              className="text-purple-600 text-sm font-semibold hover:underline mt-2 inline-block"
            >
              View Details →
            </Link>
          </div>

          {/* Low Stock */}
          <div className="group p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Low Stock Products
              </p>
              <PackageIcon className="text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-4xl mt-4 font-extrabold text-gray-900 tracking-tight">
              {stats.lowStock}
            </p>
          </div>

          {/* Total Products */}
          <div className="group p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <PackageIcon className="text-yellow-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-4xl mt-4 font-extrabold text-gray-900 tracking-tight">
              {stats.products}
            </p>
            <Link
              to={"/admin/products"}
              className="text-yellow-600 text-sm font-semibold hover:underline mt-2 inline-block"
            >
              View Details →
            </Link>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white p-10 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-[420px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Revenue Overview
            </h2>
            <ChartComponent />
          </div>

          {/* Category Chart */}
          <div className="bg-white p-10 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-[420px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Category-wise Sales
            </h2>
            <CategoryChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
