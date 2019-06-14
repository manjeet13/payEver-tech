/**
 * @author : Manjeet Kumar
 * @since : June 14 2019
 * @description : this file is responsible for handling the routing in the application
 */

const router = require('express').Router(
    {mergeParams: true}
);
const fs = require('fs');
const request = require('request');
const ImageHelperClass = require('../lib/images');
let imageHelperObj = new ImageHelperClass();
router.get('/', (req, res)=> {
    res.send('hi this is the home route');
})

router.get('/:id', (req, res)=> {
    console.log('request is here in user/id');
    let userId = req.params.id;
    try {
        request.get(`https://reqres.in/api/users/${userId}`, (err, response, body)=> {
            if(!err) {
                let userData = JSON.parse(body).data;
                res.json(userData);
            } else {
                console.log('ERR while processing request: ',err);
                res.status(500);
                res.send('Your request could not be processed');
            }
        })
    } catch(error) {
        console.log('error while fetching user data from API: ', error);
    }
})


router.get('/:id/avatar', (req, res)=> {
    console.log('request is here');
    let userId = req.params.id;
    try {
        request.get(`https://reqres.in/api/users/${userId}`, async (err, response, body)=> {
            if(!err) {
                let userData = JSON.parse(body);
                console.log('response body: ', userData);
                let avatarUrl = userData.data.avatar;
                
                let image = await imageHelperObj.saveImageToDisk(avatarUrl, './avatars/'+userId+'.jpg');
                res.writeHead(200, {
                    'Content-Type': 'image/jpg',
                    'Content-Length': image.length
                  });
                  res.end(image); 
            } else {
                console.log('ERR while processing request: ',err);
                res.status(500);
                res.send('Your request could not be processed');
            }
        })
    } catch(error) {
        console.log('error while fetching user data from API: ', err);
    }
})


router.delete('/user/:id/avatar', (req, res)=> {
    try {
        fs.stat(`./avatars/${req.params.id}.jpg`, (err, stats)=> {
            if(err && err.code == 'ENOENT') {
                res.send('no avatar found for the user');
            } else if(!err) {
                fs.unlink(`./avatars/${req.params.id}.jpg`, (err)=> {
                    if(!err) {
                        res.send('avatar removed successfully');
                    } else { 
                        console.log('error while removing avatar: ', err);
                    }
                })
            }
        })
    } catch(error) {
        console.log(error);
    }
})

module.exports = router;