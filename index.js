/**
 * Created by dchernyh on 14.04.16.
 * Main starting point of the application
 */

'use strict';

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./router');

const app = express();

//DB Setup
//create DB on localhost with name <auth>
mongoose.connect('mongodb://localhost:auth/auth');

//App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

//Server Setup
const port = process.env.port || 3001;
const server = http.createServer(app);
server.listen(port,()=>console.log(`Listening on: ${port}`));