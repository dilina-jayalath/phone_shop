
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
                isset($input['location'])
            ) {
                $userId = htmlspecialchars($input['userId']);
                $price = htmlspecialchars($input['price']);
                $location = htmlspecialchars($input['location']);
                $details = $input['details']; // Details should be an array
                $created_at = date('Y-m-d');
    
                // Convert details array to JSON
                $detailsJson = json_encode($details);
    
                // Prepare SQL statement
                $sql = "INSERT INTO orders (userId, details, price, location, created_at) 
                        VALUES (:userId, :details, :price, :location, :created_at)";
                $stmt = $conn->prepare($sql);
    
                // Bind parameters
                $stmt->bindParam(':userId', $userId);
                $stmt->bindParam(':details', $detailsJson);
                $stmt->bindParam(':price', $price);
                $stmt->bindParam(':location', $location);
                $stmt->bindParam(':created_at', $created_at);
    
                // Execute the statement
                if ($stmt->execute()) {
                    echo json_encode(['message' => 'Order added successfully']);
                } else {
                    echo json_encode(['error' => 'Failed to add order']);
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
