/**
 * @author : Manjeet Kumar
 * @description : this class handles image operations, downloading from url and saving to local file system
 */

const fs = require('fs');
const request = require('request');
const https = require('https');
class ImageHelper {
    constructor() {
        this._imageStore = [];
        this._base64Img = {};
    }

    saveImageToDisk(url, localPath) {
        return new Promise((resolve, reject)=> {
            if(!this._imageStore.includes(url)) {
                this._imageStore.push(url);
                let file = fs.createWriteStream(localPath);
                let writeImg = https.get(url, (response)=> {
                    response.pipe(file);
                })
                let res = request.get(url, (err, response, body)=> {
                        
                    let img = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                    // let img = new Buffer(response, 'base64');
                    this._base64Img[url] = img; 
                    resolve(img);
                });
            } else {
                console.log('avatar already exists');
                resolve(this._base64Img[url]);
            }
            
        })
        
    }
}

module.exports = ImageHelper;