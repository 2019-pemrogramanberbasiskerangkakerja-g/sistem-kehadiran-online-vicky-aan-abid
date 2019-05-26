//import alert from 'alert-node';

var http = require("http");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var md5 = require('md5');
var mysql = require('mysql');
var JSAlert = require("js-alert");
var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/assets'));

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'absenonline'
});

db.connect(function(err) {
  if (err){
    console.log('Cek your DB Connection');
    console.log(err);
  }else{
    console.log('You are now connected with mysql database...');
  }
})

app.listen(3000, function() {
  console.log('Listening to port: 3000');
});

app.get('/', function(request, response) {
  response.redirect('/auth');
});

app.use(express.static(path.join(__dirname, 'public')));

//------------REGISTER-------------//
app.get('/register', function(request, response) {
  response.sendFile(path.join(__dirname + '/views/register.html'));
});

app.post('/auth/register', function(request, response) {
  var nama = request.body.nama;
  var nip = request.body.username;
  var password = request.body.password;
  var pass = md5(password);

  let sql = "SELECT * FROM user where nomorinduk ='"+nip+"'";
  let query = db.query(sql, (err, results, fields) => {
    if (results.length > 0) {        
      request.session.flashdata = "NIP sudah digunakan";
      response.redirect('/register');
    }else{
      let sql = "INSERT INTO `user`(`nomorinduk`,`nama`,`password`,`role`) values ('"+nip+"','"+nama+"','"+pass+"','0')";
      db.query(sql, function (err, result) {
        if(err){
          console.log(err);
        }
      });
      request.session.flashdata = "Akun "+nama+" berhasil dibuat";
      response.write( 
              "<script type='text/javascript'>alert('Berhasil mendaftarkan "+nama+"')</script>" +
              "<script type='text/javascript'>window.location = '/auth'</script>");
    }
  });
});
//-------------------END REGISTER--------------------//

//-------------------DASHBOARD DOSEN--------------------//

app.get('/dosen', function(request, response) { 
    if(request.session.flashdata){
      var flash = request.session.flashdata;
    }
    response.sendFile(path.join(__dirname + '/views/dashboard.html'));
});

//-------------------DASHBOARD DOSEN--------------------//

app.get('/mahasiswa', function(request, response) { 
  if(request.session.flashdata){
    var flash = request.session.flashdata;
  }
  response.sendFile(path.join(__dirname + '/views/dashboardmhs.html'));
});

//------------LOGIN--------------//
app.get('/auth', function(request, response) { 
    if(request.session.flashdata){
      var flash = request.session.flashdata;
    }
    response.sendFile(path.join(__dirname + '/views/login.html'));
});

app.post('/auth/login', function(request, response) {
    var user = request.body.username;
    var password = request.body.password;
    var pass = md5(password);
      let sql = "SELECT * FROM user where nomorinduk ='"+user+"' AND password='"+pass+"' limit 1";
      let query = db.query(sql, (err, results, fields) => {
        if(err){
          console.log(err);
        }
          if (results.length > 0) {   
              request.session.id_user = results[0].id_user;
              request.session.nomorinduk = results[0].nomorinduk;
              request.session.nama_user = results[0].nama_user;
              request.session.role = results[0].role;
  
              if(request.session.role == 0) {
                response.write( 
              "<script type='text/javascript'>alert('Berhasl login dosen')</script>" +
              "<script type='text/javascript'>window.location = '/dosen'</script>");
              }else{
                response.write( 
              "<script type='text/javascript'>alert('Berhasl login mahasiswa')</script>" +
              "<script type='text/javascript'>window.location = '/mahasiswa'</script>");
                }
              }else{
            request.session.flashdata = "Username atau password salah!";
            response.write( 
              "<script type='text/javascript'>alert('Username atau password salah')</script>" +
              "<script type='text/javascript'>window.location = '/auth'</script>");
            }
          });
});

app.get('/auth/logout', function(request, response) {
    request.session.destroy();  
    response.write( 
              "<script type='text/javascript'>alert('Berhasl logout')</script>" +
              "<script type='text/javascript'>window.location = '/auth'</script>");
});
//------------END LOGIN--------------//

//----------API------------//
/*
1. Absen
    POST /absen
    Body: ruang, nrp
*/

