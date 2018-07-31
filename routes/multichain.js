var express = require('express');
var router = express.Router();
const request = require('request');

let options = {
  url: "http://192.168.1.113:6764",
  method: "POST",
  headers: {
    "content-type": "text/plain"
  },
  auth: {
    user: 'multichainrpc',
    pass: 'CChZjGeMdYWFvHXcApdMnWBiFPUhvTEsE9AjvgDLkkgc'
  },
  //  body: JSON.stringify({"method":"getinfo","params":[],"id":1,"chain_name":"chain1"})
};

router.get('/getinfo', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "getinfo",
    "params": [],
    "id": 1,
    "chain_name": "chain1"
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      res.json(JSON.parse(body));
    }
  });
});

router.get('/saldo/:address', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "getaddressbalances",
    "params": [req.params.address],
    "id": 1,
    "chain_name": "chain1"
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      res.json(JSON.parse(body));
    }
  });
});

router.get('/transferir/:desde/:hasta/:monto', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "sendassetfrom",
    "params": [req.params.desde,req.params.hasta,"patacon3",parseInt(req.params.monto)],
    "id": 1,
    "chain_name": "chain1"
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      res.json(JSON.parse(body));
    }
  });
});

module.exports = router;
