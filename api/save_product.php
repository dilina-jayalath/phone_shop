<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

// Set the response header to JSON
header('Content-Type: application/json');

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form inputs
    $productName = $_POST['productName'] ?? '';
    $price = floatval($_POST['price'] ?? 0);
    $color = $_POST['color'] ?? '';
    $type = $_POST['type'] ?? '';
    $condition = $_POST['condition'] ?? '';
    $availability = $_POST['availability'] ?? '';
    $description = $_POST['description'] ?? '';

    // Check if an image file is uploaded
    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        $imageName = $_FILES["image"]["name"];
        $tmpName = $_FILES["image"]["tmp_name"];
        $imageExtension = pathinfo($imageName, PATHINFO_EXTENSION);
        $newImageName = uniqid() . '.' . $imageExtension;

        // Validate file type (allow only JPG, JPEG, PNG, GIF)
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (in_array(strtolower($imageExtension), $allowedTypes)) {
            // Move the uploaded file to the products directory
            if (move_uploaded_file($tmpName, './products/' . $newImageName)) {
                // Prepare SQL statement to insert product data

                $sql = "INSERT INTO $type (productName, imageName, price, color, `condition`, availability, description) 
                        VALUES (:productName, :imageName, :price, :color, :condition, :availability, :description)";
                $stmt = $conn->prepare($sql);

                // Bind parameters
                $stmt->bindParam(':productName', $productName);
                $stmt->bindParam(':imageName', $newImageName);
                $stmt->bindParam(':price', $price);
                $stmt->bindParam(':color', $color);
                $stmt->bindParam(':condition', $condition);
                $stmt->bindParam(':availability', $availability);
                $stmt->bindParam(':description', $description);

                // Execute the statement
                if ($stmt->execute()) {
                    echo json_encode(["message" => "Product added successfully."]);
                } else {
                    echo json_encode(["error" => "Error: Unable to save the product."]);
                }
            } else {
                echo json_encode(["error" => "Error uploading the image."]);
            }
        } else {
            echo json_encode(["error" => "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."]);
        }
    } else {
        echo json_encode(["error" => "Please upload an image."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method. Please use POST to save a product."]);
}
?>