app.post('/absen', function(req, res) {
  var nama_ruang = req.body.ruang;
  var nomorinduk = req.body.nrp;
  var status = "Masuk";
  var date = new Date();

  db.query('SELECT a.nomorinduk FROM daftar_peserta a, jadwal b WHERE a.nomorinduk=? AND b.nama_ruang=?',
   [nomorinduk,nama_ruang], function (error, results, fields) {
    if (error){
      console.log(error);
    }
    if (results.length == 0 ){
      res.status(404).json({ error: 'Mahasiswa tidak terdaftar' });
    }else{
      db.query('INSERT INTO absen (nomorinduk,waktu_absen,masuk_or_keluar) values (?,?,?)',
       [nomorinduk,date,status], function (error, results, fields) {
          if (error){
            console.log(error);
          }else{
            res.status(200).json({ OK: 'Absensi Berhasil!' });
          }
        });
    }
  });
});

app.post('/api/absen', function (req, res) {
  var ruang = req.body.ruang;
  var nrp = req.body.nrp;
  var request = require("request")

  var url = "http://pbkk.serveo.net/api/absen/"+ruang+"/"+nrp;
  
  request.post(
    url,
    { json: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            res.write( 
              "<script type='text/javascript'>alert('Absen "+nrp+" di ruang "+ruang+" berhasil!')</script>" +
              "<script type='text/javascript'>window.location = '/mahasiswa'</script>");
        }
    }
);
});

/*
2. Rekap kuliah per semester
    GET /rekappersemester/IDMATAKULIAH
*/
app.get('/rekappersemester/:id_matkul', function (req, res) {
  var id_matkul = req.params.id_matkul;

  db.query('SELECT nama_ruang, pertemuan_ke, jam_mulai, jam_selesai FROM jadwal WHERE id_matkul=? ORDER BY pertemuan_ke',
   [id_matkul], function (error, results, fields) {
    if (error){
      console.log(error);
    }else{
      res.status(200).json(results);
    }
  });
});

app.get('/api/rekappersemester/:id_matkul', function (req, res) {
    var id_matkul = req.params.id_matkul;
    var request = require("request")

    var url = "http://pbkk.serveo.net/api/rekap/"+id_matkul;

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error) {
          console.log(body) // Print the json response
          res.status(200).json(body); // Print the json response
        }
    })
});

app.get('/rekappersemester', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/rekappersemester.html'));
});

/*
3. Rekap kuliah per pertemuan
    GET /rekappertemuan/IDMATAKULIAH/PERTEMUANKE
*/
app.get('/rekappertemuan/:id_matkul/:pertemuanke', function (req, res) {
  var id_matkul = req.params.id_matkul;
  var pertemuan_ke = req.params.pertemuanke;
  db.query('SELECT id_jadwal FROM jadwal WHERE id_matkul=? AND pertemuan_ke=?',
   [id_matkul,pertemuan_ke], function (error, results, fields) {
    console.log(results[0].id_jadwal);
    var id_jadwal = results[0].id_jadwal;
    db.query('SELECT a.nama_ruang, b.nomorinduk, b.waktu_absen, b.masuk_or_keluar FROM jadwal a, absen b WHERE a.id_jadwal = b.id_jadwal AND b.id_jadwal = ? ORDER BY a.pertemuan_ke',
    [id_jadwal], function (error, results, fields) {
      if (error){
        console.log(error);
      }else{
        res.status(200).json(results);
      }
    });
  });
});

app.get('/api/rekappertemuan/:id_matkul/:pertemuan', function (req, res) {
  var id_matkul = req.params.id_matkul;
  var pertemuan = req.params.pertemuan;
  var request = require("request")

  var url = "http://pbkk.serveo.net/api/rekap/"+id_matkul+"/"+pertemuan;

  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error) {
        console.log(body) // Print the json response
        res.status(200).json(body); // Print the json response
      }
  })
});

app.get('/rekappertemuan', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/rekappertemuan.html'));
});

/*
4. Rekap per mahasiswa per kuliah
    GET /rekapmahasiswa/NRP/IDMATAKULIAH
*/
app.get('/rekapmahasiswa/:nrp/:id_matkul', function (req, res) {
  var nomorinduk = req.params.nrp;
  var id_matkul = req.params.id_matkul;
  db.query('SELECT b.id_jadwal FROM absen a, jadwal b WHERE b.id_matkul=?',
   [id_matkul], function (error, results, fields) {
    var id_matkul2 = results[0].id_matkul;
    db.query('SELECT a.pertemuan_ke, b.waktu_absen, b.masuk_or_keluar FROM jadwal a, absen b WHERE b.nomorinduk = ? ORDER BY a.pertemuan_ke',
    [nomorinduk], function (error, results, fields) {
      if (error){
        console.log(error);
      }else{
        res.status(200).json(results);
      }
    });
  });
});

app.get('/rekapmahasiswa', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/rekapmahasiswa.html'));
});

