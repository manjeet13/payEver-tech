/**
 * @author : Manjeet Kumar
 * @since : June 14, 2019
 * @description : the main driver file which initializes the app and starts the server
 */

const express = require('express');
const bodyParser = require('body-parser');

const appConfigs = require('./configs');
const appRoutes = require('./routes');

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/user', appRoutes);
//start the server
app.listen(appConfigs.port,(err)=> {
    if(!err) {
        console.log('server is running on PORT ',appConfigs.port);
    } else {
        console.log('could not start server, ERR: ', err);
    }
});