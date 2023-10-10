// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar jornada */
router.post('/insert',async function (req, res) {

  const data = req.body;
  const jornada = await  pool.db().collection('jornada').insertOne(data);

    if(!jornada){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(jornada));
    }
  });

  //  enrutamiento validar jornada
router.post('/select',async function (req, res) {
  const jornada = await pool.db().collection('jornada').find({state:1,name :req.body.name}).toArray();
  res.send(JSON.stringify(jornada));
});

//  enrutamiento capturar jornadas
router.get('/select',async  function (req, res) {
  const jornada = await pool.db().collection('jornada').find({state:1}).toArray();
  res.send(JSON.stringify(jornada));
});

//  enrutamiento cambiar estado jornada
  router.put('/delete',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const jornada = await pool.db().collection('jornada').updateOne(
      filter,
      updateDoc
    );
    if(jornada.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(jornada));
    } 
  
  });

  //  enrutamiento editar jornada
  router.put('/edit',async function(req, res) {
    const data = req.body;

    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name
      },
    };
    const jornada = await pool.db().collection('jornada').updateOne(
      filter,
      updateDoc
    );
    if(jornada.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(jornada));
    } 
  
  });
  
  module.exports = router;