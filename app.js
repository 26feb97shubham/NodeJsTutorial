const express = require('express');
const app = express();
const http = require('http');

// /**Mongodb */
// const {connect} = require('./mydb');
// connect();
/**Mongoose connection */
const {connect} = require('./mydb');
connect();
const userroutes = require('./routes/userroutes');
app.use(express.json());
app.use('/', userroutes);

 app.listen(8080,'172.16.2.120', ()=>{
     console.log('Server started on port 8080.....')
 });