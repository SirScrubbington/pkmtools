// filename: 'index.js'
// author: 'sirsc'
// date: '2018-10-18 11:27'
// description: 'index javascript source file'

const path = require('path');
const fs = require('fs');

const properties = JSON.parse(fs.readFileSync('properties.json','utf8'));

const port = process.env.YOUR_PORT || process.env.PORT || properties.port;
const host = process.env.YOUR_HOST || properties.host;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
	origin:host+':'+port,
	optionsSuccessStatus: 200
}
const app = express();
const http = require('http').Server(app);

app.use(express.static(path.join(__dirname,'www')));
app.use(express.static(path.join(__dirname,'www/img')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const server = http.listen(process.env.PORT || port, host,function()
{
	console.log('Server is listening on '+ host + ':' + (process.env.PORT));
});

