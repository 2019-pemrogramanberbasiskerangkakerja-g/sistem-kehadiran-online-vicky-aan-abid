var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var multer = require('multer');
var upload = multer();

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'db_absensi'
});

connection.connect();

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(upload.array());

//Require the Router we defined in movies.js
var rekap = require('./rekap.js');

//Use the Router on the sub route /movies
app.use('/rekap', rekap);

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/rekap_absen', function(request, response) {
	response.sendFile(path.join(__dirname + '/rekap absen.html'));
});

app.get('/set_jadwal', function(request, response) {
	response.sendFile(path.join(__dirname + '/set_jadwal.html'));
});

app.get('/absen', function(request, response) {
	response.sendFile(path.join(__dirname + '/Tambah_Mhs.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				if (username == 'admin'){
					request.session.loggedin = true;
					request.session.username = username;
					response.redirect('/set_jadwal');
				}
				else {
					response.redirect('/rekap_absen');
				}
			} else {
				response.send('Gagal!');
			}			
			response.end();
		});

	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.listen(3000,function(){
    console.log("I am live at PORT 3000.");
});