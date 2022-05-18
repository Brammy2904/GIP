-- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
--
-- Host: localhost    Database: gib
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.22-MariaDB

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
-- Table structure for table `highscores`
--

DROP TABLE IF EXISTS `highscores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `highscores` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `levens` int(3) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `time` int(3) NOT NULL,
  `loser` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `highscores`
--

LOCK TABLES `highscores` WRITE;
/*!40000 ALTER TABLE `highscores` DISABLE KEYS */;
INSERT INTO `highscores` VALUES (59,31,'Merurakcred',56,'Mercraark'),(60,30,'Mjolarkmed',68,'Azurzoird'),(61,40,'Lukarkark',75,'Draksores'),(62,12,'Jagslamarzur',66,'Krairmur'),(63,25,'Marsalmarure',23,'Zurzoirarc'),(64,26,'Mjolslamares',44,'Merzerer'),(65,3,'Cryloriark',43,'Madmiark'),(66,1,'Cryclotron',77,'Krirmur'),(67,8,'Rasorder',48,'Morird'),(68,31,'Reiarktron',55,'Mrokcraed'),(69,13,'Rayloried',59,'Mroksores'),(70,15,'Zedmures',61,'Azaksalmard'),(71,22,'Bremiries',33,'Marcresder'),(72,39,'Merurakes',46,'Zurzerure'),(73,14,'Reisalmararc',40,'Zedarkes'),(74,30,'Crucracred',31,'Brelorier'),(75,4,'Madredarc',75,'Brearkcred'),(76,43,'Merzoires',28,'Mersalmararc'),(77,13,'Lukarcarc',30,'Drakcresark'),(78,21,'Reicloure',67,'Drakcresmed');
/*!40000 ALTER TABLE `highscores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'gib'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-13 18:05:28
