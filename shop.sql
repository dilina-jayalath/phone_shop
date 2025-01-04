-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 04, 2025 at 05:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `accessories`
--

CREATE TABLE `accessories` (
  `id` int(11) NOT NULL,
  `productName` varchar(64) NOT NULL,
  `imageName` varchar(64) NOT NULL,
  `price` double NOT NULL,
  `color` varchar(64) NOT NULL,
  `condition` char(5) DEFAULT NULL,
  `availability` char(5) NOT NULL,
  `description` varchar(64) NOT NULL,
  `type` varchar(64) DEFAULT 'accessories'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `details` varchar(255) NOT NULL,
  `price` varchar(128) NOT NULL,
  `status` varchar(128) NOT NULL DEFAULT 'Order Placed',
  `created_at` date NOT NULL,
  `location` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `userId`, `details`, `price`, `status`, `created_at`, `location`) VALUES
(7, 'dilina@gmail.com', '[{\"name\":\"test\",\"quantity\":1,\"color\":\"test\"},{\"name\":\"testTabl\",\"quantity\":1,\"color\":\"testTabl\"}]', '3733', 'Out for Delivery', '2025-01-03', 'Colombo'),
(9, 'dilina@gmail.com', '[{\"name\":\"test\",\"quantity\":1,\"color\":\"test\"}]', '1511', 'Out for Delivery', '2025-01-03', 'Colombo'),
(11, 'dilina1@gmail.com', '[{\"name\":\"testTabl\",\"quantity\":1,\"color\":\"testTabl\"}]', '2622', 'Order Placed', '2025-01-03', 'Colombo'),
(13, 'diliya12a1@gmail.com', '[{\"name\":\"test\",\"quantity\":1,\"color\":\"test\"}]', '1511', 'In Transit', '2025-01-04', 'abc');

-- --------------------------------------------------------

--
-- Table structure for table `phones`
--

CREATE TABLE `phones` (
  `id` int(11) NOT NULL,
  `productName` varchar(64) NOT NULL,
  `imageName` varchar(64) NOT NULL,
  `price` double NOT NULL,
  `color` varchar(64) NOT NULL,
  `condition` char(5) DEFAULT NULL,
  `availability` char(5) NOT NULL,
  `description` varchar(64) NOT NULL,
  `type` varchar(64) DEFAULT 'phones'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repairs`
--

CREATE TABLE `repairs` (
  `id` int(11) NOT NULL,
  `device_type` varchar(64) NOT NULL,
  `deviceName` varchar(64) NOT NULL,
  `issue` varchar(255) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `userId` varchar(64) NOT NULL,
  `status` varchar(64) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tablets`
--

CREATE TABLE `tablets` (
  `id` int(11) NOT NULL,
  `productName` varchar(64) NOT NULL,
  `imageName` varchar(64) NOT NULL,
  `price` double NOT NULL,
  `color` varchar(64) NOT NULL,
  `condition` char(5) DEFAULT NULL,
  `availability` char(5) NOT NULL,
  `description` varchar(64) NOT NULL,
  `type` varchar(64) DEFAULT 'tablets'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(225) NOT NULL,
  `email` varchar(225) NOT NULL,
  `password` varchar(256) NOT NULL,
  `phone` varchar(225) NOT NULL,
  `address` varchar(256) NOT NULL,
  `city` varchar(225) NOT NULL,
  `country` varchar(225) NOT NULL,
  `zip` varchar(225) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `watches`
--

CREATE TABLE `watches` (
  `id` int(11) NOT NULL,
  `productName` varchar(64) NOT NULL,
  `imageName` varchar(64) NOT NULL,
  `price` double NOT NULL,
  `color` varchar(64) NOT NULL,
  `condition` char(5) DEFAULT NULL,
  `availability` char(5) NOT NULL,
  `description` varchar(64) NOT NULL,
  `type` varchar(64) DEFAULT 'watches'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accessories`
--
ALTER TABLE `accessories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Indexes for table `phones`
--
ALTER TABLE `phones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repairs`
--
ALTER TABLE `repairs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tablets`
--
ALTER TABLE `tablets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `watches`
--
ALTER TABLE `watches`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accessories`
--
ALTER TABLE `accessories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `phones`
--
ALTER TABLE `phones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `repairs`
--
ALTER TABLE `repairs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tablets`
--
ALTER TABLE `tablets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `watches`
--
ALTER TABLE `watches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
