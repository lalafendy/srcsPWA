const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
const {getHomePage,viewSmart} = require('./routes/index');
const {GenePage,GeneSmart} = require('./routes/genetic');
const {addSmartPage, addSmart, deleteSmart, editSmart, editSmartPage,loginSmartPage,loginSmart,adminhomePage,regPage,regSmart} = require('./routes/admin');
const port = 5030;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
//app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage);
app.get('/login', loginSmartPage);
app.get('/genedata', GeneSmart);
app.get('/gene', GenePage);
app.get('/adminhomePage',adminhomePage)
app.get('/add', addSmartPage);
app.get('/register', regPage);
app.get('/edit/:id', editSmartPage);
app.get('/delete/:id', deleteSmart);
app.get('/view/:id', viewSmart);
app.post('/add', addSmart);
app.post('/genedata', GeneSmart);
app.post('/register', regSmart);
app.post('/auth', loginSmart);
app.post('/edit/:id', editSmart);
//add the manifest
app.get("/manifest.json", function(req, res){
    //send the correct headers
    res.header("Content-Type", "text/cache-manifest");
    //console.log(path.join(__dirname,"manifest.json"));
    //send the manifest file
    //to be parsed bt express
    res.sendFile(path.join(__dirname,"manifest.json"));
});

//add the service worker
  app.get("/sw.js", function(req, res){
    //send the correct headers
    res.header("Content-Type", "text/javascript");
    
    res.sendFile(path.join(__dirname,"sw.js"));
  });

  app.get("/loader.js", function(req, res){
    //send the correct headers
    res.header("Content-Type", "text/javascript");
    
    res.sendFile(path.join(__dirname,"loader.js"));
  });


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
