//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar profesion */
router.post('/insert',async  function (req, res) {
  const data = req.body;
  const profesion = await  pool.db().collection('profesion').insertOne(data);

    if(!profesion){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(profesion));
    }
  });

  //  enrutamiento validar profesion
router.post('/select', async function (req, res) {
  const profesion = await pool.db().collection('profesion').find({name :req.body.name}).toArray();
  res.send(JSON.stringify(profesion));
});

//  enrutamiento capturar profesion
router.get('/select',async function (req, res) {
  const profesion = await pool.db().collection('profesion').find({state:1}).toArray();
  res.send(JSON.stringify(profesion));
});

//  enrutamiento cambiar estado profesion
  router.put('/delete',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const profesion = await pool.db().collection('profesion').updateOne(
      filter,
      updateDoc
    );
    if(profesion.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(profesion));
    }
  
  });

//  enrutamiento editar profesion
  router.put('/edit',async  function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name
      },
    };
    const profesion = await pool.db().collection('profesion').updateOne(
      filter,
      updateDoc
    );
    if(profesion.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(profesion));
    }
  
  });
  
  module.exports = router;