import React, { useState, useEffect } from "react";

const History = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulate fetching user order history (replace this with actual API calls)
    const fetchedOrders = [
      { id: 1, date: "2024-11-10", details: "Package A - $100" },
      { id: 2, date: "2024-11-12", details: "Package B - $150" },
      { id: 3, date: "2024-11-15", details: "Package C - $200" },
    ];
    setOrders(fetchedOrders);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Order History
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-md shadow hover:shadow-lg transition duration-300"
            >
              <p className="text-gray-700">
                <strong className="text-purple-600">Date:</strong> {order.date}
              </p>
              <p className="text-gray-700">
                <strong className="text-purple-600">Details:</strong>{" "}
                {order.details}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
