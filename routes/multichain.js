var express = require('express');
var router = express.Router();
const request = require('request');

let chain = 'devnet';
let burnaddress='1XXXXXXX1XXXXXXXBtXXXXXXeyXXXXXXbBxUxP';
let masteraddress='14qWfFFiKZgTbFNarcgDdZq5Vsahki5fsfAXVE';
let asset = "Patacon";
let options = {
  url: "http://192.168.1.107:5746",
  method: "POST",
  headers: {
    "content-type": "text/plain"
  },
  auth: {
    user: 'multichainrpc',
    pass: '6egQ5Jruf36R6h1UDbUFYrCHzaxmm1TfyNurzruU9jby'
  },
};

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/getinfo', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "getinfo",
    "params": [],
    "id": 1,
    "chain_name": chain
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      res.json(JSON.parse(body));
    }
  });
});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/nuevo/:usuario_id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "getnewaddress",
    "params": [],
    "id": 1,
    "chain_name": chain
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      respuesta = JSON.parse(body);
      options.body = JSON.stringify({
        "method": "grant",
        "params": [respuesta.result, "send,receive"],
        "id": 1,
        "chain_name": chain
      });
      request(options, (error, response, body) => {
        if (error) {
          res.send(error);
        } else {
          respuesta2 = JSON.parse(body);
          options.body = JSON.stringify({
            "method": "publishfrom",
            "params": [respuesta.result, "usuarios", req.params.usuario_id, "3230323335353032393835"],
            "id": 1,
            "chain_name": chain
          });
          request(options, (error, response, body) => {
            if (error) {
              res.send(error);
            } else {
              res.json({
                'cartera_direccion': respuesta.result
              });
            }

          });
        }
      });
    }
  });
});
/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/cuentas', function(req, res, next) {
  options.body = JSON.stringify({"method":"liststreamitems","params":["usuarios"],"id":1,"chain_name":chain})
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      res.json(JSON.parse(body));
    }
  });
});



/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/saldo/:address', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "getaddressbalances",
    "params": [req.params.address],
    "id": 1,
    "chain_name": chain
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      res.json(JSON.parse(body));
    }
  });
});



/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/agregar_movimiento/:cartera_id/:concepto/:monto/:factura_id/:acreedor', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "issuemorefrom",
    "params": [masteraddress, req.params.cartera_id, asset, parseInt(req.params.monto),0,
      {"concepto":req.params.concepto,"factura_id":req.params.factura_id,"acreedor":req.params.acreedor}],
    "id": 1,
    "chain_name": chain
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      res.json(JSON.parse(body));
    }
  });
});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/quemar/:cartera_id/:concepto/:monto/:factura_id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "sendassetfrom",
    "params": [req.params.cartera_id, burnaddress,asset, parseInt(req.params.monto),0,
      '{"concepto":"'+req.params.concepto+'","factura_id":"'+req.params.factura_id+
      '","acreedor":"'+req.params.acreedor+'"}'],
    "id": 1,
    "chain_name": chain
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      console.log(body);
      res.json(JSON.parse(body));
    }
  });
});

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/movimientos/:address', function(req, res, next) {
  options.body = JSON.stringify({"method":"listaddresstransactions","params":[req.params.address],"id":1,"chain_name":chain})
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      var todos=JSON.parse(body);
      todos=todos.result;
      var movimientos = todos.filter(function(d) { return d.balance.assets.length>0; });
      res.json(movimientos);
    }
  });
});




module.exports = router;
