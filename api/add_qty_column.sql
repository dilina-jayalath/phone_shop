-- SQL script to add qty field to all product tables
-- Run this script in your MySQL database

-- Add qty column to phones table
ALTER TABLE phones ADD COLUMN qty INT DEFAULT 0;

-- Add qty column to tablets table  
ALTER TABLE tablets ADD COLUMN qty INT DEFAULT 0;

-- Add qty column to watches table
ALTER TABLE watches ADD COLUMN qty INT DEFAULT 0;

-- Add qty column to accessories table
ALTER TABLE accessories ADD COLUMN qty INT DEFAULT 0;

-- Optional: Update existing records to have a default quantity
UPDATE phones SET qty = 10 WHERE qty IS NULL;
UPDATE tablets SET qty = 10 WHERE qty IS NULL;
UPDATE watches SET qty = 10 WHERE qty IS NULL;
UPDATE accessories SET qty = 10 WHERE qty IS NULL;