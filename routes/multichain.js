var express = require('express');
var router = express.Router();
const request = require('request');

let options = {
    url: "http://192.168.1.113:6764",
    method: "POST",
    headers:
    {
     "content-type": "text/plain"
    },
    auth: {
        user: 'multichainrpc',
        pass: 'CChZjGeMdYWFvHXcApdMnWBiFPUhvTEsE9AjvgDLkkgc'
    },
  //  body: JSON.stringify({"method":"getinfo","params":[],"id":1,"chain_name":"chain1"})
};



/* GET information. */
router.get('/getinfo', function(req, res, next) {
  options.body=JSON.stringify({"method":"getinfo","params":[],"id":1,"chain_name":"chain1"})
  request(options, (error, response, body) => {
      if (error) {
          console.error('An error has occurred: ', error);
          res.send(error);
      } else {
          console.log('Exito: response: ', body);
          res.json(JSON.parse(body));
      }
  });

});

module.exports = router;
