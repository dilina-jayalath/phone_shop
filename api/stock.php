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

// Log the request for debugging
error_log("Stock API Request - Method: $method, URI: " . $_SERVER['REQUEST_URI']);

switch($method) {
    case "GET":
        // Get stock information for all products
        $mergedProducts = [];
        
        try {
            // Fetch phones
            $sqlPhone = "SELECT id, productName, price, color, availability, type, imageName, qty FROM phones";
            $stmtPhone = $conn->prepare($sqlPhone);
            $stmtPhone->execute();
            $productsPhone = $stmtPhone->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsPhone);

            // Fetch tablets
            $sqlTablets = "SELECT id, productName, price, color, availability, type, imageName, qty FROM tablets";
            $stmtTablets = $conn->prepare($sqlTablets);
            $stmtTablets->execute();
            $productsTablets = $stmtTablets->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsTablets);

            // Fetch watches
            $sqlWatches = "SELECT id, productName, price, color, availability, type, imageName, qty FROM watches";
            $stmtWatches = $conn->prepare($sqlWatches);
            $stmtWatches->execute();
            $productsWatches = $stmtWatches->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsWatches);

            // Fetch accessories
            $sqlAccessories = "SELECT id, productName, price, color, availability, type, imageName, qty FROM accessories";
            $stmtAccessories = $conn->prepare($sqlAccessories);
            $stmtAccessories->execute();
            $productsAccessories = $stmtAccessories->fetchAll(PDO::FETCH_ASSOC);
            $mergedProducts = array_merge($mergedProducts, $productsAccessories);

            // Set stockQty from the database qty field
            foreach ($mergedProducts as &$product) {
                $product['stockQty'] = $product['qty'] ?? 0; // Use database qty or default to 0
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
        
        // Parse the URL to get product ID and type
        $requestUri = $_SERVER['REQUEST_URI'];
        
        // Remove query string if present
        $requestUri = parse_url($requestUri, PHP_URL_PATH);
        
        // Extract the parts after stock.php
        if (preg_match('/\/stock\.php\/(\d+)\/([a-zA-Z]+)/', $requestUri, $matches)) {
            $productId = $matches[1];
            $productType = $matches[2];
            
            // Validate input
            if (!isset($input['availability'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                break;
            }
            
            // Convert frontend boolean strings to database format
            $availabilityInput = $input['availability'];
            if ($availabilityInput === "true" || $availabilityInput === true) {
                $availability = "yes";
            } else {
                $availability = "no";
            }
            
            $qty = isset($input['qty']) ? intval($input['qty']) : null;
            
            try {
                // Determine which database to use
                $allowedTables = ['phones', 'tablets', 'watches', 'accessories'];
                
                if (!in_array($productType, $allowedTables)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid product type']);
                    break;
                }
                
                // Update availability and quantity if provided
                if ($qty !== null) {
                    $sql = "UPDATE $productType SET availability = :availability, qty = :qty WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':availability', $availability);
                    $stmt->bindParam(':qty', $qty);
                    $stmt->bindParam(':id', $productId);
                } else {
                    $sql = "UPDATE $productType SET availability = :availability WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':availability', $availability);
                    $stmt->bindParam(':id', $productId);
                }
                
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
            echo json_encode(['error' => 'Invalid URL format. Expected: /stock.php/{id}/{type}']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>