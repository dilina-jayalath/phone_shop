<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'DbConnect.php';

// Connect to the database
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case "GET":
        try {
            // Get query parameters for filtering
            $startDate = $_GET['start_date'] ?? date('Y-m-01'); // Default to start of current month
            $endDate = $_GET['end_date'] ?? date('Y-m-d'); // Default to today
            $category = $_GET['category'] ?? 'all'; // all, phones, tablets, watches, accessories
            
            $report = [];
            
            // 1. Sales Summary
            $salesSummary = getSalesSummary($conn, $startDate, $endDate, $category);
            $report['sales_summary'] = $salesSummary;
            
            // 2. Repair Summary
            $repairSummary = getRepairSummary($conn, $startDate, $endDate);
            $report['repair_summary'] = $repairSummary;
            
            // 3. Product Performance
            $productPerformance = getProductPerformance($conn, $startDate, $endDate, $category);
            $report['product_performance'] = $productPerformance;
            
            // 4. Monthly Trends (last 12 months)
            $monthlyTrends = getMonthlyTrends($conn);
            $report['monthly_trends'] = $monthlyTrends;
            
            // 5. Category Analysis
            $categoryAnalysis = getCategoryAnalysis($conn, $startDate, $endDate);
            $report['category_analysis'] = $categoryAnalysis;
            
            // 6. Low Stock Alerts
            $lowStock = getLowStockItems($conn);
            $report['low_stock_alerts'] = $lowStock;
            
            echo json_encode($report);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

// Helper Functions

function getSalesSummary($conn, $startDate, $endDate, $category) {
    $whereClause = "";
    $params = [':start_date' => $startDate, ':end_date' => $endDate];
    
    if ($category !== 'all') {
        $whereClause = "AND details LIKE :category";
        $params[':category'] = "%$category%";
    }
    
    // Total sales, revenue, and order count (using 'price' column instead of 'total_amount')
    $sql = "SELECT 
                COUNT(*) as total_orders,
                SUM(price) as total_revenue,
                AVG(price) as avg_order_value,
                COUNT(*) as total_items_sold
            FROM orders 
            WHERE DATE(created_at) BETWEEN :start_date AND :end_date 
            $whereClause";
    
    $stmt = $conn->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Daily sales trend for the period
    $dailySql = "SELECT 
                    DATE(created_at) as sale_date,
                    COUNT(*) as orders_count,
                    SUM(price) as daily_revenue
                 FROM orders 
                 WHERE DATE(created_at) BETWEEN :start_date AND :end_date 
                 $whereClause
                 GROUP BY DATE(created_at)
                 ORDER BY sale_date";
    
    $dailyStmt = $conn->prepare($dailySql);
    foreach ($params as $key => $value) {
        $dailyStmt->bindValue($key, $value);
    }
    $dailyStmt->execute();
    $dailyTrends = $dailyStmt->fetchAll(PDO::FETCH_ASSOC);
    
    return [
        'summary' => $summary,
        'daily_trends' => $dailyTrends
    ];
}

function getRepairSummary($conn, $startDate, $endDate) {
    // Repair statistics (using actual repair table structure)
    $sql = "SELECT 
                COUNT(*) as total_repairs,
                status,
                COUNT(*) as status_count
            FROM repairs 
            WHERE DATE(created_at) BETWEEN :start_date AND :end_date
            GROUP BY status";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->execute();
    $repairsByStatus = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Total repair summary
    $totalSql = "SELECT 
                    COUNT(*) as total_repairs
                 FROM repairs 
                 WHERE DATE(created_at) BETWEEN :start_date AND :end_date";
    
    $totalStmt = $conn->prepare($totalSql);
    $totalStmt->bindParam(':start_date', $startDate);
    $totalStmt->bindParam(':end_date', $endDate);
    $totalStmt->execute();
    $totalSummary = $totalStmt->fetch(PDO::FETCH_ASSOC);
    
    // Add default values for missing fields
    $totalSummary['total_repair_revenue'] = 0; // No cost field in repairs table
    $totalSummary['avg_repair_cost'] = 0;
    
    // Most common repair issues
    $issuesSql = "SELECT 
                     issue as issue_description,
                     COUNT(*) as frequency
                  FROM repairs 
                  WHERE DATE(created_at) BETWEEN :start_date AND :end_date
                  GROUP BY issue
                  ORDER BY frequency DESC
                  LIMIT 10";
    
    $issuesStmt = $conn->prepare($issuesSql);
    $issuesStmt->bindParam(':start_date', $startDate);
    $issuesStmt->bindParam(':end_date', $endDate);
    $issuesStmt->execute();
    $commonIssues = $issuesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Add avg_cost field to common issues (set to 0 since no cost data)
    foreach ($commonIssues as &$issue) {
        $issue['avg_cost'] = 0;
    }
    
    return [
        'total_summary' => $totalSummary,
        'by_status' => $repairsByStatus,
        'common_issues' => $commonIssues
    ];
}

function getProductPerformance($conn, $startDate, $endDate, $category) {
    // Get all products from different tables
    $products = [];
    $tables = ['phones', 'tablets', 'watches', 'accessories'];
    
    foreach ($tables as $table) {
        if ($category === 'all' || $category === substr($table, 0, -1)) {
            $sql = "SELECT id, productName, price, qty, '$table' as category FROM $table";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $tableProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $products = array_merge($products, $tableProducts);
        }
    }
    
    // Calculate sales performance for each product (simplified approach)
    $performance = [];
    foreach ($products as $product) {
        // Count how many times this product name appears in order details (simplified)
        $sql = "SELECT COUNT(*) as times_ordered
                FROM orders 
                WHERE DATE(created_at) BETWEEN :start_date AND :end_date
                AND details LIKE :product_name";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':start_date', $startDate);
        $stmt->bindParam(':end_date', $endDate);
        $productNameSearch = '%' . $product['productName'] . '%';
        $stmt->bindParam(':product_name', $productNameSearch);
        $stmt->execute();
        $sales = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $performance[] = [
            'product_id' => $product['id'],
            'product_name' => $product['productName'],
            'category' => $product['category'],
            'price' => $product['price'],
            'current_stock' => $product['qty'],
            'times_ordered' => $sales['times_ordered'] ?: 0,
            'total_quantity_sold' => $sales['times_ordered'] ?: 0, // Simplified
            'revenue_generated' => ($sales['times_ordered'] ?: 0) * $product['price']
        ];
    }
    
    // Sort by revenue generated
    usort($performance, function($a, $b) {
        return $b['revenue_generated'] <=> $a['revenue_generated'];
    });
    
    return array_slice($performance, 0, 20); // Top 20 products
}

function getMonthlyTrends($conn) {
    $sql = "SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as orders_count,
                SUM(price) as revenue,
                AVG(price) as avg_order_value
            FROM orders 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getCategoryAnalysis($conn, $startDate, $endDate) {
    $categories = ['phones', 'tablets', 'watches', 'accessories'];
    $analysis = [];
    
    foreach ($categories as $category) {
        // Get total products in category
        $sql = "SELECT COUNT(*) as total_products, SUM(qty) as total_stock FROM $category";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $categoryData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get sales data for this category (simplified - would need more complex JSON queries for real implementation)
        $salesSql = "SELECT COUNT(*) as orders_with_category 
                     FROM orders 
                     WHERE DATE(created_at) BETWEEN :start_date AND :end_date";
        
        $salesStmt = $conn->prepare($salesSql);
        $salesStmt->bindParam(':start_date', $startDate);
        $salesStmt->bindParam(':end_date', $endDate);
        $salesStmt->execute();
        $salesData = $salesStmt->fetch(PDO::FETCH_ASSOC);
        
        $analysis[] = [
            'category' => $category,
            'total_products' => $categoryData['total_products'],
            'total_stock' => $categoryData['total_stock'],
            'orders_count' => $salesData['orders_with_category']
        ];
    }
    
    return $analysis;
}

function getLowStockItems($conn) {
    $lowStock = [];
    $tables = ['phones', 'tablets', 'watches', 'accessories'];
    
    foreach ($tables as $table) {
        $sql = "SELECT id, productName, qty, '$table' as category 
                FROM $table 
                WHERE qty <= 5 AND qty > 0
                ORDER BY qty ASC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $lowStock = array_merge($lowStock, $items);
    }
    
    return $lowStock;
}
?>