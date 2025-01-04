<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case "GET":
        $sql = "SELECT * FROM users";
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
        $input = json_decode(file_get_contents('php://input'), true);
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[3]) && $path[3] === 'signup') {
            
            $name = $input['name'] ?? '';
            $email = $input['email'] ?? '';
            $phone = $input['phone'] ?? '';
            $password = $input['password'] ?? '';
            $address = $input['address'] ?? '';
            $city = $input['city'] ?? '';
            $country = $input['country'] ?? '';
            $zip = $input['zip'] ?? '';

            

            if ($name && $email && $password && $phone && $address && $city && $country && $zip) {
                // Check if email already exists
                $checkSql = "SELECT * FROM users WHERE email = :email";
                $checkStmt = $conn->prepare($checkSql);
                $checkStmt->bindParam(':email', $email);
                $checkStmt->execute();
                if ($checkStmt->rowCount() > 0) {
                    $response = ['status' => 0, 'message' => 'Email already exists.'];
                } else {
                    $created_at = date('Y-m-d');
                    $sql = "INSERT INTO users (name, email, password, phone, address, city, country, zip, created_at) VALUES (:name, :email, :password, :phone, :address, :city, :country, :zip, :created_at)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':name', $name);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':password', $password);
                    $stmt->bindParam(':phone', $phone);
                    $stmt->bindParam(':address', $address);
                    $stmt->bindParam(':city', $city);
                    $stmt->bindParam(':country', $country);
                    $stmt->bindParam(':zip', $zip);
                    $stmt->bindParam(':created_at', $created_at);

                    if ($stmt->execute()) {
                        $response = ['status' => 1, 'message' => 'User registered successfully.'];
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to register user.'];
                    }
                }
            } else {
                $response = ['status' => 0, 'message' => 'Invalid input.'];
            }
            echo json_encode($response);
        } elseif (isset($path[3]) && $path[3] === 'signin') {
            // Signin logic
        $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            if ($email && $password) {
                $sql = "SELECT * FROM users WHERE email = :email";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':email', $email);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user && ($password == $user['password'])) {
                    // Generate a token (for simplicity, using base64 encoding; consider using JWT for production)
                    $token = base64_encode(random_bytes(32));
                    // Store the token in the database with an expiration date (optional)
                    $response = ['status' => 1, 'message' => 'Login successful.', 'token' => $token , 'data' => $user];
                } else {
                    $response = ['status' => 0, 'message' => 'Invalid email or password.'];
                }
            } else {
                $response = ['status' => 0, 'message' => 'Invalid input.'];
            }
            echo json_encode($response);
        } else {
            // Existing POST logic for other operations
        }
        break;


    case "PUT":
        $user = json_decode( file_get_contents('php://input') );
        $sql = "UPDATE users SET name= :name, email =:email, phone =:phone, updated_at =:updated_at WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id', $user->id);
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':phone', $user->phone);
        $stmt->bindParam(':updated_at', $updated_at);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case "DELETE":
        $sql = "DELETE FROM users WHERE id = :id";
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
}