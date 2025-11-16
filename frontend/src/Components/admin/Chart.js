import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2"; // ✅ Import Bar instead of Line

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const ChartComponent = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const { data } = await axios.get("/api/admin/monthly-revenue", { withCredentials: true });
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        
        setChartData({
          labels: months,
          datasets: [
            {
              label: "Monthly Revenue",
              data: data.monthlyRevenue, // backend gives array of 12 values
              backgroundColor: "rgba(30, 27, 75, 0.7)", // ✅ bar color
              borderColor: "#4ECDC4",
              borderWidth: 1,
              borderRadius: 6, // ✅ rounded bars
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Revenue Overview (Monthly)" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // ✅ Use Bar instead of Line
  return chartData ? <Bar ref={chartRef} data={chartData} options={options} /> : <p>Loading chart...</p>;
};

export default ChartComponent;
