import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiEdit, BiTrash, BiPackage } from "react-icons/bi";

function StockTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [stockQty, setStockQty] = useState("");
  const [availability, setAvailability] = useState("");

  const imagePath = "http://localhost/api/products/";

  // Get all products from the API
  const getItemsDB = () => {
    setLoading(true);
    axios
      .get("http://localhost/api/stock.php")
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getItemsDB();
  }, []);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate stock statistics
  const getStockStatistics = () => {
    const totalProducts = items.length;
    
    // Count low stock items (quantity <= 5)
    const lowStockItems = items.filter(item => {
      const qty = parseInt(item.qty) || 0;
      return qty > 0 && qty <= 5;
    }).length;
    
    // Count out of stock items (quantity = 0)
    const outOfStockItems = items.filter(item => {
      const qty = parseInt(item.qty) || 0;
      return qty === 0;
    }).length;
    
    // Find highest stock item
    const highestStockItem = items.reduce((max, item) => {
      const qty = parseInt(item.qty) || 0;
      const maxQty = parseInt(max.qty) || 0;
      return qty > maxQty ? item : max;
    }, { qty: 0 });
    
    const highestStockCount = parseInt(highestStockItem.qty) || 0;
    
    return {
      totalProducts,
      lowStockItems,
      outOfStockItems,
      highestStockCount,
      highestStockProduct: highestStockItem.productName || 'N/A'
    };
  };

  const stats = getStockStatistics();

  // Get category name from type
  const getCategoryName = (type) => {
    if (!type) return "Unknown";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get availability status badge
  const getAvailabilityBadge = (availability, stockQty) => {
    // Check both availability field and stock quantity
    const hasAvailability = availability === "yes" || availability === "true" || availability === true;
    const hasStock = stockQty && parseInt(stockQty) > 0;
    
    // Item is in stock only if both availability is yes AND quantity > 0
    const isAvailable = hasAvailability && hasStock;
    
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          isAvailable
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {isAvailable ? "In Stock" : "Out of Stock"}
      </span>
    );
  };

  // Handle delete product
  const handleDelete = (id, type) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`http://localhost/api/delete_product.php/${id}/${type}`)
        .then((res) => {
          alert("Product deleted successfully!");
          getItemsDB(); // Refresh the list
        })
        .catch((err) => {
          alert("Error deleting product: " + err.message);
        });
    }
  };

  // Handle edit stock quantity (mock function - would need API endpoint)
  const handleEditStock = (item) => {
    setEditingItem(item);
    setStockQty(item.stockQty || "0"); // Default to 0 if no stock qty
    // Convert database "yes"/"no" to frontend "true"/"false"
    setAvailability(item.availability === "yes" ? "true" : "false");
  };

  // Save stock changes
  const saveStockChanges = () => {
    const qtyValue = parseInt(stockQty) || 0;
    
    // Auto-set availability based on quantity
    // If quantity > 0 and user selected "true", keep it true
    // If quantity = 0, force availability to false regardless of user selection
    const finalAvailability = qtyValue > 0 ? availability : "false";
    
    const updateData = {
      availability: finalAvailability,
      qty: qtyValue
    };
    
    axios
      .put(`http://localhost/api/stock.php/${editingItem.id}/${editingItem.type}`, updateData)
      .then((res) => {
        alert("Stock updated successfully!");
        getItemsDB(); // Refresh the list
        setEditingItem(null);
        setStockQty("");
        setAvailability("");
      })
      .catch((err) => {
        alert("Error updating stock: " + err.message);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-24 py-8 bg-white rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BiPackage className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Products */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="bg-blue-400 rounded-full p-3">
              <BiPackage className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold">{stats.lowStockItems}</p>
              <p className="text-yellow-100 text-xs mt-1">≤ 5 items</p>
            </div>
            <div className="bg-yellow-400 rounded-full p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Out of Stock Items */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Out of Stock</p>
              <p className="text-3xl font-bold">{stats.outOfStockItems}</p>
              <p className="text-red-100 text-xs mt-1">0 items</p>
            </div>
            <div className="bg-red-400 rounded-full p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Highest Stock Item */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Highest Stock</p>
              <p className="text-3xl font-bold">{stats.highestStockCount}</p>
              <p className="text-green-100 text-xs mt-1 truncate" title={stats.highestStockProduct}>
                {stats.highestStockProduct.length > 15 
                  ? stats.highestStockProduct.substring(0, 15) + '...' 
                  : stats.highestStockProduct}
              </p>
            </div>
            <div className="bg-green-400 rounded-full p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={`${imagePath}${item.imageName}`}
                        alt={item.productName}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/48/48";
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.color}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {getCategoryName(item.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="font-medium">
                    {item.stockQty || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getAvailabilityBadge(item.availability, item.stockQty)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditStock(item)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit Stock"
                    >
                      <BiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.type)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Product"
                    >
                      <BiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <BiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}

      {/* Edit Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Stock</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product: {editingItem.productName}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Note: If quantity is 0, availability will be automatically set to "Out of Stock"
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveStockChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default StockTable;