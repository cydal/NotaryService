import { DEFAULT_ECDH_CURVE } from 'tls';

const level = require('level');
const chainDB = './data/star';
const db = level(chainDB);


const VALIDATION_WINDOW = 300;


class Star {
    constructor(req) {
        this.req = req;
    }

    async saveAddressRequest(address) {
        const response = {
            "address": address,
            "message": address + ":" + Date.now() + ":starRegistry",
            "requestTimeStamp": Date.now(), 
            "validationWindow": VALIDATION_WINDOW
        }
        db.put(data.address, JSON.stringify(data));
        return data
    }


    async pendingAddressRequest(address) {
        return new Promise((resolve, reject) => {
            db.get(address, (err, value) => {
                if (value === undefined) { 
                    return reject(new Error("Address not found"));
                 } else if (err) {
                     return reject(err);
                 }

                 value = JSON.parse(value);

                 //Time elapsed in seconds
                 const diff = (Date.now() - value.requestTimeStamp) / 1000;
                 
                 if (diff >= VALIDATION_WINDOW) {
                     resolve(this.saveAddressRequest(address));
                 } else {
                     const data = {
                        "address": address, 
                        "message": value.message,
                        "requestTimeStamp": value.requestTimeStamp,
                        "validationWindow":Math.floor(VALIDATION_WINDOW - (Date.now() - value.requestTimeStamp) / 1000)
                     }

                     resolve(data);
                 }
            });
        });
    }
}


module.exports = {"Star": Star};