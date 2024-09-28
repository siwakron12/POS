"use client";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${apiUrl}/sales/group`); // Fetch sales data from API
        const data = await response.json(); // Convert to JSON
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [apiUrl]);

  // Process and aggregate sales data by date
  const aggregatedData = (Array.isArray(salesData) ? salesData : []).reduce((acc, item) => {
    const date = new Date(item.time).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    acc[date] = (acc[date] || 0) + item.totalSales; // Aggregate sales by date
    return acc;
  }, {});

  // Prepare chart data
  const chartData = {
    labels: Object.keys(aggregatedData), // Dates in YYYY-MM-DD format
    datasets: [
      {
        label: 'ยอดขาย (บาท)',
        data: Object.values(aggregatedData), // Total sales per day
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Line color
        borderColor: 'rgba(75, 192, 192, 1)', // Border color
        tension: 0.2, // Line tension (curve)
      },
    ],
  };

  return (
    <div className="p-12">
      <section className="w-full bg-white h-screen rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">กราฟยอดขายรายวัน</h2>
        <div className="w-full h-[700px] flex justify-center">
          {/* Display the chart using Chart.js */}
          <Line data={chartData} />
        </div>
      </section>
    </div>
  );
}
