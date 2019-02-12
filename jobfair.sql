CREATE DATABASE  IF NOT EXISTS `jobfair` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `jobfair`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: jobfair
-- ------------------------------------------------------
-- Server version	5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `additionals`
--

DROP TABLE IF EXISTS `additionals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additionals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fair_id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `title` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `additionals_id_uindex` (`id`),
  KEY `additional_fair__fk` (`fair_id`),
  CONSTRAINT `additional_fair__fk` FOREIGN KEY (`fair_id`) REFERENCES `fairs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `additionals`
--

LOCK TABLES `additionals` WRITE;
/*!40000 ALTER TABLE `additionals` DISABLE KEYS */;
INSERT INTO `additionals` VALUES (1,1,4000,'2019-01-16 11:21:31','2019-01-16 11:21:31','Flajer u brosuri'),(2,1,2000,'2019-01-16 11:21:31','2019-01-16 11:21:31','Prednja unutrasnja korica brosure'),(3,1,3000,'2019-01-16 11:21:31','2019-01-16 11:21:31','Dodatna strana u boji u brosuri'),(4,1,5000,'2019-01-16 11:21:31','2019-01-16 11:21:31','Doplata za brendiranje standa'),(5,1,10000,'2019-01-16 11:21:31','2019-01-16 11:21:31','Dodatna rezentacija kompanije u trajanju 45min'),(21,52,4000,'2019-01-16 11:54:39','2019-01-16 11:54:39','Flajer u brosuri'),(22,52,2000,'2019-01-16 11:54:39','2019-01-16 11:54:39','Prednja unutrasnja korica brosure'),(23,52,3000,'2019-01-16 11:54:39','2019-01-16 11:54:39','Dodatna strana u boji u brosuri'),(24,52,5000,'2019-01-16 11:54:39','2019-01-16 11:54:39','Doplata za brendiranje standa'),(25,52,10000,'2019-01-16 11:54:39','2019-01-16 11:54:39','Dodatna rezentacija kompanije u trajanju 45min'),(36,55,4000,'2019-01-27 15:15:58','2019-01-27 15:15:58','Flajer u brosuri'),(37,55,2000,'2019-01-27 15:15:58','2019-01-27 15:15:58','Prednja unutrasnja korica brosure'),(38,55,3000,'2019-01-27 15:15:58','2019-01-27 15:15:58','Dodatna strana u boji u brosuri'),(39,55,5000,'2019-01-27 15:15:58','2019-01-27 15:15:58','Doplata za brendiranje standa'),(40,55,10000,'2019-01-27 15:15:58','2019-01-27 15:15:58','Dodatna rezentacija kompanije u trajanju 45min');
/*!40000 ALTER TABLE `additionals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(10) unsigned NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`id`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,NULL,NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` set('practice','job') DEFAULT NULL,
  `student_id` int(10) unsigned NOT NULL,
  `job_id` int(11) unsigned DEFAULT NULL,
  `cover_letter` text,
  `pdf` text,
  `accepted` datetime DEFAULT NULL,
  `rate` tinyint(4) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_id_uindex` (`id`),
  UNIQUE KEY `applications_student_id_job_id_uindex` (`student_id`,`job_id`),
  KEY `application_job__fk` (`job_id`),
  CONSTRAINT `application_job__fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_student__fk` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (2,'job',2,3,NULL,'13s114mips_kol1.pdf','2018-01-16 20:10:34',4,'2019-01-23 15:14:30','2019-01-24 23:11:15'),(8,'practice',2,9,'adadasdas',NULL,NULL,NULL,'2019-01-23 15:42:20','2019-01-23 15:42:20'),(13,'practice',2,6,'Pozdrav svima','student_2_job_undefined.pdf','2019-01-18 18:14:22',NULL,'2019-01-23 15:59:45','2019-01-24 18:14:22');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `director` varchar(50) NOT NULL,
  `pib` varchar(20) NOT NULL,
  `employees` int(11) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `agency` enum('it','telekomunikacije','energetika','gradjevina','masinstvo') NOT NULL,
  `speciality` varchar(50) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `companies_user__fk` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (3,'Google ','Bulevar Kralja Aleksandra 73','Belgrade','Matija Lukic','0656635897',50,'google.com','it','Web',NULL,NULL),(4,'Microsoft','Zahumska','Belgrade','Milos Nedeljkovic','151561516',100,'microsoft.com','it','Games',NULL,NULL),(5,'MTS','Krunska','Belgrade','Predrag Culibrk','\r\n465815',62,'mts.rs','telekomunikacije','Phones',NULL,NULL),(7,'Nordeus','Gandijeva 54','Belgrade','Branko Milutinovic','3456789',200,'nordeus.com','it','Games','2019-01-26 01:21:27','2019-01-26 01:21:27');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fairs`
--

DROP TABLE IF EXISTS `fairs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fairs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime DEFAULT NULL,
  `place` varchar(50) NOT NULL,
  `about` text NOT NULL,
  `startCV` datetime DEFAULT NULL,
  `endCV` datetime DEFAULT NULL,
  `startParticipate` datetime DEFAULT NULL,
  `endParticipate` datetime DEFAULT NULL,
  `images` text,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fairs`
--

LOCK TABLES `fairs` WRITE;
/*!40000 ALTER TABLE `fairs` DISABLE KEYS */;
INSERT INTO `fairs` VALUES (1,'JobFair 18','2018-01-08 23:46:24','2019-01-01 23:46:33','Zgrada tehnickih fakulteta','Lorem ipsum Job fair 18',NULL,NULL,NULL,NULL,'[\"0-480x266.jpg\",\"c6f7e701-2741-4fab-a84b-c03a94fe22a3.jpg\"]',NULL,NULL),(52,'Novi Sajam 2019','2019-01-16 19:20:00','2019-01-16 19:20:00','Arilje','Kada kažete \"Srpska Nova godina\", na koju Novu godinu pomislite? A šta ako vam kažemo da postoji jedna \"srpskija\" Nova godina od ove koju slavimo po julijanskom kalendaru?',NULL,NULL,NULL,NULL,'[\"0-480x266.jpg\",\"c6f7e701-2741-4fab-a84b-c03a94fe22a3.jpg\"]',NULL,NULL),(55,'Fair New 2019','2019-01-27 19:20:00','2019-02-20 19:20:00','Zgrada tehnickih','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim massa vel turpis tristique iaculis. Nunc fringilla dui vel dolor convallis, ut venenatis risus tempor. Praesent et venenatis arcu. Etiam efficitur velit luctus lacus luctus ultrices vel eu augue. Suspendisse at quam bibendum, pellentesque libero id, vehicula orci. Pellentesque vulputate pretium leo non placerat. Donec tincidunt dui eget sapien dictum lacinia. Donec eget lacus nunc. Vestibulum in metus ut risus porta lacinia ut quis enim. Integer eros metus, pellentesque ut condimentum vitae, vestibulum nec erat. Pellentesque gravida non neque non ullamcorper. Vivamus bibendum dictum scelerisque. Phasellus eget ultricies risus. Praesent ullamcorper odio ut efficitur euismod.','2019-02-20 19:20:00',NULL,NULL,NULL,'[\"0-480x266.jpg\",\"c6f7e701-2741-4fab-a84b-c03a94fe22a3.jpg\"]','2019-01-27 15:15:58','2019-02-09 19:31:18');
/*!40000 ALTER TABLE `fairs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package_id` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_id_uindex` (`id`),
  KEY `item_package__fk` (`package_id`),
  CONSTRAINT `item_package__fk` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (57,21,'Stand 4x velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(58,21,'Logo i 2 strane u boji u brosuri','2019-01-16 11:54:39','2019-01-16 11:54:39'),(59,21,'Logo na promo majicama trostruke velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(60,22,'Stand 3x velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(61,22,'Logo i 2 strane u boji u brosuri','2019-01-16 11:54:39','2019-01-16 11:54:39'),(62,22,'Logo na promo majicama 3x velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(63,23,'Stand 2x velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(64,23,'Logo i 2 strane u boji u brosuri','2019-01-16 11:54:39','2019-01-16 11:54:39'),(65,23,'Logo na promo majicama 2x velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(66,24,'Stand 2x velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(67,24,'Logo i 1 strane u boji u brosuri','2019-01-16 11:54:39','2019-01-16 11:54:39'),(68,24,'Logo na promo majicama standardne velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(69,25,'Stand 1x velicine','2019-01-16 11:54:39','2019-01-16 11:54:39'),(70,25,'Logo i osnovne info u brosuri','2019-01-16 11:54:39','2019-01-16 11:54:39'),(99,38,'Stand 4x velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(100,38,'Logo i 2 strane u boji u brosuri','2019-01-27 15:15:58','2019-01-27 15:15:58'),(101,38,'Logo na promo majicama trostruke velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(102,39,'Stand 3x velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(103,39,'Logo na promo majicama 3x velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(104,39,'Logo i 2 strane u boji u brosuri','2019-01-27 15:15:58','2019-01-27 15:15:58'),(105,40,'Stand 2x velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(106,40,'Logo i 2 strane u boji u brosuri','2019-01-27 15:15:58','2019-01-27 15:15:58'),(107,40,'Logo na promo majicama 2x velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(108,41,'Stand 2x velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(109,41,'Logo i 1 strane u boji u brosuri','2019-01-27 15:15:58','2019-01-27 15:15:58'),(110,41,'Logo na promo majicama standardne velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(111,42,'Stand 1x velicine','2019-01-27 15:15:58','2019-01-27 15:15:58'),(112,42,'Logo i osnovne info u brosuri','2019-01-27 15:15:58','2019-01-27 15:15:58');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `type` enum('practice','job') DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jobs_id_uindex` (`id`),
  KEY `jobs_companies__fk` (`company_id`),
  CONSTRAINT `jobs_companies__fk` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (3,4,'Web Developer','Since you are working with multiple models, the callbacks will not return DAO instances. BulkCreate will return an array of model instances/DAOs, they will however, unlike create, not have the resulting values of autoIncrement attributes.update and destroy will return the number of affected rows.','job','2019-01-22 18:20:00','2019-01-24 18:23:00','2019-01-22 22:20:06','2019-01-22 22:41:19'),(6,4,'Scrum Master ','Since you are working with multiple models, the callbacks will not return DAO instances. BulkCreate will return an array of model instances/DAOs, they will however, unlike create, not have the resulting values of autoIncrement attributes.update and destroy will return the number of affected rows.','job','2019-01-20 19:20:00','2019-02-20 19:20:00','2019-01-22 23:51:46','2019-01-24 15:18:37'),(7,4,'Android Developer','Since you are working with multiple models, the callbacks will not return DAO instances. BulkCreate will return an array of model instances/DAOs, they will however, unlike create, not have the resulting values of autoIncrement attributes.update and destroy will return the number of affected rows.','practice','2019-01-20 19:20:00','2019-01-20 19:26:00','2019-01-22 23:52:48','2019-01-22 23:56:21'),(9,4,'IOS Developer','matija jecar','practice','2019-01-20 19:20:00','2019-04-20 18:20:00','2019-01-22 23:56:59','2019-01-22 23:56:59'),(10,3,'Backend Developer','Default checkboxes and radios are improved upon with the help of .form-check, a single class for both input types that improves the layout and behavior of their HTML elements. Checkboxes are for selecting one or several options in a list, while radios are for selecting one option from many.','job','2019-01-01 19:20:00','2019-01-20 19:20:00','2019-01-23 04:17:02','2019-01-23 04:17:02'),(11,3,'Frontend Developer','Textual form controls—like <input>s, <select>s, and <textarea>s—are styled with the .form-control class. Included are styles for general appearance, focus state, sizing, and more.\n\nBe sure to explore our custom forms to further style <select>s.','practice','2019-01-20 19:20:00','2019-02-20 19:20:00','2019-01-23 04:18:06','2019-01-23 04:18:06');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fair_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `locations_ibfk_1` (`fair_id`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`fair_id`) REFERENCES `fairs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (5,55,'Amfiteatar 56','2019-01-27 15:15:58','2019-01-27 15:15:58'),(6,55,'Amfiteatar 65','2019-01-27 15:15:58','2019-01-27 15:15:58'),(7,52,'Nova Lokacija','2019-02-09 14:42:20','2019-02-09 14:42:20'),(8,52,'Nova Lokacija 2','2019-02-09 14:42:27','2019-02-09 14:42:27'),(9,1,'JobFair18 Lokacija','2019-02-09 14:42:35','2019-02-09 14:42:35'),(10,1,'JobFair18 Lokacija2','2019-02-09 14:45:02','2019-02-09 14:45:02'),(15,55,'Sala 60','2019-02-09 14:57:34','2019-02-09 14:57:34'),(16,1,'asd','2019-02-09 15:01:13','2019-02-09 15:01:13'),(17,1,'asdd','2019-02-09 15:01:38','2019-02-09 15:01:38'),(18,1,'dfg','2019-02-09 15:02:39','2019-02-09 15:02:39'),(19,1,'asdfg','2019-02-09 15:04:27','2019-02-09 15:04:27'),(20,1,'asdggfgfgf','2019-02-09 15:04:34','2019-02-09 15:04:34');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `video_promotion` int(11) NOT NULL,
  `no_lessons` int(11) NOT NULL,
  `no_workchops` int(11) NOT NULL,
  `no_presentation` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `max_companies` int(11) NOT NULL,
  `fair_id` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `packages_id_uindex` (`id`),
  KEY `packages_fair__fk` (`fair_id`),
  CONSTRAINT `packages_fair__fk` FOREIGN KEY (`fair_id`) REFERENCES `fairs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (21,'Generalni pokrovitelj',15,2,1,0,30000,1,52,'2019-01-16 11:54:39','2019-01-16 11:54:39'),(22,'Zlatni pokrovitelj',10,1,1,1,25000,1,52,'2019-01-16 11:54:39','2019-01-16 11:54:39'),(23,'Srebrni pokrovitelj',5,1,0,1,20000,2,52,'2019-01-16 11:54:39','2019-01-16 11:54:39'),(24,'Bronzani pokrovitelj',3,1,0,0,15000,3,52,'2019-01-16 11:54:39','2019-01-16 11:54:39'),(25,'Standardni paket',0,0,0,0,10000,-1,52,'2019-01-16 11:54:39','2019-01-16 11:54:39'),(26,'Generalni pokrovitelj',15,2,1,0,30000,1,1,'2019-01-16 11:54:39','2019-01-16 11:54:39'),(27,'Zlatni pokrovitelj',10,1,1,1,25000,1,1,'2019-01-16 11:54:39','2019-01-16 11:54:39'),(38,'Generalni pokrovitelj',15,2,1,0,30000,1,55,'2019-01-27 15:15:58','2019-01-27 15:15:58'),(39,'Zlatni pokrovitelj',10,1,1,1,25000,1,55,'2019-01-27 15:15:58','2019-01-27 15:15:58'),(40,'Srebrni pokrovitelj',5,1,0,1,20000,2,55,'2019-01-27 15:15:58','2019-01-27 15:15:58'),(41,'Bronzani pokrovitelj',3,1,0,0,15000,3,55,'2019-01-27 15:15:58','2019-01-27 15:15:58'),(42,'Standardni paket',0,0,0,0,10000,-1,55,'2019-01-27 15:15:58','2019-01-27 15:15:58');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permit_additionals`
--

DROP TABLE IF EXISTS `permit_additionals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permit_additionals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permit_id` int(11) NOT NULL,
  `additional_id` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permit_additionals_id_uindex` (`id`),
  KEY `permit_additionals_additionals_id_fk` (`additional_id`),
  KEY `permit_additionals_permit__fk` (`permit_id`),
  CONSTRAINT `permit_additionals_additionals_id_fk` FOREIGN KEY (`additional_id`) REFERENCES `additionals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `permit_additionals_permit__fk` FOREIGN KEY (`permit_id`) REFERENCES `permits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permit_additionals`
--

LOCK TABLES `permit_additionals` WRITE;
/*!40000 ALTER TABLE `permit_additionals` DISABLE KEYS */;
INSERT INTO `permit_additionals` VALUES (26,11,22,'2019-01-20 22:43:53','2019-01-20 22:43:53'),(27,11,23,'2019-01-20 22:43:53','2019-01-20 22:43:53'),(28,12,1,'2019-01-23 00:02:09','2019-01-23 00:02:09'),(29,12,2,'2019-01-23 00:02:09','2019-01-23 00:02:09'),(30,12,3,'2019-01-23 00:02:09','2019-01-23 00:02:09'),(31,12,4,'2019-01-23 00:02:09','2019-01-23 00:02:09'),(32,12,5,'2019-01-23 00:02:09','2019-01-23 00:02:09'),(33,13,21,'2019-01-26 22:58:15','2019-01-26 22:58:15'),(34,13,22,'2019-01-26 22:58:15','2019-01-26 22:58:15'),(35,13,23,'2019-01-26 22:58:15','2019-01-26 22:58:15'),(36,14,2,'2019-01-26 22:58:26','2019-01-26 22:58:26'),(37,14,3,'2019-01-26 22:58:26','2019-01-26 22:58:26'),(38,14,4,'2019-01-26 22:58:26','2019-01-26 22:58:26'),(39,15,22,'2019-01-26 22:59:41','2019-01-26 22:59:41'),(40,15,23,'2019-01-26 22:59:41','2019-01-26 22:59:41'),(41,15,24,'2019-01-26 22:59:41','2019-01-26 22:59:41'),(45,18,36,'2019-01-28 15:44:18','2019-01-28 15:44:18'),(46,18,37,'2019-01-28 15:44:18','2019-01-28 15:44:18'),(47,18,38,'2019-01-28 15:44:18','2019-01-28 15:44:18'),(48,18,39,'2019-01-28 15:44:18','2019-01-28 15:44:18'),(49,18,40,'2019-01-28 15:44:18','2019-01-28 15:44:18');
/*!40000 ALTER TABLE `permit_additionals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permits`
--

DROP TABLE IF EXISTS `permits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `fair_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `allowed` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permits_id_uindex` (`id`),
  KEY `permits_packages__fk` (`package_id`),
  KEY `permits_location__fk` (`location_id`),
  CONSTRAINT `permits_location__fk` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `permits_packages__fk` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permits`
--

LOCK TABLES `permits` WRITE;
/*!40000 ALTER TABLE `permits` DISABLE KEYS */;
INSERT INTO `permits` VALUES (1,21,5,1,NULL,0,'2019-01-16 16:17:30','2019-01-28 15:37:53'),(11,22,4,52,NULL,0,'2019-01-20 22:43:53','2019-01-28 15:41:25'),(12,27,4,1,NULL,0,'2019-01-23 00:02:09','2019-01-28 15:41:29'),(13,23,3,52,NULL,0,'2019-01-26 22:58:15','2019-01-28 15:41:26'),(14,27,3,1,NULL,0,'2019-01-26 22:58:26','2019-01-28 15:41:30'),(15,25,5,52,NULL,0,'2019-01-26 22:59:41','2019-01-28 15:41:27'),(18,38,5,55,NULL,0,'2019-01-28 15:44:18','2019-01-28 15:44:18');
/*!40000 ALTER TABLE `permits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `surname` varchar(50) NOT NULL DEFAULT '0',
  `tel` varchar(15) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons`
--

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;
INSERT INTO `persons` VALUES (1,'Matija ','Lukic','0656635897\r\n',NULL,NULL),(2,'Milos','Milosevic','06536256125',NULL,NULL),(6,'Milos','Jacimovic','0656635897',NULL,NULL),(8,'Miodrag','Milosevic','06566358897','2019-01-26 01:22:17','2019-01-26 01:22:17');
/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cv` text,
  `years` int(10) unsigned NOT NULL DEFAULT '0',
  `graduated` int(3) unsigned NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (2,NULL,3,0,NULL,NULL),(6,'{\"telephones\":[{\"type\":\"dasdas\",\"number\":\"dasdas\"}],\"websites\":[\"matijalukic.com\"],\"messiging\":[],\"workExperinence\":[{\"from\":\"2019-01-19\",\"to\":\"2019-02-28\",\"ongoing\":true,\"position\":\"dasdas\",\"city\":\"dasdas\",\"employer\":\"dasdas\",\"country\":\"dasdas\",\"mainActivities\":\"Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean vehicula tellus in fermentum sagittis. Ut vitae sagittis sem. Vestibulum ultricies metus dolor, vitae imperdiet odio ultrices gravida. Phasellus id eleifend nulla. Donec vel odio et justo imperdiet dapibus in nec urna. Nulla facilisi. Vivamus vel imperdiet erat, eu aliquam risus. Nulla at nisl lacus. Etiam at ante ut lacus dignissim finibus.\\n\\n\"}],\"educations\":[{\"from\":\"2015-07-06\",\"to\":\"2019-02-14\",\"ongoing\":false,\"title\":\"Softer Inzenjer\",\"city\":\"Belgrade\",\"organisation\":\"ETF\",\"country\":\"Serbia\"}],\"firstName\":\"Matij\",\"surname\":\"Lukic\",\"address\":\"Cer\",\"type\":\"Prefered Job\",\"description\":\"Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean vehicula tellus in fermentum sagittis. Ut vitae sagittis sem. Vestibulum ultricies metus dolor, vitae imperdiet odio ultrices gravida. Phasellus id eleifend nulla. Donec vel odio et justo imperdiet dapibus in nec urna. Nulla facilisi. Vivamus vel imperdiet erat, eu aliquam risus. Nulla at nisl lacus. Etiam at ante ut lacus dignissim finibus.\\n\\n\",\"motherTongue\":\"Serbian\",\"foreignLanguage\":\"English, Spanish\",\"relatedSkills\":\"Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean vehicula tellus in fermentum sagittis. Ut vitae sagittis sem. Vestibulum ultricies metus dolor, vitae imperdiet odio ultrices gravida. Phasellus id eleifend nulla. Donec vel odio et justo imperdiet dapibus in nec urna. Nulla facilisi. Vivamus vel imperdiet erat, eu aliquam risus. Nulla at nisl lacus. Etiam at ante ut lacus dignissim finibus.\\n\\n\"}',4,1,NULL,'2019-02-12 13:35:44'),(8,NULL,15,0,'2019-01-26 01:22:17','2019-01-26 01:22:17');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '0',
  `password` varchar(255) NOT NULL DEFAULT '0',
  `email` varchar(50) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin123','matija996@gmail.com',NULL,'2019-01-26 22:22:58'),(2,'student','student','matijalukictutorijal@gmail.com',NULL,NULL),(3,'company','company','company@gmail.com',NULL,NULL),(4,'company2','company','company3@gmail.com',NULL,NULL),(5,'company3','company','company22@gmailc.om',NULL,NULL),(6,'student2','M123matija$M','basdhb@bdhasb.com',NULL,'2019-02-12 13:18:15'),(7,'johndoe','matija','matija@gmail.com','2019-01-26 01:21:27','2019-01-26 01:21:27'),(8,'studentMatija','matija','mati2@gmail.com','2019-01-26 01:22:17','2019-01-26 01:22:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-12 16:17:12
