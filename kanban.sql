-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2024 at 01:42 AM
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
-- Database: `kanban`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `task_name` varchar(50) NOT NULL,
  `task_desc` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL,
  `date` datetime NOT NULL,
  `position` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `task_name`, `task_desc`, `status`, `date`, `position`, `user_id`) VALUES
(148, 'Update Website', 'Make necessary updates and fixes', 'doing', '2024-08-16 10:30:00', 3, 7),
(151, 'Send Feedback to Client', 'Draft and send feedback to the client', 'done', '2024-08-19 15:30:00', 1, 7),
(155, 'Test New Software Feature', 'Conduct testing for the newly implemented feature ', 'todo', '2024-08-22 11:00:00', 1, 7),
(157, 'Optimize Database Queries', 'Improve the efficiency of the database queries use', 'doing', '2024-08-24 16:00:00', 1, 7),
(159, 'Implement Feedback Changes', 'Apply the changes suggested during the last review', 'doing', '2024-08-26 12:00:00', 0, 7),
(160, 'Conduct User Testing', 'Organize and conduct user testing sessions', 'todo', '2024-08-27 15:00:00', 0, 7),
(168, 'bbb', 'bbb', 'doing', '2024-08-22 09:41:00', 0, 26),
(169, 'aaa', 'aaa', 'doing', '2024-09-04 09:41:00', 2, 26),
(170, 'ccc', 'ccc', 'done', '2024-08-27 09:41:00', 0, 26),
(171, 'ddd', 'ddd', 'doing', '2024-08-13 09:41:00', 1, 26),
(172, 'asda', 'asdasdada', 'doing', '2024-08-23 11:50:00', 2, 7);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `user_email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_pass`, `user_email`) VALUES
(7, 'fam', '$2y$10$D6U9ZKw9JyBwpLwjPfOYReGtcTDkKPu4eF6HclBwUXs1KLDqS9Wpa', '123@gmail.com'),
(26, 'dsa', '$2y$10$rYbkuYOhWRuCkObFbsfnNOjEDT5.LFDxsdRoViovxlIh9GXPwBkvK', 'dsa@gas.c');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`user_name`),
  ADD UNIQUE KEY `email` (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
