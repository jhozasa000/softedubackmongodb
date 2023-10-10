// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar calendario */
router.post('/insert', async  function (req, res) {

  const data = req.body;
  const calendario = await  pool.db().collection('calendario').insertOne(data);

    if(!calendario){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(calendario));
    }
  });

  //  enrutamiento validar calendario
router.post('/select',async function (req, res) {
  const calendario = await pool.db().collection('calendario').find({state:1,name :req.body.name}).toArray();
  res.send(JSON.stringify(calendario));
});

//  enrutamiento capturar calendario
router.get('/select',async  function (req, res) {
  const calendario = await pool.db().collection('calendario').find({state:1}).toArray();
  res.send(JSON.stringify(calendario));

});

//  enrutamiento cambiar estado calendario
  router.put('/delete', async function(req, res) {
    const data = req.body;

    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const calendario = await pool.db().collection('calendario').updateOne(
      filter,
      updateDoc
    );
    if(calendario.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(calendario));
    } 
  
  });

  //  enrutamiento editar calendario
  router.put('/edit',async  function(req, res) {
    const data = req.body;

    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name
      },
    };
    const calendario = await pool.db().collection('calendario').updateOne(
      filter,
      updateDoc
    );
    if(calendario.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(calendario));
    } 
  
  });
  
  module.exports = router;