var express = require('express');
var app = express.Router();
const http = require('http');
const fs = require('fs');
var global = require('../globals');
var directoryFile = require('../globals_directory');
var directoryLog = require('../globals_logs');
const util = require('util')

var dateFormat = require('dateformat');
var cors = require('cors')
var moment = require('moment');

// CORST ALL
app.use(cors())

app.get('/', function (req, res) {

    res.statusCode = 200;
    console.log('GET Data From API')

    let now = new Date();
    let NowDate = (dateFormat(now, "dd-mm-yyyy"));

    var baseUrl = global.domain;

    var urlSchedules = baseUrl + 'schedulesjson/' + NowDate;
    console.log(urlSchedules);
    // console.log(NowDate);

    http.get(urlSchedules, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {

            const ScheduleJson = directoryFile.schedule_file;

            var fbResponse = JSON.parse(body);
            console.log("Got a response: ", fbResponse);
            const jsonString = JSON.stringify(fbResponse);

            fs.writeFile(ScheduleJson, jsonString, err => {
                if (err) {
                    console.log('Error writing file', err.code)
                } else {
                    console.log('Successfully wrote file Schedules')
                }
            })

        });


    }).on('error', function (e) {
        // write log if error to file
        console.log("Got an error: ", e.code);
        var logStream = fs.createWriteStream(directoryLog.schedule_log, { flags: 'a' });

        logStream.write(now + ': ' + e + '\n');
        logStream.end(NowDate);
    });
    // Render Index for reload after 1 minute
    res.render('index');

});

// For daily For Create Directory, File
// URL http://192.168.0.94:4000/daily
app.get('/daily', function (req, res) {

    res.statusCode = 200;
    console.log('GET Data From API')

    // let now = new Date();
    var startdate1 = moment();
    startdate2 = startdate1.subtract(1, "days");
    startdate = startdate2.format("DD-MM-YYYY");
    yearDir = startdate1.format("YYYY");

    const dir = '/opt/lampp/htdocs/node-schedules/jsonfile/'+yearDir;

    var baseUrl = global.domain;

    var urlSchedules = 'http://192.168.0.94:8000/api/V1/schedulesjson/' + startdate;

    http.get(urlSchedules, function(res){
        var body = '';
        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){

            var fbResponse = JSON.parse(body);
            console.log("Got a response: ", fbResponse);
            const jsonString = JSON.stringify(fbResponse);


            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                fs.writeFileSync(dir+'/'+startdate+'.json', jsonString);
                // fs.writeFileSync(dir+'/'+'07-03-2021.json', jsonString);
                json = jsonString 

            } else {
                fs.writeFileSync(dir+'/'+startdate+'.json',jsonString);
                // fs.writeFileSync(dir+'/'+'07-03-2021.json', jsonString);
                json = jsonString 
            }  

            // const makeDir = util.promisify(fs.mkdir) 
            // const readDir = util.promisify(fs.readdir) 

            // const createDirectory = async path => { 
            //   await makeDir(path)

            //  if (!fs.existsSync(dir)){
            //     fs.mkdirSync(dir);
            //     fs.writeFileSync(dir+'/'+NowDate+'.json', jsonString);
            //     // fs.writeFileSync(dir+'/'+'03-03-2021.json', jsonString);
            //     json = jsonString 

            // } else {
            //     fs.writeFileSync(dir+'/'+NowDate+'.json',jsonString);
            //     // fs.writeFileSync(dir+'/'+'03-03-2021.json', jsonString);
            //     json = jsonString 
            // }
            //   console.log(`Directory '${path}' is created`) 
            // } 

            // createDirectory(dir)   

            // // If promise gets rejected 
            // .catch(err => { 
            //     console.log(`Error occurs,  
            //     Error code -> ${err.code}, 
            //     Error No -> ${err.errno}`); 
            // }) 
        });
    })


    res.json([
        {directory: dir},
        {directory_file: dir+'/'+startdate+'.json'},
    ])
});

// URL http://192.168.0.94:4000/schedules?date=21-02-2021
app.get('/schedules', function (req, res) {
    var startdate1 = moment();
    startdate = startdate1.format("YYYY");
    console.log(startdate); 
    const dateParams = req.query.date

    var dire = '/opt/lampp/htdocs/node-schedules/jsonfile/'+ startdate + '/' + dateParams + '.json';
    console.log(dire);

    fs.readFile(dire, (err, data) => {
        if (err) res.json({ start: dateParams })
        let student = JSON.parse(data);
        res.json(student)
    });

});


// URL http://192.168.0.94:4000/schedulesjsonjson
app.get('/machinesjson', function (req, res) {
    // Directory globbal_directory.js
    var dire = directoryFile.machine_file;

    // Read File to JSON
    fs.readFile(dire, (err, data) => {
        var none = "";
        if (err) res.json({ none })
        let machines = JSON.parse(data);
        res.json(machines)
    });

});

// URL http://192.168.0.94:4000/schedulesjsonjson
app.get('/schedulesjson', function (req, res) {
    // Directory globbal_directory.js
    var dire = directoryFile.schedule_file;

    // Directory globbal_directory.js
    fs.readFile(dire, (err, data) => {
        var none = "";
        if (err) res.json({ none })
        let schedules = JSON.parse(data);
        res.json(schedules)
    });

});


module.exports = app;