
const Blockchain = require('./simpleChain.js').Blockchain;
let Blck = require('./simpleChain.js').Block;

const Star = require("./Star");

const express = require('express');
const app = express();
const port = 8000;

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(port, () => {
    console.log('App listening on port ' + port);
});


/** 
//Mock blockchain data
let mockChain = {
    '0': { "height": 0, 'time': '6.30pm', 'hash': 3001020}, 
    '1': { "height": 1, 'time': '6.40pm', 'hash': 3001234}
};
*/


let blockchain = new Blockchain();


app.get('/block/:height', async (req, res) => {
    
    try {
        const height = req.params.height;
        const block = await blockchain.getBlock(height);
        res.send(block);
    } catch(err) {
        res.status(404).json({
            "status": 404,
            "message": "Incorrect Block Height"
        });
    }
    //res.send(req.url);
    //res.send(JSON.stringify(mockChain[0]));
});


app.post('/block', async (req, res) => {

    if (req.body.body === '' || req.body.body === undefined) {
       //if body empty or no body - 400 Bad Request
       res.status(400).json({
           "status": 400,
           "message": "Must contain content"
       });
    }


    const height = await blockchain.getChainHeight();
    console.log(height);
    await blockchain.addBlock(new Blck(req.body.body));
    const response = await blockchain.getBlock(height);

    res.send(response);

    //console.log(JSON.stringify(response));
    //res.send(JSON.stringify(response));
});


app.post('/requestValidation', async (req, res) => {

    if (!req.body.address) {
       //if body empty or no body - 400 Bad Request
       res.status(400).json({
           "status": 400,
           "message": "Must contain address parameter"
       });
    }

    const address = req.body.address;

    try {
        response = await Star.pendingAddressRequest(address);
    } catch (err) {
        response = await Star.saveAddressRequest(address);
    }

    res.send(response);

    //console.log(JSON.stringify(response));
    //res.send(JSON.stringify(response));
});
