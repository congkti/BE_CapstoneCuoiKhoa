-- =============================================================
-- Bài tập Capstone BE NestJs - Prisma - MySQL: app_airbnb
-- Handler: Bùi Hữu Công - NodeJS 45 
-- =============================================================

-- 1. XÂY DỰNG CSDL:

-- 1.1. Create Database app_airbnb
CREATE DATABASE IF NOT EXISTS app_airbnb;
 
USE app_airbnb

-- 1.2. Create table roles & users
CREATE TABLE IF NOT EXISTS roles (
	role_id INT PRIMARY KEY AUTO_INCREMENT,
	role_name VARCHAR(100) NOT NULL UNIQUE,
	role_description VARCHAR(200),
	is_active BOOLEAN DEFAULT TRUE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	user_name VARCHAR(100) UNIQUE,
	
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	full_name VARCHAR(100),
	birth_day TIMESTAMP,
	avatar VARCHAR(255),
	phone VARCHAR(100),
	address VARCHAR(255),
	
	role_id INT NOT NULL DEFAULT 2,
	FOREIGN KEY (role_id) REFERENCES roles (role_id),

	is_deleted BOOLEAN DEFAULT FALSE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1.3. Create table "rental_home_types"
CREATE TABLE IF NOT EXISTS rental_home_types (
	type_id INT PRIMARY KEY AUTO_INCREMENT,
	type_name VARCHAR(100) NOT NULL UNIQUE,
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- 1.4. Create table "home_location" (search home by location)
CREATE TABLE IF NOT EXISTS home_location (
	loc_id INT PRIMARY KEY AUTO_INCREMENT,
	loc_name VARCHAR(255),
	loc_city VARCHAR(255) NOT NULL,
	loc_national VARCHAR(100) NOT NULL,
	loc_pic_url VARCHAR(255),
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- 1.5. Create table "homes"
CREATE TABLE IF NOT EXISTS homes (
	home_id INT PRIMARY KEY AUTO_INCREMENT,
	
	type_id INT,
	FOREIGN KEY (type_id) REFERENCES rental_home_types (type_id),
	loc_id INT,
	FOREIGN KEY (loc_id) REFERENCES home_location (loc_id),
	
	home_name VARCHAR(255) NOT NULL,
	home_description TEXT,
	home_price FLOAT,
	pic_url VARCHAR(255),
	
	-- Home Features/Amenities
	amount_guests INT,
	amount_bedrooms INT,
	amount_beds INT,
	amount_baths INT,
	
	has_hair_dryer BOOLEAN,
	has_washer BOOLEAN,
	has_clothes_dryer BOOLEAN,
	has_iron BOOLEAN,
	has_tivi BOOLEAN,
	has_air_cond BOOLEAN,
	has_wifi BOOLEAN,
	has_kitchen BOOLEAN,
	has_parking BOOLEAN,
	has_pool BOOLEAN,
	has_fireplace BOOLEAN,
	
	gmap_address VARCHAR(255),
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)


-- 1.6. Create table "book_homes"
CREATE TABLE IF NOT EXISTS book_homes (
	book_id INT PRIMARY KEY AUTO_INCREMENT,
	
	home_id INT,
	FOREIGN KEY (home_id) REFERENCES homes (home_id),
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	
	checkin_date TIMESTAMP NOT NULL,
	checkout_date TIMESTAMP NOT NULL,
	CHECK (checkout_date > checkin_date),
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- 1.7. Create table "comments"
CREATE TABLE IF NOT EXISTS comments (
	comment_id INT PRIMARY KEY AUTO_INCREMENT,
	
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	home_id INT,
	FOREIGN KEY (home_id) REFERENCES homes (home_id),
	
	comment_content TEXT NOT NULL,
	comment_rate TINYINT,
	CONSTRAINT Check_minmax CHECK(comment_rate BETWEEN 1 AND 5),
	-- comment_rate INT UNSIGNED CHECK(comment_rate BETWEEN 1 AND 5),
	
	is_deleted BOOLEAN DEFAULT FALSE,
	
	-- comment_date = created_at
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	
);


-- 2. INPUT FAKE DATA:
-- 2.1. Nhập ROLE user
INSERT IGNORE INTO roles (role_name, role_description ) VALUES
('ROLE_ADMIN', 'Quản trị viên'),
('ROLE_USER', 'Người dùng') 
ON DUPLICATE KEY UPDATE role_description = VALUES(role_description);

-- 2.2. Fake data for users với passwordHash (admin/123 | user/password123) (20 users)
INSERT INTO users (full_name, email, password, role_id, is_deleted) VALUES
('Admin', 'admin@gmail.com', '$2b$10$MtGr.i/YmFIMXzHV/QWfz.BaBJwu108X5Y5/ixzbo8qshAD9B/YWm', 1, FALSE),
('JohnDoe', 'john.doe@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('JaneSmith', 'jane.smith@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, TRUE),
('Alice Johnson', 'alice.johnson@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, TRUE),
('Bob Brown', 'bob.brown@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, TRUE),
('Charlie Davis', 'charlie.davis@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, TRUE),
('Daniel Evans', 'daniel.evans@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Emily White', 'emily.white@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Frank Harris', 'frank.harris@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Grace Lee', 'grace.lee@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, FALSE),
('Henry Scott', 'henry.scott@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Ivy King', 'ivy.king@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Jack Wilson', 'jack.wilson@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Karen Moore', 'karen.moore@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, FALSE),
('Leo Thomas', 'leo.thomas@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, FALSE),
('Mia Anderson', 'mia.anderson@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Nathan Young', 'nathan.young@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, FALSE),
('Olivia Martinez', 'olivia.martinez@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, FALSE),
('Paul Lewis', 'paul.lewis@example.com', '$2b$10$iLRpZLn.HviJb9ogU/Ezt.l/mh6cCocvYLbpLafjuUDIFRQzBpy1G', 2, FALSE),
('Quinn Hill', 'quinn.hill@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE),
('Rachel Baker', 'rachel.baker@example.com', '$2b$10$35PYXkco58.Q8t/weSzKruhCUOwNeCiAS4tRi6tjt1H2WXHd2L3IC', 2, FALSE);
('Công Bùi', 'cong1@gmail.com', '$2b$10$MtGr.i/YmFIMXzHV/QWfz.BaBJwu108X5Y5/ixzbo8qshAD9B/YWm', 1, FALSE),
('Công Bùi', 'cong2@gmail.com', '$2b$10$MtGr.i/YmFIMXzHV/QWfz.BaBJwu108X5Y5/ixzbo8qshAD9B/YWm', 2, FALSE),

-------------- update username cho tk admin id=1 -----
UPDATE users
SET user_name = 'congbui' WHERE user_id = 1;


				-- 2.1. Fake data for users (20 users)
				INSERT INTO users (full_name, email, password, role_id, is_deleted) VALUES
				('Công Bùi', 'cong@gmail.com', '123', 1, FALSE),
				('John Doe', 'john.doe@example.com', 'password123', 2, FALSE),
				('Jane Smith', 'jane.smith@example.com', 'password123', 2, FALSE),
				('Alice Johnson', 'alice.johnson@example.com', 'password123', 2, FALSE),
				('Bob Brown', 'bob.brown@example.com', 'password123', 2, FALSE),
				('Charlie Davis', 'charlie.davis@example.com', 'password123', 2, FALSE),
				('Daniel Evans', 'daniel.evans@example.com', 'password123', 2, FALSE),
				('Emily White', 'emily.white@example.com', 'password123', 2, FALSE),
				('Frank Harris', 'frank.harris@example.com', 'password123', 2, FALSE),
				('Grace Lee', 'grace.lee@example.com', 'password123', 2, FALSE),
				('Henry Scott', 'henry.scott@example.com', 'password123', 2, FALSE),
				('Ivy King', 'ivy.king@example.com', 'password123', 2, FALSE),
				('Jack Wilson', 'jack.wilson@example.com', 'password123', 2, FALSE),
				('Karen Moore', 'karen.moore@example.com', 'password123', 2, FALSE),
				('Leo Thomas', 'leo.thomas@example.com', 'password123', 2, FALSE),
				('Mia Anderson', 'mia.anderson@example.com', 'password123', 2, FALSE),
				('Nathan Young', 'nathan.young@example.com', 'password123', 2, FALSE),
				('Olivia Martinez', 'olivia.martinez@example.com', 'password123', 2, FALSE),
				('Paul Lewis', 'paul.lewis@example.com', 'password123', 2, FALSE),
				('Quinn Hill', 'quinn.hill@example.com', 'password123', 2, FALSE),
				('Rachel Baker', 'rachel.baker@example.com', 'password123', 2, FALSE);
				

-- 2.3. Fake data for "rental_home_types"
INSERT IGNORE INTO rental_home_types (type_name) VALUES
('Room'),
('Farm stay'),
('Home stay'),
('Entire villa'),
('Entire rental unit'),
('Entire condo'),
('Entire house'),
('Earthen home'),
('Treehouse'),
('Entire cottage'),
('Private room'),
('Private home'),
('Hut'),
('Tiny home'),
('Houseboat'),
('Entire bungalow'),
('Hotel room'),
('Entire mansion'),
('Entire vacation home'),
('Cycladic home'),
('Entire cabin'),
('Windmill house'),
('Campsite'),
('Entire place'),
('Tent');

-- 2.4. Fake data for "home_location"
INSERT INTO home_location (loc_name, loc_city, loc_national, loc_pic_url) VALUES
('District 1', 'Ho Chi Minh City', 'Vietnam', 'upload/location/vietnam/district1.png'),
('Old Quarter', 'Hanoi', 'Vietnam', 'upload/location/vietnam/old_quarter.png'),
('My Khe Beach', 'Da Nang', 'Vietnam', 'upload/location/vietnam/my_khe.png'),
('Nha Trang Bay', 'Nha Trang', 'Vietnam', 'upload/location/vietnam/nha_trang.png'),
('Sapa Town', 'Lao Cai', 'Vietnam', 'upload/location/vietnam/sapa.png'),
('Ba Na Hills', 'Da Nang', 'Vietnam', 'upload/location/vietnam/ba_na.png'),
('Mui Ne Beach', 'Phan Thiet', 'Vietnam', 'upload/location/vietnam/mui_ne.png'),
('Cai Rang Floating Market', 'Can Tho', 'Vietnam', 'upload/location/vietnam/cai_rang.png'),
('Trang An', 'Ninh Binh', 'Vietnam', 'upload/location/vietnam/trang_an.png'),
('Lan Ha Bay', 'Hai Phong', 'Vietnam', 'upload/location/vietnam/lan_ha.png'),
('Central Park', 'New York', 'USA', 'upload/location/usa/central_park.png'),
('Shibuya', 'Tokyo', 'Japan', 'upload/location/japan/shibuya.png'),
('Eiffel Tower', 'Paris', 'France', 'upload/location/france/eiffel_tower.png'),
('Bondi Beach', 'Sydney', 'Australia', 'upload/location/australia/bondi.png'),
('Santorini', 'Cyclades', 'Greece', 'upload/location/greece/santorini.png'),
('Alhambra', 'Granada', 'Spain', 'upload/location/spain/alhambra.png'),
('Big Ben', 'London', 'UK', 'upload/location/uk/big_ben.png'),
('Niagara Falls', 'Ontario', 'Canada', 'upload/location/canada/niagara.png'),
('Mount Fuji', 'Yamanashi', 'Japan', 'upload/location/japan/fuji.png'),
('Golden Gate', 'San Francisco', 'USA', 'upload/location/usa/golden_gate.png');

-- 2.5. Fake data for "homes"
INSERT INTO homes (
	type_id, loc_id, home_name, home_description, home_price, pic_url, 
	amount_guests, amount_bedrooms, amount_beds, amount_baths, 
	has_hair_dryer, has_washer, has_clothes_dryer, has_iron, has_tivi, has_air_cond, 
	has_wifi, has_kitchen, has_parking, has_pool, has_fireplace, 
	gmap_address
) VALUES
(1, 1, 'Sunny Villa', 'A cozy villa with stunning views.', 100.5, 'upload/homes/sunny_villa.png', 
4, 2, 2, 1, 
TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, 
TRUE, TRUE, TRUE, TRUE, FALSE, 
'123 Main St, Hanoi, Vietnam'),
(2, 2, 'Luxury Condo', 'Modern condo in the city center.', 150.75, 'upload/homes/luxury_condo.png', 
2, 1, 1, 1, 
FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, 
TRUE, FALSE, FALSE, TRUE, TRUE, 
'45 Nguyen Trai St, Ho Chi Minh City, Vietnam'),
(3, 3, 'Peaceful Retreat', 'A quiet home surrounded by nature.', 80.25, 'upload/homes/peaceful_retreat.png', 
6, 3, 3, 2, 
TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 
TRUE, TRUE, TRUE, FALSE, TRUE, 
'Green Valley, Da Lat, Vietnam'),
(4, 4, 'Modern Apartment', 'Stylish apartment in a bustling city.', 120.00, 'upload/homes/modern_apartment.png', 
3, 1, 2, 1, 
FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, 
TRUE, TRUE, FALSE, TRUE, FALSE, 
'12 Nguyen Hue St, Da Nang, Vietnam'),
(5, 5, 'Rustic Cabin', 'A charming cabin perfect for a getaway.', 95.00, 'upload/homes/rustic_cabin.png', 
5, 2, 3, 1, 
TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, 
TRUE, FALSE, TRUE, FALSE, TRUE, 
'Forest Hills, Sapa, Vietnam'),
(6, 6, 'Beachfront Bungalow', 'A beautiful home right on the beach.', 200.00, 'upload/homes/beachfront_bungalow.png', 
4, 2, 2, 2, 
TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, 
TRUE, TRUE, TRUE, TRUE, TRUE, 
'Sunny Beach, Nha Trang, Vietnam'),
(7, 7, 'Treehouse Escape', 'Unique treehouse with stunning views.', 85.50, 'upload/homes/treehouse_escape.png', 
2, 1, 1, 1, 
FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, 
TRUE, FALSE, TRUE, FALSE, TRUE, 
'Rainforest Retreat, Phu Quoc, Vietnam'),
(8, 8, 'City Loft', 'A cozy loft in the heart of the city.', 110.25, 'upload/homes/city_loft.png', 
2, 1, 1, 1, 
FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, 
TRUE, TRUE, FALSE, TRUE, FALSE, 
'Central Plaza, Hanoi, Vietnam'),
(9, 9, 'Mountain Chalet', 'A luxurious chalet in the mountains.', 250.75, 'upload/homes/mountain_chalet.png', 
8, 4, 4, 3, 
TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 
TRUE, TRUE, TRUE, TRUE, TRUE, 
'High Peaks, Sapa, Vietnam'),
(10, 10, 'Luxury Villa', 'A high-end villa with premium amenities.', 300.00, 'upload/homes/luxury_villa.png', 
10, 5, 5, 4, 
TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 
TRUE, TRUE, TRUE, TRUE, TRUE, 
'Beverly Hills, Los Angeles, USA');


-- 2.5. Fake data for "book_homes"
INSERT INTO book_homes (home_id, user_id, checkin_date, checkout_date) VALUES
(1, 2, '2025-01-15 14:00:00', '2025-01-18 12:00:00'),
(3, 5, '2025-02-10 14:00:00', '2025-02-15 12:00:00'),
(5, 8, '2025-03-01 14:00:00', '2025-03-07 12:00:00'),
(7, 3, '2025-01-20 14:00:00', '2025-01-23 12:00:00'),
(10, 6, '2025-02-01 14:00:00', '2025-02-05 12:00:00');

-- 2.4. Fake data for "comments"
INSERT INTO comments (user_id, home_id, comment_content, comment_rate) VALUES
(2, 1, 'Fantastic location and amazing service!', 5),
(3, 3, 'Beautiful villa with great amenities.', 4),
(5, 5, 'The view of the Eiffel Tower was breathtaking!', 5),
(6, 7, 'Very cozy and convenient for a short stay.', 4),
(8, 10, 'The home was clean and well-maintained.', 5),
(2, 9, 'Loved the eco-friendly design of the lodge.', 4),
(3, 4, 'The location was perfect for exploring the city.', 5),
(5, 2, 'Peaceful retreat with stunning mountain views.', 5),
(6, 8, 'Family-friendly and spacious.', 4),
(8, 6, 'Highly recommend for a relaxing vacation.', 5);





-- **************************************************************************
-- ***************** CÁC QUERY ĐỂ QUẢN LÝ, BẢO TRÌ DATABASE *****************
-- **************************************************************************

-------Cập nhật thêm các trường user_name, first/last_name...
UPDATE users
SET first_name = SUBSTRING(full_name, 1, LOCATE(' ', full_name) - 1),
    last_name = SUBSTRING(full_name, LOCATE(' ', full_name) + 1);
    
-- update có check case full_name ko có khoảng trắng -> first_name = full_name | last_name = null
UPDATE users
SET first_name = IF(LOCATE(' ', full_name) > 0, SUBSTRING(full_name, 1, LOCATE(' ', full_name) - 1), full_name),
    last_name = IF(LOCATE(' ', full_name) > 0, SUBSTRING(full_name, LOCATE(' ', full_name) + 1), NULL);
    
-- Tạo full_name nối từ first_năm + last_name
UPDATE users
SET full_name = CONCAT(first_name, '-', last_name);
    
-- tạo user_name: nối từ first_name, last_name
UPDATE users
SET user_name = LOWER(CONCAT(first_name, '-', last_name));

		-- có xét rỗng ------
		UPDATE users
		SET user_name = LOWER(IF( (first_name IS NULL OR TRIM(first_name) = '') AND (last_name IS NULL OR TRIM(last_name) = '') , CONCAT('user-', user_id),
									IF(first_name IS NULL OR TRIM(first_name)='', CONCAT(last_name, '-', user_id),
							   		 IF(last_name IS NULL OR TRIM(last_name)='', CONCAT(first_name, '-', user_id),
								     	CONCAT(first_name, '-', last_name)
							) ) ) );

-- tạo user_name: từ full_name
UPDATE users
SET user_name = LOWER(REPLACE(full_name,' ','-'));


-- xóa dữ liệu từng cột
UPDATE users
SET user_name = NULL;

UPDATE users
SET avatar = NULL;

UPDATE users
SET first_name = NULL,
	last_name = NULL;

UPDATE users
SET full_name = NULL;

UPDATE users
SET avatar = NULL,
	user_bio = NULL,
	user_web = NULL;

---------------------------------- Tạo Stored Procedure: remove dấu tiếng việt (chạy 1 lần để tạo Function) ---------------------------
DELIMITER $$

CREATE PROCEDURE RemoveVietnameseDiacritics()
BEGIN
    UPDATE users
    SET user_name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    REPLACE(user_name, 'à', 'a'), 'á', 'a'), 'ạ', 'a'), 
                    'ả', 'a'), 'ã', 'a'), 'â', 'a'), 'ầ', 'a'),
                    'ấ', 'a'), 'ậ', 'a'), 'ẩ', 'a'), 'ẫ', 'a'),
                    'ă', 'a'), 'ằ', 'a'), 'ắ', 'a'), 'ặ', 'a'),
                    'ẳ', 'a'), 'ẵ', 'a'), 'è', 'e'), 'é', 'e'),
                    'ẹ', 'e'), 'ẻ', 'e'), 'ẽ', 'e'), 'ê', 'e'),
                    'ề', 'e'), 'ế', 'e'), 'ệ', 'e'), 'ể', 'e'),
                    'ễ', 'e'), 'ì', 'i'), 'í', 'i'), 'ị', 'i'),
                    'ỉ', 'i'), 'ĩ', 'i'), 'ò', 'o'), 'ó', 'o'),
                    'ọ', 'o'), 'ỏ', 'o'), 'õ', 'o'), 'ô', 'o'),
                    'ồ', 'o'), 'ố', 'o'), 'ộ', 'o'), 'ổ', 'o'),
                    'ỗ', 'o'), 'ơ', 'o'), 'ờ', 'o'), 'ớ', 'o'),
                    'ợ', 'o'), 'ở', 'o'), 'ỡ', 'o'), 'ù', 'u'),
                    'ú', 'u'), 'ụ', 'u'), 'ủ', 'u'), 'ũ', 'u'),
                    'ư', 'u'), 'ừ', 'u'), 'ứ', 'u'), 'ự', 'u'),
                    'ử', 'u'), 'ữ', 'u'), 'ỳ', 'y'), 'ý', 'y'),
                    'ỵ', 'y'), 'ỷ', 'y'), 'ỹ', 'y'), 'đ', 'd');
END$$

DELIMITER ;
--- END Stored Procedure -------

------Chạy Hàm Stored Procedure -----
CALL RemoveVietnameseDiacritics();


-- TẠO EVENT ĐỊNH KỲ ĐỂ TỰ ĐỘNG XÓA BẢNG GHI CÓ TRẠNG THÁI is_deleted = true SAU ?? NGÀY
-- kiểm tra Event Scheduler đã bật chưa
SHOW VARIABLES LIKE 'event_scheduler';
-- nếu chưa bật -> bật
SET GLOBAL event_scheduler = ON;

-- Tạo event: xóa user có trạng thái is_deleted = TRUE quá 30 ngày
CREATE EVENT IF NOT EXISTS delete_old_users
ON SCHEDULE EVERY 1 DAY -- Chạy mỗi ngày một lần
STARTS CURRENT_TIMESTAMP -- Bắt đầu từ thời điểm hiện tại
DO
BEGIN
    DELETE FROM users
    WHERE is_deleted = TRUE
      AND updated_at < NOW() - INTERVAL 30 DAY;
END;

-- kiểm tra event đã được tạo chưa
SHOW EVENTS;

-- xóa event
DROP EVENT IF EXISTS delete_old_users;





