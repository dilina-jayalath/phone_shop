
<?php
// Allow CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow your React frontend
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Access-Control-Allow-Credentials: true"); // If using cookies or authentication


// Include database connection
include 'DbConnect.php';

$objDb = new DbConnect();
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {

    case "GET":
        $sql = "SELECT * FROM orders";
        $path = explode('/', $_SERVER['REQUEST_URI']);
       
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $users = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($users);
        break;


        case "POST":
            // Get the raw POST data
            $input = json_decode(file_get_contents('php://input'), true);
    
            // Validate input
            if (
                isset($input['userId']) &&
                isset($input['details']) && // Expecting an array of order details
                isset($input['price']) &&
                isset($input['location'])&&
                isset($input['contact'])
            ) {
                try {
                    // Start transaction
                    $conn->beginTransaction();
                    
                    $userId = htmlspecialchars($input['userId']);
                    $price = htmlspecialchars($input['price']);
                    $location = htmlspecialchars($input['location']);
                    $contact = htmlspecialchars($input['contact']);
                    $details = $input['details']; // Details should be an array
                    $created_at = date('Y-m-d');
        
                    // Convert details array to JSON
                    $detailsJson = json_encode($details);
        
                    // Prepare SQL statement for order insertion
                    $sql = "INSERT INTO orders (userId, contact, details, price, location, created_at) 
                            VALUES (:userId, :contact , :details, :price, :location, :created_at)";
                    $stmt = $conn->prepare($sql);
        
                    // Bind parameters
                    $stmt->bindParam(':userId', $userId);
                    $stmt->bindParam(':contact', $contact);
                    $stmt->bindParam(':details', $detailsJson);
                    $stmt->bindParam(':price', $price);
                    $stmt->bindParam(':location', $location);
                    $stmt->bindParam(':created_at', $created_at);
        
                    // Execute the order insertion
                    if ($stmt->execute()) {
                        // Update product quantities
                        error_log("Order inserted successfully, now updating inventory...");
                        
                        foreach ($details as $item) {
                            error_log("Processing item: " . json_encode($item));
                            
                            if (isset($item['id']) && isset($item['quantity']) && isset($item['type'])) {
                                $productId = $item['id'];
                                $quantity = $item['quantity'];
                                $productType = $item['type'];
                                
                                // Debug log
                                error_log("Processing item: ID=$productId, Qty=$quantity, Type=$productType");
                                
                                // Get table name based on product type
                                $table = '';
                                switch ($productType) {
                                    case 'phone':
                                        $table = 'phones';
                                        break;
                                    case 'tablet':
                                        $table = 'tablets';
                                        break;
                                    case 'watch':
                                        $table = 'watches';
                                        break;
                                    case 'accessory':
                                        $table = 'accessories';
                                        break;
                                    default:
                                        error_log("Unknown product type: $productType");
                                        throw new Exception('Invalid product type: ' . $productType);
                                }
                                
                                error_log("Using table: $table for product type: $productType");
                                
                                // Check current quantity
                                $checkQuery = "SELECT qty FROM $table WHERE id = :id";
                                $checkStmt = $conn->prepare($checkQuery);
                                $checkStmt->bindParam(':id', $productId);
                                $checkStmt->execute();
                                $currentQty = $checkStmt->fetchColumn();
                                
                                error_log("Current qty for product $productId in table $table: $currentQty");
                                
                                if ($currentQty === false) {
                                    error_log("Product $productId not found in table $table");
                                    throw new Exception("Product ID $productId not found in table $table");
                                }
                                
                                if ($currentQty < $quantity) {
                                    error_log("Insufficient stock: current=$currentQty, requested=$quantity");
                                    throw new Exception('Insufficient stock for product ID: ' . $productId);
                                }
                                
                                // Update quantity and availability
                                $newQty = $currentQty - $quantity;
                                error_log("New qty for product $productId: $newQty");
                                
                                $updateQuery = "UPDATE $table SET qty = :qty, availability = CASE WHEN :newQty > 0 THEN 'yes' ELSE 'no' END WHERE id = :id";
                                $updateStmt = $conn->prepare($updateQuery);
                                $updateStmt->bindParam(':qty', $newQty);
                                $updateStmt->bindParam(':newQty', $newQty);
                                $updateStmt->bindParam(':id', $productId);
                                
                                if ($updateStmt->execute()) {
                                    $rowsAffected = $updateStmt->rowCount();
                                    error_log("Successfully updated qty for product $productId in table $table. Rows affected: $rowsAffected");
                                } else {
                                    error_log("Failed to update qty for product $productId. Error: " . implode(", ", $updateStmt->errorInfo()));
                                    throw new Exception("Failed to update inventory for product $productId");
                                }
                            } else {
                                error_log("Missing required fields in item: " . json_encode($item));
                                throw new Exception("Missing required fields (id, quantity, type) in order item");
                            }
                        }
                        
                        // Commit transaction
                        $conn->commit();
                        echo json_encode(['message' => 'Order added successfully and inventory updated']);
                    } else {
                        throw new Exception('Failed to add order');
                    }
                } catch (Exception $e) {
                    // Rollback transaction on error
                    $conn->rollback();
                    echo json_encode(['error' => 'Failed to process order: ' . $e->getMessage()]);
                }
            } else {
                echo json_encode(['error' => 'Invalid input']);
            }
            break;

    
    case "PUT":
        $user = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE orders SET `status`= :status WHERE orderId = :id";
    
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $user->id);
        $stmt->bindParam(':status', $user->status); // Correct placeholder
    
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
    
        break;
    

    case "DELETE":
        $sql = "DELETE FROM orders WHERE orderId = :id";
        $path = explode('/', $_SERVER['REQUEST_URI']);

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $path[3]);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;



    default:
    echo json_encode(['error' => 'Invalid request']);
    break;
} 
?>
