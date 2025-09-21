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
        // Get stock information for all products
        $mergedProducts = [];
        
        try {
            // Fetch phones
            $sqlPhone = "SELECT id, productName, price, color, availability, type, imageName FROM phones";
            $stmtPhone = $conn->prepare($sqlPhone);
            $stmtPhone->execute();
            $productsPhone = $stmtPhone->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsPhone);

            // Fetch tablets
            $sqlTablets = "SELECT id, productName, price, color, availability, type, imageName FROM tablets";
            $stmtTablets = $conn->prepare($sqlTablets);
            $stmtTablets->execute();
            $productsTablets = $stmtTablets->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsTablets);

            // Fetch watches
            $sqlWatches = "SELECT id, productName, price, color, availability, type, imageName FROM watches";
            $stmtWatches = $conn->prepare($sqlWatches);
            $stmtWatches->execute();
            $productsWatches = $stmtWatches->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsWatches);

            // Fetch accessories
            $sqlAccessories = "SELECT id, productName, price, color, availability, type, imageName FROM accessories";
            $stmtAccessories = $conn->prepare($sqlAccessories);
            $stmtAccessories->execute();
            $productsAccessories = $stmtAccessories->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsAccessories);

            // Add stock quantity (mock data for now since it's not in the database)
            foreach ($mergedProducts as &$product) {
                $product['stockQty'] = rand(0, 100); // Mock stock quantity
            }

            echo json_encode($mergedProducts);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;

    case "PUT":
        // Update stock information
        $input = json_decode(file_get_contents('php://input'), true);
        $path = explode('/', $_SERVER['REQUEST_URI']);
        
        if (isset($path[3]) && is_numeric($path[3]) && isset($path[4])) {
            $productId = $path[3];
            $productType = $path[4];
            
            // Validate input
            if (!isset($input['availability'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                break;
            }
            
            $availability = $input['availability'];
            
            try {
                // Determine which database to use
                $allowedTables = ['phones', 'tablets', 'watches', 'accessories'];
                
                if (!in_array($productType, $allowedTables)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid product type']);
                    break;
                }
                
                // Update availability
                $sql = "UPDATE $productType SET availability = :availability WHERE id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':availability', $availability);
                $stmt->bindParam(':id', $productId);
                
                if ($stmt->execute()) {
                    echo json_encode(['message' => 'Stock updated successfully']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update stock']);
                }
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request format']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>