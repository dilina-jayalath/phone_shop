<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';

// Connect to the database
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case "GET":

        $input = json_decode(file_get_contents('php://input'), true);
        $path = explode('/', $_SERVER['REQUEST_URI']);
        
        // Fetch product by ID from a specific table
        if (isset($path[3]) && is_numeric($path[3])) {
            $table = $path[4];
            
            // Get the type name for the table
            $type = '';
            switch($table) {
                case 'phones':
                    $type = 'phone';
                    break;
                case 'tablets':
                    $type = 'tablet';
                    break;
                case 'watches':
                    $type = 'watch';
                    break;
                case 'accessories':
                    $type = 'accessory';
                    break;
            }
            
            $sql = "SELECT *, '$type' as type FROM $table WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $products = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($products);
        
        } else if (isset($path[3])) {
            // Sanitize the table name
            $allowedTables = ['phones', 'accessories', 'tablets', 'watches']; // Define allowed table names
            $table = in_array($path[3], $allowedTables) ? $path[3] : null; // Check if the table is allowed
            
            if ($table) {
                // Get the type name for the table
                $type = '';
                switch($table) {
                    case 'phones':
                        $type = 'phone';
                        break;
                    case 'tablets':
                        $type = 'tablet';
                        break;
                    case 'watches':
                        $type = 'watch';
                        break;
                    case 'accessories':
                        $type = 'accessory';
                        break;
                }
                
                // Prepare SQL query to retrieve all products from the table with type
                $sql = "SELECT *, '$type' as type FROM $table"; 
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                // Return the products as a JSON response
                echo json_encode($products);
            } else {
                // If the table is not valid
                echo json_encode(['error' => 'Invalid table name']);
            }
        
        } else { 
            // Fetch products from all tables and merge them
            $mergedProducts = [];

            // Fetch phones from the phones table
            $sqlPhone = "SELECT *, 'phone' as type FROM phones";
            $stmtPhone = $conn->prepare($sqlPhone);
            $stmtPhone->execute();
            $productsPhone = $stmtPhone->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsPhone);

            // Fetch tablets from the tablets table
            $sqlTablets = "SELECT *, 'tablet' as type FROM tablets";
            $stmtTablets = $conn->prepare($sqlTablets);
            $stmtTablets->execute();
            $productsTablets = $stmtTablets->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsTablets);

            // Fetch watches from the watches table
            $sqlWatches = "SELECT *, 'watch' as type FROM watches";
            $stmtWatches = $conn->prepare($sqlWatches);
            $stmtWatches->execute();
            $productsWatches = $stmtWatches->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsWatches);

            // Fetch accessories from the accessories table
            $sqlAccessories = "SELECT *, 'accessory' as type FROM accessories";
            $stmtAccessories = $conn->prepare($sqlAccessories);
            $stmtAccessories->execute();
            $productsAccessories = $stmtAccessories->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsAccessories);

            // Return the merged products as a JSON response
            echo json_encode($mergedProducts);
        }
        break;
}
?>
