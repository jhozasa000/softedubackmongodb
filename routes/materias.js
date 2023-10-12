//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar materias */
router.post('/insert',async function (req, res) {
  const data = req.body;
  const datos = {
          name: data.name,
          state:1
        }
  const materias = await  pool.db().collection('materias').insertOne(datos);

  if(!materias){
    const info =  {
        error:'Validar datos ingresados'
      }
      res.send(JSON.stringify(info));
  }else{
      res.send(JSON.stringify(materias));
  }
});

//  enrutamiento insertar materias
router.post('/select',async function (req, res) {
  const materias = await pool.db().collection('materias').find({name:req.body.name}).toArray();
  res.send(JSON.stringify(materias));

});


//  enrutamiento capturar materias
router.get('/select',async function (req, res) {
  const materias = await pool.db().collection('materias').find({state:1}).toArray();
  res.send(JSON.stringify(materias));
});

//  enrutamiento cambiar estado materias
  router.put('/delete',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const materias = await pool.db().collection('materias').updateOne(
      filter,
      updateDoc
    );
    if(materias.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(materias));
    }
  
  });
  
//  enrutamiento editar materia 
  router.put('/edit',async  function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name
      },
    };
    const materias = await pool.db().collection('materias').updateOne(
      filter,
      updateDoc
    );
    if(materias.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(materias));
    }
});
  
  module.exports = router;