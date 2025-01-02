<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';

// Connect to the 'phone' database
$objDbPhone = new DbConnect;
$connPhone = $objDbPhone->connect('phone');

// Connect to the 'products' database
$objDbProducts = new DbConnect;
$connProducts = $objDbProducts->connect('products');

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case "GET":

        $input = json_decode(file_get_contents('php://input'), true);
        $path = explode('/', $_SERVER['REQUEST_URI']);
        
        // Fetch product by ID from a specific table
        if (isset($path[3]) && is_numeric($path[3])) {
            $table = $path[4];
            $sql = "SELECT * FROM $table WHERE id = :id";
            $stmt = $connProducts->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $products = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($products);
        
        } else if (isset($path[3])) {
            // Sanitize the table name
            $allowedTables = ['phones', 'accessories', 'tablets', 'watches']; // Define allowed table names
            $table = in_array($path[3], $allowedTables) ? $path[3] : null; // Check if the table is allowed
            
            if ($table) {
                // Prepare SQL query to retrieve all products from the table
                $sql = "SELECT * FROM $table"; 
                $stmt = $connPhone->prepare($sql);
                $stmt->execute();
                $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                // Return the products as a JSON response
                echo json_encode($products);
            } else {
                // If the table is not valid
                echo json_encode(['error' => 'Invalid table name']);
            }
        
        } else { 
            // Fetch products from all tables and merge them, but do not duplicate phones
            $mergedProducts = [];

            // Fetch phones from the phones table
            $sqlPhone = "SELECT * FROM phones";
            $stmtPhone = $connPhone->prepare($sqlPhone);
            $stmtPhone->execute();
            $productsPhone = $stmtPhone->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsPhone);

            // Fetch tablets from the tablets table
            $sqlTablets = "SELECT * FROM tablets";
            $stmtTablets = $connPhone->prepare($sqlTablets);
            $stmtTablets->execute();
            $productsTablets = $stmtTablets->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsTablets);

            // Fetch watches from the watches table
            $sqlWatches = "SELECT * FROM watches";
            $stmtWatches = $connPhone->prepare($sqlWatches);
            $stmtWatches->execute();
            $productsWatches = $stmtWatches->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsWatches);

            // Fetch accessories from the accessories table
            $sqlAccessories = "SELECT * FROM accessories";
            $stmtAccessories = $connProducts->prepare($sqlAccessories);
            $stmtAccessories->execute();
            $productsAccessories = $stmtAccessories->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsAccessories);

            // Return the merged products as a JSON response
            echo json_encode($mergedProducts);
        }
        break;
}
?>
