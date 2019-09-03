DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INTEGER
    AUTO_INCREMENT PRIMARY KEY,
   product_name VARCHAR
    (200) NOT NULL, 
   department_name VARCHAR
    (100),
   price DECIMAL NOT NULL, 
   stock_quantity INTEGER NOT NULL
);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("BERATEK INDUSTRIES Power Perch", "Healthcare", 8.99, 20),
        ("SG SUGU Crossbody Bag with Tassel", "Fashion", 19.85, 10),
        ("AMAZONBASICS Microfiber Sheet Set", "Healthcare", 19.99, 50),
        ("REVLON One-Step Hair Dryer & Volumizer", "Healthcare", 45.98, 5),
        ("LINENSPA All-Season Quilted Comforter", "Bedding", 30.00, 14),
        ("TIJN Blue Light Blocking Glasses", "Fashion", 16.99, 2),
        ("TRAVELAMBO RFID Blocking Wallet", "Fashion", 19.99, 100),
        ("AMAZONBASICS Silicone Baking Matt", "Cooking", 9.62, 200),
        ("MAXSOFT Scalp Care Brush", "Healthcare", 6.98, 21),
        ("GORILLA GRIP Bath Pillow", "Bedding", 15.99, 29)




