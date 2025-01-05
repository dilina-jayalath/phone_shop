
<?php
// Allow CORS
header("Access-Control-Allow-Origin: *"); // Replace * with specific origin if needed
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

// Include database connection
include 'DbConnect.php';

$objDb = new DbConnect();
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {

    case "GET":
        $sql = "SELECT * FROM repairs";
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
        isset($input['deviceType']) &&
        isset($input['deviceName']) &&
        isset($input['issue'])&&
        isset($input['userId'])
    ) {
        $deviceType = htmlspecialchars($input['deviceType']);
        $deviceName = htmlspecialchars($input['deviceName']);
        $contact = htmlspecialchars($input['contact']);
        $issue = htmlspecialchars($input['issue']);
        $notes = isset($input['notes']) ? htmlspecialchars($input['notes']) : '';
        $created_at = date('Y-m-d');
        $userId = $input['userId'];

        // Prepare SQL statement
        $sql = "INSERT INTO repairs (userId ,device_type, deviceName, contact ,  issue, notes, created_at) 
                VALUES (:userId,:deviceType, :deviceName,:contact, :issue, :notes, :created_at)";
        $stmt = $conn->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':deviceType', $deviceType);
        $stmt->bindParam(':contact', $contact);
        $stmt->bindParam(':deviceName', $deviceName);
        $stmt->bindParam(':issue', $issue);
        $stmt->bindParam(':notes', $notes);
        $stmt->bindParam(':created_at', $created_at);
        $stmt->bindParam(':userId', $userId);


        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Repair added successfully']);
        } else {
            echo json_encode(['error' => 'Failed to add repair']);
        }
    } else {
        echo json_encode(['error' => 'Invalid input']);
    }
    break;

    
    case "PUT":
        $user = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE repairs SET `status`= :status WHERE id = :id";
    
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
        $sql = "DELETE FROM repairs WHERE id = :id";
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
