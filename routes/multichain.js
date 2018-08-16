var express = require('express');
var router = express.Router();
const request = require('request');

var chain = 'devnet';
var burnaddress = '1XXXXXXXd4XXXXXXgMXXXXXXUPXXXXXXTvtX2d';
var masteraddress = '17jRtkVEGJmo9KkK15E9tyviquVtuWt8t8VnMJ';
var asset = "Pesos";
var options = {
  url: "http://158.69.63.214:8080/",
  method: "POST",
  headers: {
    "content-type": "text/plain"
  },
  auth: {
    user: 'multichainrpc',
    pass: 'Gwc9pNzRvAv4dyQB6QW8LzbVxuMBsYWXoUytXBJyS3UT'
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
router.get('/nuevo/:usuario_id/:codigo_m', function(req, res, next) {
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
        "params": [respuesta.result, "send,receive,issue"],
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
              respuesta3 = JSON.parse(body);
              options.body = JSON.stringify({
                "method": "publishfrom",
                "params": [respuesta.result, "codigos", req.params.codigo_m, "3230323335353032393835"],
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
    }
  });

});
/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/cuentas', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreamitems",
    "params": ["usuarios"],
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
router.get('/saldo/:address/:codigo_m', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.address, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      codigos = JSON.parse(body);
      console.log(codigos);
      if (codigos.error != null || codigos.result[0].key != req.params.codigo_m) {
        res.send({
          "error": "codigo incorrecto"
        });
      } else {
        options.body = JSON.stringify({
          "method": "getaddressbalances",
          "params": [req.params.address],
          "id": 1,
          "chain_name": chain
        });
        request(options, (error, response, body) => {
          if (error) {
            res.send(error);
          } else {
            res.json(JSON.parse(body));
          }
        });
      }

    }
  });
});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/agregar_movimiento/:cartera_id/:concepto/:monto/:factura_id/:acreedor/:codigo_m', function(req, res, next) {

  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.cartera_id, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      codigos = JSON.parse(body);
      console.log(options)
      console.log(codigos);

      if (codigos.error != null || codigos.result[0].key != req.params.codigo_m) {
        res.send({
          "error": "codigo incorrecto"
        });
      } else {
        options.body = JSON.stringify({
          "method": "issuemorefrom",
          "params": [masteraddress, req.params.cartera_id, asset, parseInt(req.params.monto), 0,
            {
              "concepto": req.params.concepto,
              "factura_id": req.params.factura_id,
              "acreedor": req.params.acreedor
            }
          ],
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
      }
    }

  });

});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/quemar/:cartera_id/:concepto/:monto/:factura_id/:codigo_m', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.cartera_id, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      codigos = JSON.parse(body);
      console.log(codigos);
      if (codigos.error != null || codigos.result[0].key != req.params.codigo_m) {
        res.send({
          "error": "codigo incorrecto"
        });
      } else {
        options.body = JSON.stringify({
          "method": "sendassetfrom",
          "params": [req.params.cartera_id, burnaddress, asset, parseInt(req.params.monto), 0,
            '{"concepto":"' + req.params.concepto + '","factura_id":"' + req.params.factura_id +
            '","acreedor":"' + req.params.acreedor + '"}'
          ],
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
      }
    }

  });

});

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/movimientos/:address/:codigo_m', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.address, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send(error);
    } else {
      codigos = JSON.parse(body);
      console.log(codigos);
      if (codigos.error != null || codigos.result[0].key != req.params.codigo_m) {
        res.send({
          "error": "codigo incorrecto"
        });
      } else {
        options.body = JSON.stringify({
          "method": "listaddresstransactions",
          "params": [req.params.address],
          "id": 1,
          "chain_name": chain
        })
        request(options, (error, response, body) => {
          if (error) {
            res.send(error);
          } else {
            var todos = JSON.parse(body);
            todos = todos.result;
            var movimientos = todos.filter(function(d) {
              return d.balance.assets.length > 0;
            });
            res.json(movimientos);
          }
        });
      }
    }
  });
});




module.exports = router;
