var express = require('express');
var router = express.Router();
const request = require('request');

/*var chain = 'devnet';
var burnaddress = '1XXXXXXXd4XXXXXXgMXXXXXXUPXXXXXXTvtX2d';
var masteraddress = '17jRtkVEGJmo9KkK15E9tyviquVtuWt8t8VnMJ';
var asset = "Pesos";*/
var config = require('../config.json');
var chain = config.chain;
var options = config.options;
var burnaddress = config.burnaddress;
var masteraddress = config.masteraddress;
var asset = config.asset;


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
      res.send({
        "error": error.code
      });
    } else {
      //res.send(Buffer.from('hello world', 'utf8').toString('hex'));
      res.json(JSON.parse(body));
    }
  });
});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/nuevo/:usuario_id/:codigo_m/:solicitud_id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "getnewaddress",
    "params": [],
    "id": 1,
    "chain_name": chain
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
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
          res.send({
            "error": error.code
          });
        } else {
          respuesta2 = JSON.parse(body);
          options.body = JSON.stringify({
            "method": "publishfrom",
            "params": [respuesta.result, "usuarios", req.params.usuario_id, Buffer.from(req.params.solicitud_id, 'utf8').toString('hex')],
            "id": 1,
            "chain_name": chain
          });
          request(options, (error, response, body) => {
            if (error) {
              res.send({
                "error": error.code
              });
            } else {
              respuesta3 = JSON.parse(body);
              options.body = JSON.stringify({
                "method": "publishfrom",
                "params": [respuesta.result, "codigos", req.params.codigo_m, Buffer.from(req.params.solicitud_id, 'utf8').toString('hex')],
                "id": 1,
                "chain_name": chain
              });
              request(options, (error, response, body) => {
                if (error) {
                  res.send({
                    "error": error.code
                  });
                } else {
                  res.json({
                    'cartera_direccion': respuesta.result,
                    'solicitud_id': req.params.solicitud_id,
                    'error': null
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
    "params": ["usuarios", false, 99999],
    "id": 1,
    "chain_name": chain
  })
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
    } else {
      res.json(JSON.parse(body));
    }
  });
});



/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/saldo/:address/:codigo_m/:solicitud_id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.address, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
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
            res.send({
              "error": error.code
            });
          } else {
            respuesta = JSON.parse(body);
            respuesta.solicitud_id = req.params.solicitud_id;
            res.json(respuesta);
          }
        });
      }

    }
  });
});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/agregar_movimiento/:cartera_id/:concepto/:monto/:factura_id/:acreedor/:codigo_m/:solicitud_id', function(req, res, next) {

  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.cartera_id, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
    } else {
      codigos = JSON.parse(body);
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
              "acreedor": req.params.acreedor,
              "solicitud_id": req.params.solicitud_id
            }
          ],
          "id": 1,
          "chain_name": chain
        })
        request(options, (error, response, body) => {
          if (error) {
            res.send({
              "error": error.code
            });
          } else {
            respuesta = JSON.parse(body);
            respuesta.solicitud_id = req.params.solicitud_id;
            res.json(respuesta);
          }
        });
      }
    }

  });

});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/transferir/:cartera_id/:destino/:concepto/:monto/:factura_id/:acreedor/:codigo_m/:solicitud_id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.cartera_id, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
    } else {
      codigos = JSON.parse(body);
      if (codigos.error != null || codigos.result[0].key != req.params.codigo_m) {
        res.send({
          "error": "codigo incorrecto"
        });
      } else {
        options.body = JSON.stringify({
          "method": "sendassetfrom",
          "params": [req.params.cartera_id, req.params.destino, asset, parseInt(req.params.monto), 0,
            '{"concepto":"' + req.params.concepto + '","factura_id":"' + req.params.factura_id +
            '","acreedor":"' + req.params.acreedor + '","solicitud_id":"' + req.params.solicitud_id + '"}'
          ],
          "id": 1,
          "chain_name": chain
        })
        request(options, (error, response, body) => {
          if (error) {
            res.send({
              "error": error.code
            });
          } else {
            respuesta = JSON.parse(body);
            respuesta.solicitud_id = req.params.solicitud_id;
            res.json(respuesta);
          }
        });
      }
    }

  });

});

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/quemar/:cartera_id/:concepto/:monto/:factura_id/:codigo_m/:solicitud_id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.cartera_id, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
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
            '","acreedor":"' + req.params.acreedor + '","solicitud_id":"' + req.params.solicitud_id + '"}'
          ],
          "id": 1,
          "chain_name": chain
        })
        request(options, (error, response, body) => {
          if (error) {
            res.send({
              "error": error.code
            });
          } else {
            respuesta = JSON.parse(body);
            respuesta.solicitud_id = req.params.solicitud_id;
            res.json(respuesta);
          }
        });
      }
    }

  });

});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/movimientos/:address/:codigo_m/:solicitud_id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreampublisheritems",
    "params": ["codigos", req.params.address, false, 1],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
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
            res.send({
              "error": error.code
            });
          } else {
            var todos = JSON.parse(body);
            todos = todos.result;
            var movimientos = todos.filter(function(d) {
              return d.balance.assets.length > 0;
            });
            for (var i = 0, length = movimientos.length; i < length; i++) {
              if (typeof movimientos[i].issue !="undefined"){
                movimientos[i].details=movimientos[i].issue.details;
              }
              if (typeof movimientos[i].comment !="undefined"){
                movimientos[i].details=JSON.parse(movimientos[i].comment);
              }
            }
            res.json({
              "movimientos": movimientos,
              "solicitud_id": req.params.solicitud_id
            });
          }
        });
      }
    }
  });
});

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/usuario/:usuario_id', function(req, res, next) {
  obtenercartera(req.params.usuario_id, function(respuesta) {
    console.log(respuesta);
    res.send(respuesta);
  });
});

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/agregar_registro/:hora/:usuario_id/:accion/:id/:argumento', function(req, res, next) {
  obtenercartera(req.params.usuario_id, function(cartera) {
    var datos = {
      "hora": req.params.hora,
      "usuario_id": req.params.usuario_id,
      "accion": req.params.accion,
      "argumento": req.params.argumento
    }
    options.body = JSON.stringify({
      "method": "publishfrom",
      "params": [cartera.cartera_id, "registros", req.params.id, Buffer.from(JSON.stringify(datos), 'utf8').toString('hex')],
      "id": 1,
      "chain_name": chain
    });
    request(options, (error, response, body) => {
      if (error) {
        res.send({
          "error": error.code
        });
      } else {
        res.json(JSON.parse(body));
      }
    });


  });
});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/obtener_registro_especifico/:id', function(req, res, next) {
  options.body = JSON.stringify({
    "method": "liststreamkeyitems",
    "params": ["registros", req.params.id],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      res.send({
        "error": error.code
      });
    } else {
      respuesta = JSON.parse(body);
      console.log(respuesta.result[0]);
      if (typeof(respuesta.result[0]) != "undefined") {
        res.send({
          "error": null,
          "id": req.params.id,
          "datos": JSON.parse(Buffer.from(respuesta.result[0].data, "hex"))
        });

      } else {
        res.send({
          "error": "No existe registro"
        })
      }
    }
  });
});


