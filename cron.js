/**
 * @author : Manjeet Kumar
 * 
 * @description: script that starts the cron job and runs it every minute
 */


const request = require('request');
const fs = require('fs');
const json = require('jsonfile');
const cron = require('node-cron');

function getUsersData(page) {
    request.get(`https://reqres.in/api/users?page=${page}`,(err, response, body)=> {
        if(!err) {
            let usersArr = JSON.parse(body).data;
            json.readFile('./userData.json', (err, dataObj)=> {
                console.log('dataObj => ', dataObj, typeof(dataObj));
                if(!dataObj) {
                    dataObj = {
                        "users": []
                    }
                }
                let jsonData = dataObj;
                for(let user of usersArr) {
                    jsonData.users.push(user);
                }
                fs.writeFile('./userData.json', JSON.stringify(jsonData), (err)=> {
                    if(!err) {
                        console.log('json file written successfull')
                    }
                });
            });
        }
    })
}


let page = 1;
cron.schedule("*/1 * * * *", function() {
    console.log('running cron job');
    getUsersData(page++);
})