/*
5. Rekap per mahasiswa per semester
    GET /rekapmahasiswasemester/NRP/SEMESTER
*/
app.get('/rekapmahasiswasemester/:nrp/:id_semester', function (req, res) {
  var nomorinduk = req.params.nrp;
  var idsemester = req.params.id_semester;

  db.query('SELECT a.nama_matkul, b.pertemuan_ke, c.waktu_absen, c.masuk_or_keluar FROM mata_kuliah a, jadwal b, absen c WHERE c.nomorinduk = ? AND a.semester=?',
   [nomorinduk,idsemester], function (error, results, fields) {
    if (error){
      console.log(error);
    }else{
      res.status(200).json(results);
    }
  });
});

app.get('/rekapmahasiswasemester', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/rekapmahasiswasemester.html'));
});

/*
6. Tambah user mahasiswa baru
    POST /tambahmahasiswa
    Body: nrp, nama, password
*/

app.post('/tambahmahasiswa', function (req, res) {
  var nomorinduk = req.body.nrp;
  var nama = req.body.nama;
  var password = req.body.password;
  var pass  = md5(password);

  db.query('SELECT nomorinduk FROM user WHERE nomorinduk=?',
   [nomorinduk,pass], function (error, results, fields) {
    if (error){
      console.log(error);
    }
    if (results.length > 0){
      res.status(404).json({ error: 'NRP sudah digunakan' });
    }else{
      db.query('INSERT INTO user (nomorinduk,nama,password,role) values (?,?,?,?)',
       [nomorinduk,nama,pass,'1'], function (error, results, fields) {
        if (error){
          console.log(error);
        }
        res.status(200).json({ OK: 'Akun '+nomorinduk+' berhasil dibuat' });
      });
    }
  });
});

app.post('/api/tambahmahasiswa', function (req, res) {
  var nrp = req.body.nrp;
  var nama = req.body.nama;
  var password = req.body.password;
  var request = require("request")

  var url = "http://pbkk.serveo.net/api/user/tambahmahasiswa";
  
  request.post(
    url,
    { json: { nrp:nrp,
      nama:nama,
      password:password } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            res.writeHeader(200, {"Content-Type": "text/html", });
    res.write("<html><body><script>alert('Mahasiswa "+nrp+" berhasil ditambahkan ')  ;</script></body>");
    res.write("<script language='javascript'>window.location='/dosen';</script>");
  
    res.end();
            // res.write( 
            //   "<script type='text/javascript'>alert('Peserta "+nrp+" berhasil dibuat!')</script>" +
            //   "<script type='text/javascript'>window.location = '/dosen'</script>");
        }
    }
);
});

/*
7. Tambah user mahasiswa ke mata kuliah
    POST /tambahpeserta
    Body: idmatkul, nrp
*/

app.post('/tambahpeserta', function (req, res) {
  var id_matkul = req.body.id_matkul;
  var nomorinduk = req.body.nrp;
  
  db.query('SELECT * FROM daftar_peserta WHERE id_matkul=? AND nomorinduk=?',
   [id_matkul,nomorinduk], function (error, results, fields) {
    if (error){
      console.log(error);
    }
    if (results.length > 0){
      res.status(404).json({ error: 'Peserta '+nomorinduk+' sudah terdaftar' });
    }else{
      db.query('SELECT * FROM user WHERE nomorinduk=?',
        [nomorinduk], function (error, results, fields) {
          if (results.length > 0){
            db.query('INSERT INTO daftar_peserta (id_matkul,nomorinduk) values (?,?)',
            [id_matkul,nomorinduk], function (error, results, fields) {
              if (error){
                console.log(error);
              }else{
                res.status(200).json({ OK: 'Peserta '+nomorinduk+' berhasil ditambahkan' });
              }
            });
          }else{
            res.status(404).json({ error: 'Peserta '+nomorinduk+' tidak terdaftar dalam sistem' });
          }
        });
    }
  });
});

app.post('/api/tambahpeserta', function (req, res) {
  var id_matkul = req.body.id_matkul;
  var kelas = req.body.kelas;
  var nrp = req.body.nrp;
  var request = require("request")

  var url = "http://pbkk.serveo.net/api/matakuliah/tambahpeserta/"+id_matkul+"/"+kelas+"/"+nrp;
  
  request.post(
    url,
    { json: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);

            res.writeHeader(200, {"Content-Type": "text/html", });
    res.write("<html><body><script>alert('Mahasiswa "+nrp+" berhasil ditambahkan ke kelas "+kelas+" ')  ;</script></body>");
    res.write("<script language='javascript'>window.location='/dosen';</script>");
  
    res.end();
        }
    }
);
});

