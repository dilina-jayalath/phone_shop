import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BiTrendingUp, 
  BiMoney, 
  BiPackage, 
  BiChart, 
  BiDownload,
  BiCalendar,
  BiFilter,
  BiRefresh
} from "react-icons/bi";

function SalesReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Start of current month
    endDate: new Date().toISOString().split('T')[0], // Today
    category: 'all'
  });

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost/api/reports.php', {
        params: {
          start_date: filters.startDate,
          end_date: filters.endDate,
          category: filters.category
        }
      });
      setReportData(response.data);
      console.log('Report data:', response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      alert('Error fetching report data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintableReport();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales & Analytics Report</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            
            .print-header h1 {
              font-size: 28px;
              color: #2563eb;
              margin-bottom: 10px;
            }
            
            .print-header .report-info {
              font-size: 14px;
              color: #666;
            }
            
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .metric-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              background: #f8f9fa;
            }
            
            .metric-card h3 {
              font-size: 14px;
              color: #666;
              margin-bottom: 8px;
            }
            
            .metric-card .value {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
            
            .metric-card .subtitle {
              font-size: 12px;
              color: #666;
            }
            
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 15px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            
            th {
              background-color: #f3f4f6;
              font-weight: bold;
              color: #374151;
            }
            
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-right {
              text-align: right;
            }
            
            .font-bold {
              font-weight: bold;
            }
            
            .text-green {
              color: #059669;
            }
            
            .text-red {
              color: #dc2626;
            }
            
            .text-blue {
              color: #2563eb;
            }
            
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const generatePrintableReport = () => {
    const reportDate = new Date().toLocaleDateString();
    const dateRange = `${filters.startDate} to ${filters.endDate}`;
    
    return `
      <div class="print-header">
        <h1>📊 Sales & Analytics Report</h1>
        <div class="report-info">
          <p><strong>Generated:</strong> ${reportDate}</p>
          <p><strong>Period:</strong> ${dateRange}</p>
          <p><strong>Category:</strong> ${filters.category === 'all' ? 'All Categories' : filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}</p>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="section">
        <h2 class="section-title">📈 Key Performance Metrics</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Total Revenue</h3>
            <div class="value text-green">${formatCurrency(sales_summary?.summary?.total_revenue || 0)}</div>
            <div class="subtitle">Sales + Repairs</div>
          </div>
          <div class="metric-card">
            <h3>Total Orders</h3>
            <div class="value text-blue">${formatNumber(sales_summary?.summary?.total_orders || 0)}</div>
            <div class="subtitle">Orders Processed</div>
          </div>
          <div class="metric-card">
            <h3>Total Repairs</h3>
            <div class="value text-blue">${formatNumber(repair_summary?.total_summary?.total_repairs || 0)}</div>
            <div class="subtitle">Repair Services</div>
          </div>
          <div class="metric-card">
            <h3>Avg Order Value</h3>
            <div class="value text-green">${formatCurrency(sales_summary?.summary?.avg_order_value || 0)}</div>
            <div class="subtitle">Per Transaction</div>
          </div>
        </div>
      </div>

      <!-- Sales Summary -->
      <div class="section">
        <h2 class="section-title">💰 Sales Summary</h2>
        <table>
          <tr>
            <td class="font-bold">Total Orders</td>
            <td class="text-right">${formatNumber(sales_summary?.summary?.total_orders || 0)}</td>
          </tr>
          <tr>
            <td class="font-bold">Total Revenue</td>
            <td class="text-right text-green font-bold">${formatCurrency(sales_summary?.summary?.total_revenue || 0)}</td>
          </tr>
          <tr>
            <td class="font-bold">Average Order Value</td>
            <td class="text-right">${formatCurrency(sales_summary?.summary?.avg_order_value || 0)}</td>
          </tr>
          <tr>
            <td class="font-bold">Total Items Sold</td>
            <td class="text-right">${formatNumber(sales_summary?.summary?.total_items_sold || 0)}</td>
          </tr>
        </table>
      </div>

      <!-- Top Products -->
      <div class="section page-break">
        <h2 class="section-title">🏆 Top Performing Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sold</th>
              <th>Revenue</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            ${product_performance?.slice(0, 10).map(product => `
              <tr>
                <td class="font-bold">${product.product_name}</td>
                <td style="text-transform: capitalize">${product.category}</td>
                <td class="text-right">${formatCurrency(product.price)}</td>
                <td class="text-center">${formatNumber(product.total_quantity_sold)}</td>
                <td class="text-right text-green font-bold">${formatCurrency(product.revenue_generated)}</td>
                <td class="text-center ${product.current_stock <= 5 ? 'text-red font-bold' : ''}">${product.current_stock}</td>
              </tr>
            `).join('') || '<tr><td colspan="6" class="text-center">No data available</td></tr>'}
          </tbody>
        </table>
      </div>

      <!-- Category Analysis -->
      <div class="section">
        <h2 class="section-title">📦 Category Analysis</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Products</th>
              <th>Total Stock</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            ${category_analysis?.map(category => `
              <tr>
                <td class="font-bold" style="text-transform: capitalize">${category.category}</td>
                <td class="text-center">${category.total_products}</td>
                <td class="text-center">${formatNumber(category.total_stock)}</td>
                <td class="text-center">${category.orders_count}</td>
              </tr>
            `).join('') || '<tr><td colspan="4" class="text-center">No data available</td></tr>'}
          </tbody>
        </table>
      </div>

      <!-- Repair Summary -->
      <div class="section page-break">
        <h2 class="section-title">🔧 Repair Services Summary</h2>
        <table>
          <tr>
            <td class="font-bold">Total Repairs</td>
            <td class="text-right">${formatNumber(repair_summary?.total_summary?.total_repairs || 0)}</td>
          </tr>
          <tr>
            <td class="font-bold">Total Repair Revenue</td>
            <td class="text-right text-green font-bold">${formatCurrency(repair_summary?.total_summary?.total_repair_revenue || 0)}</td>
          </tr>
          <tr>
            <td class="font-bold">Average Repair Cost</td>
            <td class="text-right">${formatCurrency(repair_summary?.total_summary?.avg_repair_cost || 0)}</td>
          </tr>
        </table>

        ${repair_summary?.common_issues?.length > 0 ? `
          <h3 style="margin-top: 20px; margin-bottom: 10px; font-size: 16px;">Most Common Issues</h3>
          <table>
            <thead>
              <tr>
                <th>Issue</th>
                <th>Frequency</th>
                <th>Average Cost</th>
              </tr>
            </thead>
            <tbody>
              ${repair_summary.common_issues.slice(0, 5).map(issue => `
                <tr>
                  <td class="font-bold">${issue.issue_description}</td>
                  <td class="text-center">${issue.frequency}</td>
                  <td class="text-right">${formatCurrency(issue.avg_cost)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </div>

      <!-- Low Stock Alerts -->
      ${low_stock_alerts?.length > 0 ? `
        <div class="section">
          <h2 class="section-title">⚠️ Low Stock Alerts</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${low_stock_alerts.slice(0, 10).map(item => `
                <tr>
                  <td class="font-bold">${item.productName}</td>
                  <td style="text-transform: capitalize">${item.category}</td>
                  <td class="text-center text-red font-bold">${item.qty}</td>
                  <td class="text-center text-red font-bold">Low Stock</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Monthly Trends -->
      ${monthly_trends?.length > 0 ? `
        <div class="section page-break">
          <h2 class="section-title">📊 Monthly Trends (Last 12 Months)</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              ${monthly_trends.map(month => `
                <tr>
                  <td class="font-bold">${month.month}</td>
                  <td class="text-center">${formatNumber(month.orders_count)}</td>
                  <td class="text-right text-green">${formatCurrency(month.revenue)}</td>
                  <td class="text-right">${formatCurrency(month.avg_order_value)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
        <p>Report generated on ${reportDate} | Phone Shop Management System</p>
      </div>
    `;
  };

  const formatCurrency = (amount) => {
    // Format for Sri Lankan Rupees (RS)
    return `RS ${new Intl.NumberFormat('en-US').format(amount || 0)}`;
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number || 0);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No report data available</p>
      </div>
    );
  }

  const { sales_summary, repair_summary, product_performance, monthly_trends, category_analysis, low_stock_alerts } = reportData;

  return (
    <div className="w-full h-full px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BiChart className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Sales & Analytics Reports</h1>
            </div>
            <button
              onClick={fetchReportData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BiRefresh className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BiCalendar className="inline w-4 h-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BiCalendar className="inline w-4 h-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BiFilter className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="phone">Phones</option>
                <option value="tablet">Tablets</option>
                <option value="watch">Watches</option>
                <option value="accessory">Accessories</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handlePrintReport}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <BiDownload className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(sales_summary?.summary?.total_revenue)}</p>
                <p className="text-green-100 text-sm">Sales + Repairs</p>
              </div>
              <div className="bg-green-400 rounded-full p-3">
                <BiMoney className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold">{formatNumber(sales_summary?.summary?.total_orders)}</p>
                <p className="text-blue-100 text-sm">Orders Processed</p>
              </div>
              <div className="bg-blue-400 rounded-full p-3">
                <BiPackage className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Total Repairs */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Repairs</p>
                <p className="text-3xl font-bold">{formatNumber(repair_summary?.total_summary?.total_repairs)}</p>
                <p className="text-purple-100 text-sm">Repair Services</p>
              </div>
              <div className="bg-purple-400 rounded-full p-3">
                <BiChart className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Avg Order Value</p>
                <p className="text-3xl font-bold">{formatCurrency(sales_summary?.summary?.avg_order_value)}</p>
                <p className="text-orange-100 text-sm">Per Transaction</p>
              </div>
              <div className="bg-orange-400 rounded-full p-3">
                <BiTrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BiChart },
                { id: 'products', label: 'Product Performance', icon: BiPackage },
                { id: 'repairs', label: 'Repair Analytics', icon: BiChart },
                { id: 'trends', label: 'Monthly Trends', icon: BiTrendingUp }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Daily Sales Trend */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales Trend</h3>
                  <div className="h-64 bg-white rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <BiChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chart visualization would go here</p>
                      <p className="text-sm text-gray-500">
                        {sales_summary?.daily_trends?.length || 0} days of data available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Analysis */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category_analysis?.map((category, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow">
                        <h4 className="font-medium text-gray-800 capitalize">{category.category}</h4>
                        <p className="text-2xl font-bold text-blue-600">{category.total_products}</p>
                        <p className="text-sm text-gray-600">Products</p>
                        <p className="text-sm text-gray-600">Stock: {formatNumber(category.total_stock)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Performance Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Top Performing Products</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product_performance?.slice(0, 10).map((product, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(product.total_quantity_sold)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(product.revenue_generated)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.current_stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {product.current_stock}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Repair Analytics Tab */}
            {activeTab === 'repairs' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                    <h4 className="text-indigo-100 text-sm font-medium">Repair Revenue</h4>
                    <p className="text-2xl font-bold">{formatCurrency(repair_summary?.total_summary?.total_repair_revenue)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
                    <h4 className="text-teal-100 text-sm font-medium">Avg Repair Cost</h4>
                    <p className="text-2xl font-bold">{formatCurrency(repair_summary?.total_summary?.avg_repair_cost)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
                    <h4 className="text-pink-100 text-sm font-medium">Total Repairs</h4>
                    <p className="text-2xl font-bold">{formatNumber(repair_summary?.total_summary?.total_repairs)}</p>
                  </div>
                </div>

                {/* Common Issues */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Common Repair Issues</h3>
                  <div className="space-y-3">
                    {repair_summary?.common_issues?.slice(0, 5).map((issue, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{issue.issue_description}</p>
                          <p className="text-sm text-gray-500">Average cost: {formatCurrency(issue.avg_cost)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">{issue.frequency}</p>
                          <p className="text-sm text-gray-500">occurrences</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Trends Tab */}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">12-Month Trends</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="h-64 bg-white rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <BiTrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Monthly trend chart would go here</p>
                      <p className="text-sm text-gray-500">
                        {monthly_trends?.length || 0} months of data available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Monthly Data Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthly_trends?.map((month, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {month.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(month.orders_count)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(month.revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(month.avg_order_value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        {low_stock_alerts && low_stock_alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BiPackage className="w-6 h-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {low_stock_alerts.slice(0, 6).map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                  <p className="text-lg font-semibold text-red-600">Only {item.qty} left</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesReport;