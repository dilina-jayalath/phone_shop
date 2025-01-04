<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'] ?? null;
    $productName = $_POST['productName'] ?? '';
    $price = floatval($_POST['price'] ?? 0);
    $color = $_POST['color'] ?? '';
    $type = $_POST['type'] ?? '';
    $condition = $_POST['condition'] ?? '';
    $availability = $_POST['availability'] ?? '';
    $description = $_POST['description'] ?? '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        $imageName = $_FILES["image"]["name"];
        $tmpName = $_FILES["image"]["tmp_name"];
        $imageExtension = pathinfo($imageName, PATHINFO_EXTENSION);
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (in_array(strtolower($imageExtension), $allowedTypes)) {
            if (!move_uploaded_file($tmpName, './products/' . $imageName)) {
                echo json_encode(["error" => "Error uploading the image."]);
                exit;
            }
            $sql = "UPDATE $type SET imageName = :imageName WHERE id = :id";
    
            $stmt = $conn->prepare($sql);
    
            $stmt->bindParam(':imageName', $imageName);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Product image name updated successfully."]);
            } else {
                echo json_encode(["error" => "Error image name updating the product."]);
            }
        } else {
            echo json_encode(["error" => "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."]);
            exit;
        }


    }

    if ($id) {
        $sql = "UPDATE $type SET 
                    productName = :productName, 
                    price = :price, 
                    color = :color, 
                    `condition` = :condition, 
                    availability = :availability, 
                    description = :description 
                WHERE id = :id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productName', $productName);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':color', $color);
        $stmt->bindParam(':condition', $condition);
        $stmt->bindParam(':availability', $availability);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':id', $id);
        

        if ($stmt->execute()) {
            echo json_encode(["message" => "Product updated successfully."]);
        } else {
            echo json_encode(["error" => "Error updating the product."]);
        }
    } else {
        echo json_encode(["error" => "Product ID is required."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method. Please use POST to update a product."]);
}
?>
