
GRANT SELECT, INSERT, UPDATE, DELETE ON `SE_DB_1`.* TO 'app_user'@'%';

CREATE TABLE users( 
user_id int NOT NULL AUTO_INCREMENT, 
name VARCHAR(255) NOT NULL, 
email VARCHAR(255) NOT NULL, 
home_address VARCHAR(600), 
zip_code VARCHAR(15), 
city VARCHAR(60), 
state VARCHAR(60), 
PRIMARY KEY(user_id ), 
UNIQUE(email) 
);

Desc table users;


SELECT COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users';

SELECT constraint_name, column_name
FROM information_schema.key_column_usage
WHERE table_name = 'users' AND constraint_name = 'PRIMARY';


CREATE TABLE delivery_associates( 
associate_id int NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(associate_id), 
name CHAR(100) NOT NULL, 
email VARCHAR(255) NOT NULL, 
home_address VARCHAR(600), 
zip_code VARCHAR(15), 
city VARCHAR(60), 
state VARCHAR(60), 
UNIQUE(email) 
); 

CREATE TABLE restaurants( 
  restaurant_id int NOT NULL AUTO_INCREMENT, 
  name VARCHAR(255) NOT NULL, 
  email VARCHAR(255) NOT NULL, 
  phone_number VARCHAR(15) NOT NULL, 
  address VARCHAR(600) NOT NULL, 
  cuisine_type VARCHAR(50) NOT NULL, 
  rating ENUM('1', '2', '3', '4', '5'),  -- Enclose ENUM values in single quotes
  operating_hours VARCHAR(50), 
  is_active BOOLEAN, 
  PRIMARY KEY(restaurant_id), 
  UNIQUE(email), 
  UNIQUE(phone_number) 
);


CREATE TABLE chats( 
chat_id INT NOT NULL AUTO_INCREMENT, 
message VARCHAR(1000) NOT NULL, 
timestamp TIMESTAMP NOT NULL, 
user_id int NOT NULL, 
restaurant_id int NOT NULL, 
associate_id int NOT NULL, 
is_user BOOLEAN, 
is_system BOOLEAN, 
is_read BOOLEAN, 
is_delivered BOOLEAN, 
attachment_url VARCHAR(2083), 
metadata VARCHAR(500), 
PRIMARY KEY(chat_id), 
FOREIGN KEY(user_id) REFERENCES users(user_id), 
FOREIGN KEY(restaurant_id) REFERENCES restaurants(restaurant_id), FOREIGN KEY(associate_id) REFERENCES delivery_associates(associate_id) ); 



CREATE TABLE orders( 
order_id INT NOT NULL AUTO_INCREMENT, 
order_date DATETIME NOT NULL, 
estimated_delivery_time DATETIME NOT NULL, 
delivery_address VARCHAR(256) NOT NULL, 
special_instructions VARCHAR(256), 
total_amount FLOAT NOT NULL, 
user_id INT NOT NULL, 
restaurant_id INT NOT NULL, 
associate_id INT NOT NULL, 
PRIMARY KEY(order_id), 
FOREIGN KEY(user_id) REFERENCES users(user_id), 
FOREIGN KEY(restaurant_id) REFERENCES restaurants(restaurant_id), FOREIGN KEY(associate_id) REFERENCES 
delivery_associates(associate_id) 
); 


CREATE TABLE reviews( 
  review_id INT NOT NULL AUTO_INCREMENT, 
  review_title VARCHAR(100) NOT NULL, 
  description VARCHAR(256), 
  stars ENUM('1', '2', '3', '4', '5') NOT NULL, 
  media BLOB, 
  author_id INT NOT NULL, 
  restaurant_id INT NOT NULL, 
  date_created DATETIME NOT NULL, 
  PRIMARY KEY(review_id), 
  FOREIGN KEY(author_id) REFERENCES `users`(`user_id`), 
  FOREIGN KEY(restaurant_id) REFERENCES `restaurants`(`restaurant_id`)
);



CREATE TABLE menu( 
item_id INT NOT NULL AUTO_INCREMENT, 
item_name CHAR(100) NOT NULL, 
restaurant_id INT NOT NULL, 
description VARCHAR(200), 
price DECIMAL(10,2), 
spice_level ENUM ('1','2','3','4','5'), 
is_available BOOLEAN, 
category VARCHAR(100),
image_url VARCHAR(2083), 
is_featured BOOLEAN, 
PRIMARY KEY(item_id, restaurant_id), 
FOREIGN KEY(restaurant_id) REFERENCES restaurants(restaurant_id) );


CREATE TABLE orders_items( 
quantity INT NOT NULL, 
order_id INT NOT NULL, 
item_id INT NOT NULL, 
PRIMARY KEY(order_id,item_id), 
FOREIGN KEY(order_id) REFERENCES orders(user_id), 
FOREIGN KEY(item_id) REFERENCES menu(item_id) 
);


ALTER TABLE `SE_DB_1`.`users` 
ADD COLUMN `password` VARCHAR(45) NOT NULL AFTER `state`;

ALTER TABLE orders
ADD COLUMN `status` INT DEFAULT 0;

ALTER TABLE `SE_DB_1`.`users` 
CHANGE COLUMN `password` `password` VARCHAR(100) NOT NULL ;

SELECT table_name, column_name, data_type
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = 'SE_DB_1';

ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_3;
ALTER TABLE orders MODIFY associate_id INT NULL;


ALTER TABLE orders
ADD CONSTRAINT orders_ibfk_4
FOREIGN KEY (associate_id)
REFERENCES delivery_associates (associate_id);

ALTER TABLE reviews ADD response VARCHAR(256);

ALTER TABLE delivery_associates 
ADD column `lattitude`  VARCHAR(100) NOT NULL ; 

ALTER TABLE delivery_associates 
ADD column `longitude`  VARCHAR(100) NOT NULL ; 

ALTER TABLE delivery_associates
ADD COLUMN `delivery_in_progress` BOOLEAN;

ALTER TABLE delivery_associates
CHANGE `lattitude` `latitude` VARCHAR(100) NOT NULL;

ALTER TABLE delivery_associates
ADD column `password` VARCHAR(100);

ALTER TABLE restaurants
ADD column `password` VARCHAR(100);


