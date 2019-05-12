-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2019 at 06:08 PM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `absenonline`
--

-- --------------------------------------------------------

--
-- Table structure for table `absen`
--

CREATE TABLE `absen` (
  `id_jadwal` varchar(8) NOT NULL,
  `nomorinduk` varchar(16) NOT NULL,
  `waktu_absen` datetime NOT NULL,
  `masuk_or_keluar` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `absen`
--

INSERT INTO `absen` (`id_jadwal`, `nomorinduk`, `waktu_absen`, `masuk_or_keluar`) VALUES
('PBKKG1', '05111540000105', '2019-05-12 10:00:00', 'Masuk'),
('PBKKG2', '05111540000105', '2019-05-19 10:00:00', 'Masuk'),
('PBKKG1', '05111540000105', '2019-05-12 12:30:00', 'Keluar'),
('PBKKG1', '05111540000999', '2019-05-12 10:00:00', 'Masuk'),
('PBKKG1', '05111540000999', '2019-05-12 12:30:00', 'Keluar');

-- --------------------------------------------------------

--
-- Table structure for table `daftar_peserta`
--

CREATE TABLE `daftar_peserta` (
  `id_matkul` varchar(8) NOT NULL,
  `nomorinduk` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `daftar_peserta`
--

INSERT INTO `daftar_peserta` (`id_matkul`, `nomorinduk`) VALUES
('IFPBKKG', '05111540000105'),
('IFPBKKG', '05111540000999'),
('IFPBKKH', '05111540000105'),
('IFPBKKH', '05111540000999');

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id_jadwal` varchar(8) NOT NULL,
  `nama_ruang` varchar(16) NOT NULL,
  `id_matkul` varchar(8) NOT NULL,
  `pertemuan_ke` varchar(2) NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id_jadwal`, `nama_ruang`, `id_matkul`, `pertemuan_ke`, `jam_mulai`, `jam_selesai`) VALUES
('PBKKG1', 'IF-107a', 'IFPBKKG', '1', '10:00:00', '12:30:00'),
('PBKKG2', 'IF-107a', 'IFPBKKG', '2', '10:00:00', '12:30:00'),
('PBKKH1', 'LP1', 'IFPBKKH', '1', '10:00:00', '12:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `mata_kuliah`
--

CREATE TABLE `mata_kuliah` (
  `id_matkul` varchar(8) NOT NULL,
  `nama_matkul` varchar(16) NOT NULL,
  `kelas_matkul` varchar(4) NOT NULL,
  `semester` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mata_kuliah`
--

INSERT INTO `mata_kuliah` (`id_matkul`, `nama_matkul`, `kelas_matkul`, `semester`) VALUES
('IFPBKKG', 'PBKK', 'G', 6),
('IFPBKKH', 'PBKK', 'H', 6);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `nomorinduk` varchar(16) NOT NULL,
  `nama` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `role` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`nomorinduk`, `nama`, `password`, `role`) VALUES
('05111540000105', 'Vicky Mahfudy', '202cb962ac59075b964b07152d234b70', '1'),
('05111540000999', 'Vicky', '202cb962ac59075b964b07152d234b70', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absen`
--
ALTER TABLE `absen`
  ADD KEY `nomorinduk` (`nomorinduk`),
  ADD KEY `id_transaksi` (`id_jadwal`);

--
-- Indexes for table `daftar_peserta`
--
ALTER TABLE `daftar_peserta`
  ADD KEY `id_matkul` (`id_matkul`),
  ADD KEY `nomorinduk` (`nomorinduk`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id_jadwal`),
  ADD KEY `id_matkul` (`id_matkul`);

--
-- Indexes for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  ADD PRIMARY KEY (`id_matkul`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`nomorinduk`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absen`
--
ALTER TABLE `absen`
  ADD CONSTRAINT `absen_ibfk_1` FOREIGN KEY (`nomorinduk`) REFERENCES `user` (`nomorinduk`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `absen_ibfk_2` FOREIGN KEY (`id_jadwal`) REFERENCES `jadwal` (`id_jadwal`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `daftar_peserta`
--
ALTER TABLE `daftar_peserta`
  ADD CONSTRAINT `daftar_peserta_ibfk_1` FOREIGN KEY (`nomorinduk`) REFERENCES `user` (`nomorinduk`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `daftar_peserta_ibfk_2` FOREIGN KEY (`id_matkul`) REFERENCES `mata_kuliah` (`id_matkul`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`id_matkul`) REFERENCES `mata_kuliah` (`id_matkul`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
