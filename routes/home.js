var express = require('express');
var app = express.Router();
const http = require('http');
const fs = require('fs');
var global = require('../globals');
var directoryFile = require('../globals_directory');
var directoryLog = require('../globals_logs');

var dateFormat = require('dateformat');
var cors = require('cors')

// CORST ALL
app.use(cors())

app.get('/', function(req, res) {
    res.render('home');
});

module.exports = app;