Absensi Online
===================

Kelompok:
- Galuh Aan Ramadhan (05111540000026)
- Vicky Mahfudy (05111540000105)
- Fauzan Abid Ramadhan (05111540000156)

----------
Requirement
-------------

- Express

    `npm install express --save`

- Cookie Parser

    `npm install cookie-parser`

- Body Parser

     `npm install body-parser`

- Express Session

     `npm install express-session`

- MySQL

    `npm install mysql`
    
- MD5 

    `npm install md5`
    
API
-------------

1. Absen
    `POST /absen`
    Body: Nama Ruang, NRP

2. Rekap kuliah per semester
    `GET /rekappersemester/IDMATAKULIAH`

3. Rekap kuliah per pertemuan
    `GET /rekappertemuan/IDMATAKULIAH/PERTEMUANKE`

4. Rekap per mahasiswa per kuliah
    `GET /rekapmahasiswa/NRP/IDMATAKULIAH`

5. Rekap per mahasiswa per semester
    `GET /rekapmahasiswasemester/NRP/SEMESTER`

6. Tambah user mahasiswa baru
    `POST /tambahmahasiswa`
    Body: NRP, Nama, Password

7. Tambah user mahasiswa ke mata kuliah
    `POST /tambahpeserta`
    Body: ID Mata Kuliah, NRP

8. Tambah mata kuliah baru
    `POST /tambahmatkul`
    Body: Nama Matkul, Kelas, Semester

9. Tambah jadwal pertemuan untuk kuliah
    `POST /tambahjadwal`
    Body: ID Mata Kuliah, Pertemuan Ke-, Nama Ruang, Jam Mulai, Jam Selesai

Run
-------------
`node index.js`