/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/leer_registros/:usuario_id', function(req, res, next) {
  obtenercartera(req.params.usuario_id, function(cartera) {
    options.body = JSON.stringify({
      "method": "liststreampublisheritems",
      "params": ["registros", cartera.cartera_id, true],
      "id": 1,
      "chain_name": chain
    });
    request(options, (error, response, body) => {
      if (error) {
        res.send({
          "error": error.code
        });
      } else {
        var retorno = [];
        var respuesta = JSON.parse(body);
        respuesta = respuesta.result;
        console.log(respuesta);
        for (key in respuesta) {
          console.log(key, respuesta[key]);
          retorno[key] = {
            "id": respuesta[key].key,
            "datos": JSON.parse(Buffer.from(respuesta[key].data, "hex"))
          };
        }
        res.send({
          "error": null,
          "registros": retorno
        });
      }
    });
  });
});

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/admin/:clave/cambia_codigo/:cartera_id/:nuevo_codigo_m', function(req, res, next) {
  if (req.params.clave != config.admin_clave) {
    res.send({
      "error": "codigo incorrecto"
    });
  } else {
    options.body = JSON.stringify({
      "method": "publishfrom",
      "params": [req.params.cartera_id, "codigos", req.params.nuevo_codigo_m, "3230323335353032393835"],
      "id": 1,
      "chain_name": chain
    });

    request(options, (error, response, body) => {
      if (error) {
        res.send({
          "error": error.code
        });
      } else {
        res.json(JSON.parse(body));
      }
    });
  }
});

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
router.get('/admin/:clave/movimientos/:address', function(req, res, next) {
  if (req.params.clave != config.admin_clave) {
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
        res.send({
          "error": error.code
        });
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
});


/*******************************************************************/
async function obtenercartera(usuario, callback) {
  options.body = JSON.stringify({
    "method": "liststreamkeys",
    "params": ["usuarios", usuario, true],
    "id": 1,
    "chain_name": chain
  });
  request(options, (error, response, body) => {
    if (error) {
      callback({
        "error": error.code
      });
    } else {
      var respuesta = JSON.parse(body);
      respuesta = respuesta.result[0];
      if (respuesta.items == 0) {
        callback({
          "cartera_id": 0,
          "error": null
        });
      } else {
        console.log(respuesta.last.publishers[0]);
        callback({
          "cartera_id": respuesta.last.publishers[0],
          "error": null
        });
      }
    }
  });
}


module.exports = router;
