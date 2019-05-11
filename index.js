var http = require("http");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var md5 = require('md5');
var mysql = require('mysql');

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

//------------LOGIN--------------//
app.get('/auth', function(request, response) { 
    if(request.session.flashdata){
      var flash = request.session.flashdata;
    }
    response.render('auth/login.html',{flash});
});

app.post('/auth/login', function(request, response) {
    var user = request.body.username;
    var password = request.body.password;
    var pass = md5(password);
      let sql = "SELECT * FROM user where username ='"+user+"' AND password='"+pass+"' limit 1";
      let query = db.query(sql, (err, results, fields) => {
        if(err){
          console.log(err);
        }
          if (results.length > 0) {   
              request.session.id_user = results[0].id_user;
              request.session.username = results[0].username;
              request.session.nama_user = results[0].nama_user;
              request.session.role = results[0].role;
  
              if(request.session.role == 1){
                response.redirect('/dosen');
              }else{
                  response.redirect('/mahasiswa');
                }
              }else{
              request.session.flashdata = "Username atau password salah!";
              response.redirect('/auth');
            }
          });
});

app.get('/auth/logout', function(request, response) {
    request.session.destroy();    
    response.redirect('/auth');
});
//------------END LOGIN--------------//
