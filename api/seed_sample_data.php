<?php
// Sample data seeder for testing reports
include 'DbConnect.php';

$objDb = new DbConnect();
$conn = $objDb->connect();

// Add sample orders
$sampleOrders = [
    [
        'userId' => 1,
        'contact' => '123-456-7890',
        'details' => 'iPhone 15 Pro, Blue, 256GB',
        'price' => 1199.99,
        'location' => 'New York, NY',
        'created_at' => '2025-09-20'
    ],
    [
        'userId' => 2,
        'contact' => '987-654-3210',
        'details' => 'Samsung Galaxy Tab S9, Silver, 128GB',
        'price' => 799.99,
        'location' => 'Los Angeles, CA',
        'created_at' => '2025-09-19'
    ],
    [
        'userId' => 3,
        'contact' => '555-123-4567',
        'details' => 'Apple Watch Series 9, Black, 45mm',
        'price' => 429.99,
        'location' => 'Chicago, IL',
        'created_at' => '2025-09-18'
    ],
    [
        'userId' => 1,
        'contact' => '123-456-7890',
        'details' => 'AirPods Pro 2nd Gen, White',
        'price' => 249.99,
        'location' => 'New York, NY',
        'created_at' => '2025-09-17'
    ],
    [
        'userId' => 4,
        'contact' => '444-555-6666',
        'details' => 'iPad Air, Space Gray, 256GB',
        'price' => 749.99,
        'location' => 'Miami, FL',
        'created_at' => '2025-09-16'
    ]
];

$orderSql = "INSERT INTO orders (userId, contact, details, price, location, created_at) 
             VALUES (:userId, :contact, :details, :price, :location, :created_at)";

foreach ($sampleOrders as $order) {
    $stmt = $conn->prepare($orderSql);
    foreach ($order as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }
    
    if ($stmt->execute()) {
        echo "Added order: " . $order['details'] . "\n";
    } else {
        echo "Failed to add order: " . $order['details'] . "\n";
    }
}

// Add sample repairs
$sampleRepairs = [
    [
        'userId' => 1,
        'device_type' => 'phone',
        'deviceName' => 'iPhone 14',
        'contact' => '123-456-7890',
        'issue' => 'Cracked Screen',
        'notes' => 'Front screen completely shattered',
        'created_at' => '2025-09-20'
    ],
    [
        'userId' => 2,
        'device_type' => 'tablet',
        'deviceName' => 'iPad Pro',
        'contact' => '987-654-3210',
        'issue' => 'Battery Not Charging',
        'notes' => 'Battery drains quickly and won\'t charge',
        'created_at' => '2025-09-19'
    ],
    [
        'userId' => 3,
        'device_type' => 'watch',
        'deviceName' => 'Apple Watch Series 8',
        'contact' => '555-123-4567',
        'issue' => 'Water Damage',
        'notes' => 'Dropped in swimming pool',
        'created_at' => '2025-09-18'
    ],
    [
        'userId' => 4,
        'device_type' => 'phone',
        'deviceName' => 'Samsung Galaxy S23',
        'contact' => '444-555-6666',
        'issue' => 'Software Issues',
        'notes' => 'Phone keeps freezing and restarting',
        'created_at' => '2025-09-17'
    ]
];

$repairSql = "INSERT INTO repairs (userId, device_type, deviceName, contact, issue, notes, created_at) 
              VALUES (:userId, :device_type, :deviceName, :contact, :issue, :notes, :created_at)";

foreach ($sampleRepairs as $repair) {
    $stmt = $conn->prepare($repairSql);
    foreach ($repair as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }
    
    if ($stmt->execute()) {
        echo "Added repair: " . $repair['deviceName'] . " - " . $repair['issue'] . "\n";
    } else {
        echo "Failed to add repair: " . $repair['deviceName'] . "\n";
    }
}

echo "\nSample data seeding completed!\n";
echo "You can now test the Sales Reports with real data.\n";
?>