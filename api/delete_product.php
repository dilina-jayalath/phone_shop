<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: DELETE");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // Parse the DELETE request body to get the data
    parse_str(file_get_contents("php://input"), $_DELETE);
    $input = json_decode(file_get_contents('php://input'), true);
    $path = explode('/', $_SERVER['REQUEST_URI']);

    $id = $path[3] ??  null;
    $type = $path[4] ?? '';

    // Debug logging (optional - can be removed in production)
    error_log("Delete request - ID: $id, Type: $type");

    if ($id && $type) {
        // Delete product from the database
        $sql = "DELETE FROM $type WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            // Check if any rows were actually deleted
            $rowsAffected = $stmt->rowCount();
            if ($rowsAffected > 0) {
                echo json_encode(["message" => "Product deleted successfully."]);
            } else {
                echo json_encode(["error" => "Product not found or already deleted."]);
            }
        } else {
            echo json_encode(["error" => "Error deleting the product."]);
        }
    } else {
        echo json_encode(["error" => "Product ID and type are required."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method. Please use DELETE to remove a product."]);
}
?>
