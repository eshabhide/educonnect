-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: forum
-- ------------------------------------------------------
-- Server version	5.7.19-log

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
-- Table structure for table `tutortime`
--

DROP TABLE IF EXISTS `tutortime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tutortime` (
  `email` varchar(50) NOT NULL,
  `date` varchar(10) NOT NULL,
  `time` int(11) NOT NULL,
  `subject` int(11) DEFAULT NULL,
  PRIMARY KEY (`email`,`date`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutortime`
--

LOCK TABLES `tutortime` WRITE;
/*!40000 ALTER TABLE `tutortime` DISABLE KEYS */;
INSERT INTO `tutortime` VALUES ('a@b.com','05/16/2018',12,2),('a@b.com','05/16/2018',14,2),('a@b.com','05/16/2018',15,2),('a@b.com','05/16/2018',16,2),('a@b.com','05/16/2018',17,2),('a@b.com','05/16/2018',18,2),('a@b.com','05/16/2018',19,2),('a@b.com','05/22/2018',9,2),('a@b.com','05/22/2018',17,2),('c@c.com','05/10/2018',8,2),('c@c.com','05/10/2018',16,2),('c@c.com','05/10/2018',17,2),('c@c.com','05/17/2018',9,1),('c@c.com','05/17/2018',11,1),('c@c.com','05/17/2018',13,1),('c@c.com','05/17/2018',15,1),('c@c.com','05/17/2018',17,1),('c@c.com','05/17/2018',19,1),('c@c.com','05/18/2018',10,2),('c@c.com','05/18/2018',14,2),('c@c.com','05/18/2018',17,2),('c@c.com','05/22/2018',9,1),('c@c.com','05/22/2018',10,1),('c@c.com','05/22/2018',11,1),('c@c.com','05/22/2018',12,1),('c@c.com','05/22/2018',13,1),('c@c.com','05/22/2018',14,1),('c@c.com','05/22/2018',15,1),('c@c.com','05/25/2018',10,1),('c@c.com','05/25/2018',18,1),('c@c.com','05/30/2018',8,1),('c@c.com','05/30/2018',19,1),('tutor101@gmail.com','05/01/2018',8,1),('tutor101@gmail.com','05/01/2018',9,1),('tutor101@gmail.com','05/01/2018',10,1),('tutor101@gmail.com','05/02/2018',17,2),('tutor101@gmail.com','05/02/2018',18,2),('tutor101@gmail.com','05/02/2018',19,2),('tutor101@gmail.com','05/07/2018',11,3),('tutor101@gmail.com','05/07/2018',12,3),('tutor101@gmail.com','05/07/2018',13,3);
/*!40000 ALTER TABLE `tutortime` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-13 12:42:41
