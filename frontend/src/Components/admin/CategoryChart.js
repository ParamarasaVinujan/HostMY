import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const CategoryChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        const { data } = await axios.get("/api/admin/category-sales", {
          withCredentials: true,
        });

        const labels = ["Electronics", "Accessories", "Headphones", "Clothes", "Outdoor", "Home"];
        const colors = ["#3B82F6", "#A855F7", "#F59E0B", "#22C55E", "#EF4444", "#14B8A6"];

        setChartData({
          labels,
          datasets: [
            {
              data: [
                data.Electronics,
                data.Accessories,
                data.Headphones,
                data.Clothes,
                data.Outdoor,
                data.Home
              ],
              backgroundColor: colors,
              borderWidth: 2,
              hoverOffset: 10,
            },
          ],
          colors, // store colors for legend
        });
      } catch (error) {
        console.error("Error fetching category sales:", error);
      }
    };

    fetchCategorySales();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // hide default ChartJS legend
      },
      title: {
        display: true,
        text: "Sales by Category",
      },
    },
    cutout: "65%",
  };

  if (!chartData) return <p>Loading category chart...</p>;

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      
      {/* Chart */}
      <div style={{ width: "300px" }}>
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Custom Legend */}
      <div>
        {chartData.labels.map((label, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: chartData.colors[index],
                borderRadius: "4px",
                marginRight: "8px",
              }}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CategoryChart;
