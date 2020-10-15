-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: localhost    Database: delilah_resto
-- ------------------------------------------------------
-- Server version	8.0.21-0ubuntu0.20.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP DATABASE IF EXISTS delilah_resto;
CREATE DATABASE delilah_resto;
USE delilah_resto;

--
-- Table structure for table users
--

DROP TABLE IF EXISTS users;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE users
(
  user_id int NOT NULL
  AUTO_INCREMENT,
  username varchar
  (60) NOT NULL,
  password varchar
  (60) NOT NULL,
  full_name varchar
  (60) NOT NULL,
  email varchar
  (60) NOT NULL,
  phone int NOT NULL,
  delivery_address varchar
  (60) NOT NULL,
  is_admin tinyint
  (1) NOT NULL DEFAULT '0',
  is_disabled tinyint
  (1) DEFAULT '0',
  PRIMARY KEY
  (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table users
--

LOCK TABLES users WRITE;
/*!40000 ALTER TABLE users DISABLE KEYS */;
  INSERT INTO 
users
  VALUES
    (1, 'Adriana', 'adr123', 'Adriana Ariza', 'adr@123.com', 5876241, 'calle123', 1, 0),
    (2, 'Sergiooo', 'rser123', 'Sergio Camilo Zamudio', 'ser888@123.com', 4786925, 'avenida 854', 0, 0),
    (3, 'Valentino', 'val123', 'Valentino Ariza', 'val@123.com', 8234516, 'calle123', 0, 0),
    (8, 'pepa', 'pepo123', 'pepa rojas', 'pepo@123.com', 4585756, 'calle 123', 0, 0);
  /*!40000 ALTER TABLE users ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table products
  --

  DROP TABLE IF EXISTS products;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE products
  (
    product_id int NOT NULL
    AUTO_INCREMENT,
  name varchar
    (60) NOT NULL,
  price float NOT NULL,
  is_disabled tinyint
    (1) DEFAULT '0',
  PRIMARY KEY
    (product_id)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table products
--

LOCK TABLES products WRITE;
/*!40000 ALTER TABLE products DISABLE KEYS */;
    INSERT INTO 
products
    VALUES
      (2, 'Caldo de Costilla', 8000, 0),
      (3, 'Hamburguesa de la Casa', 25000, 0),
      (4, 'Hamburguesa Vegetariana', 25000, 0),
      (6, 'Pizza Personal', 18000, 0),
      (7, 'Empanadas', 2000, 0),
      (8, 'Nachos', 25000, 0),
      (9, 'Ajiaco', 25000, 0),
      (10, 'Arepa Rellena', 14000, 0),
      (11, 'Changua', 8600, 0);
    /*!40000 ALTER TABLE products ENABLE KEYS */;
    UNLOCK TABLES;


    --
    -- Table structure for table orders
    --
    DROP TABLE IF EXISTS orders;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!50503 SET character_set_client = utf8mb4 */;
    CREATE TABLE orders
    (
      order_id int NOT NULL
      AUTO_INCREMENT,
  status varchar
      (60) NOT NULL,
  date datetime NOT NULL,
  description varchar
      (150) NOT NULL,
  payment_method varchar
      (60) NOT NULL,
  total float NOT NULL,
  user_id int NOT NULL DEFAULT '0',
  is_disabled tinyint
      (1) DEFAULT '0',
  PRIMARY KEY
      (order_id),
  KEY user_id
      (user_id),
  CONSTRAINT orders_ibfk_1 FOREIGN KEY
      (user_id) REFERENCES users
      (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table orders
--

LOCK TABLES orders WRITE;
/*!40000 ALTER TABLE orders DISABLE KEYS */;
      INSERT INTO 
orders
      VALUES
        (7, 'new', '2020-10-11 21:33:04', '3x Caldo de Costilla', 'cash', 24000, 2, 0),
        (10, 'new', '2020-10-11 21:46:38', '3x Caldo de Costilla', 'cash', 24000, 2, 0),
        (11, 'new', '2020-10-11 22:00:44', '3x Caldo de Costilla', 'cash', 24000, 2, 0),
        (12, 'new', '2020-10-11 22:22:41', '3x Caldo de Costilla', 'cash', 24000, 2, 0),
        (13, 'new', '2020-10-11 22:23:18', '3x Caldo de Costilla', 'cash', 24000, 2, 0),
        (14, 'new', '2020-10-11 22:29:24', '3x Caldo de Costilla', 'cash', 24000, 2, 0),
        (15, 'new', '2020-10-11 23:37:21', '3x Hamburguesa Vegetariana', 'cash', 75000, 2, 0);
      /*!40000 ALTER TABLE orders ENABLE KEYS */;
      UNLOCK TABLES;

      --
      -- Table structure for table orders_products
      --

      DROP TABLE IF EXISTS orders_products;
      /*!40101 SET @saved_cs_client     = @@character_set_client */;
      /*!50503 SET character_set_client = utf8mb4 */;
      CREATE TABLE orders_products
      (
        order_prod_id int NOT NULL
        AUTO_INCREMENT,
  order_id int DEFAULT NULL,
  product_id int DEFAULT NULL,
  product_amount int NOT NULL,
  PRIMARY KEY
        (order_prod_id),
  KEY order_id
        (order_id),
  KEY product_id
        (product_id),
  CONSTRAINT orders_products_ibfk_1 FOREIGN KEY
        (order_id) REFERENCES orders
        (order_id),
  CONSTRAINT orders_products_ibfk_2 FOREIGN KEY
        (product_id) REFERENCES products
        (product_id)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table orders_products
--

LOCK TABLES orders_products WRITE;
/*!40000 ALTER TABLE orders_products DISABLE KEYS */;
        INSERT INTO 
orders_products
        VALUES
          (8, 7, 2, 3),
          (11, 10, 2, 3),
          (12, 11, 2, 3),
          (13, 12, 2, 3),
          (14, 13, 2, 3),
          (15, 14, 2, 3),
          (16, 15, 4, 3);
        /*!40000 ALTER TABLE orders_products ENABLE KEYS */;
        UNLOCK TABLES;


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-12 23:22:57