/*
8. Tambah mata kuliah baru
    POST /tambahmatkul
    Body: nama_matkul, kelas, semester
*/

app.post('/tambahmatkul', function (req, res) {
  var id_matkul = req.body.id_matkul;
  var nama_matkul = req.body.nama_matkul;
  var kelas_matkul = req.body.kelas;
  var semester = req.body.semester;
  
  db.query('SELECT * FROM mata_kuliah where nama_matkul=? and kelas_matkul=?',
   [nama_matkul,kelas_matkul], function (error, results, fields) {
    if (error){
      console.log(error);
    }
    if (results.length > 0){
     res.write( 
            "<script type='text/javascript'>alert('Kelas sudah terdaftar')</script>" +
            "<script type='text/javascript'>window.location = '/dosen'</script>");
    }else{
      db.query('INSERT INTO mata_kuliah (id_matkul, nama_matkul,kelas_matkul,semester) values (?,?,?,?)',
        [id_matkul,nama_matkul,kelas_matkul,semester], function (error, results, fields) {
          if (error){
            console.log(error);
          }else{
          res.status(200).json({ OK: 'Mata Kuliah '+nama_matkul+' Kelas '+kelas_matkul+' berhasil ditambahkan' });
          }
        });
    }
  });
});

app.post('/api/tambahmatkul', function (req, res) {
  var nama = req.body.nama;
  var kelas = req.body.kelas;
  var id_matkul = req.body.id_matkul;
  var request = require("request")

  var url = "http://pbkk.serveo.net/api/matakuliah/tambahmatkul";
  
  request.post(
    url,
    { json: { nama:nama,
      kelas:kelas,
      id_matkul:id_matkul } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            res.writeHeader(200, {"Content-Type": "text/html", });
    res.write("<html><body><script>alert('Mata kuliah "+nama+" kelas "+kelas+" berhasil dibuat! ')  ;</script></body>");
    res.write("<script language='javascript'>window.location='/dosen';</script>");
  
    res.end();
            // res.write( 
            //   "<script type='text/javascript'>alert('Mata kuliah "+nama+" kelas "+kelas+" berhasil dibuat!')</script>" +
            //   "<script type='text/javascript'>window.location = '/dosen'</script>");
        }
    }
);
});

/*
9. Tambah jadwal pertemuan untuk kuliah
    POST /tambahjadwal
    Body: id mata kuliah, pertemuan ke, ruang, jam masuk, jam selesai
*/

app.post('/tambahjadwal', function (req, res) {
  var id_matkul = req.body.id_matkul;
  var pertemuan_ke = req.body.pertemuan_ke;
  var nama_ruang = req.body.nama_ruang;
  var jam_masuk = req.body.jam_masuk;
  var jam_selesai = req.body.jam_selesai;

  db.query('SELECT * FROM jadwal WHERE id_matkul=? AND pertemuan_ke=?',
   [id_matkul,pertemuan_ke], function (error, results, fields) {
    if (error){
      console.log(error);
    }
    if (results.length > 0){
      res.status(404).json({ error: 'Jadwal sudah terdaftar' });
    }else{
      db.query('INSERT INTO jadwal (nama_ruang,id_matkul,pertemuan_ke,jam_mulai,jam_selesai) values (?,?,?,?,?)',
        [nama_ruang,id_matkul,pertemuan_ke,jam_masuk,jam_selesai], function (error, results, fields) {
          if (error){
            console.log(error);
          }else{
            res.status(200).json({ OK: 'Jadwal '+id_matkul+' '+pertemuan_ke+' berhasil ditambahkan' });
          }
        });
    }
  });
});

app.post('/api/tambahjadwal', function (req, res) {
  var id_matkul = req.body.id_matkul;
  var pertemuan = req.body.pertemuan;
  var ruang = req.body.ruang;
  var kelas = req.body.kelas;
  var waktu_mulai = req.body.waktu_mulai;
  var waktu_selesai = req.body.waktu_selesai;
  var request = require("request")

  var url = "http://pbkk.serveo.net/api/absen/tambahjadwal";
  
  request.post(
    url,
    { json: { id_matkul:id_matkul,
      pertemuan:pertemuan,
      ruang:ruang,
      kelas:kelas,
      waktu_mulai:waktu_mulai,
      waktu_selesai:waktu_selesai } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
      
              res.writeHeader(200, {"Content-Type": "text/html", });
    res.write("<html><body><script>alert('Kelas "+kelas+", Ruang "+ruang+", pertemuan "+pertemuan+" berhasil dibuat!')  ;</script></body>");
    res.write("<script language='javascript'>window.location='/dosen';</script>");
  
    res.end();
        }
    }
);
});