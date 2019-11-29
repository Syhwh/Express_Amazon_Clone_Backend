const express = require ('express');
const morgan = require ('morgan');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const cors =require ('cors');

// initialization
const app = express();
require('./dataBase');
app.use(bodyParser.json());//read data in json format
app.use(bodyParser.urlencoded({extended:false}));//read images
app.use(morgan('dev'));//messages in the console
app.use(cors());
// settings
app.set('port', process.env.PORT ||3030)

// routes

const userRoutes = require ('./routes/account');
const mainRoutes = require ('./routes/main');
const sellerRoutes = require('./routes/seller')

app.use('/api', mainRoutes);
app.use('/api/accounts/', userRoutes);
app.use('/api/seller', sellerRoutes);


// start server
app.listen( app.get('port'), ()=>{
    console.log('Server on port,',app.get('port'))
});
