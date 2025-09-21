<?php
// Script to fix availability based on quantity
// Run this once to update existing products where qty > 0 but availability = "no"

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

try {
    $updatedCount = 0;
    $tables = ['phones', 'tablets', 'watches', 'accessories'];
    
    foreach ($tables as $table) {
        // Update availability to "yes" where qty > 0 but availability = "no"
        $sql = "UPDATE $table SET availability = 'yes' WHERE qty > 0 AND availability = 'no'";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $updatedCount += $stmt->rowCount();
        
        // Update availability to "no" where qty = 0 but availability = "yes"
        $sql2 = "UPDATE $table SET availability = 'no' WHERE qty = 0 AND availability = 'yes'";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->execute();
        $updatedCount += $stmt2->rowCount();
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Fixed availability for $updatedCount products",
        'updatedCount' => $updatedCount
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>