//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar grados */
router.post('/insert',async function (req, res) {
  const data = req.body;
  const datos = {
          name: data.name,
          idcal: new ObjectId(data.idcal),
          idjor: new ObjectId(data.idjor),
          state:1
        }
  const grados = await  pool.db().collection('grados').insertOne(datos);

  if(!grados){
    const info =  {
        error:'Validar datos ingresados'
      }
      res.send(JSON.stringify(info));
  }else{
      res.send(JSON.stringify(grados));
  }

});

  //  enrutamiento validar grados
router.post('/select',async  function (req, res) {
  const grados = await pool.db().collection('grados').find({name:req.body.name,idcal:new ObjectId(req.body.idcal),idjor:new ObjectId(req.body.idjor)}).toArray();
  res.send(JSON.stringify(grados));
});

//  enrutamiento capturar grados
router.get('/select',async  function (req, res) {

  const grados =  await pool.db().collection('grados').aggregate( [
    {
        $lookup:{
            from:'calendario',
            localField:'idcal',
            foreignField:'_id',
            as:'fromCal'
        }
    },
    {
      $unwind: "$fromCal"
    },
    {
      $lookup: {
          from: "jornada",
          localField: "idjor",
          foreignField: "_id",
          as: "fromJor"
      }
    },
    {
        $unwind: "$fromJor"
    },
    {
      $match:{
          $and:[{"state" : 1}]
      }
    }
   ]).toArray();

  res.send(JSON.stringify(grados));

});

//  enrutamiento eliminar grados
  router.put('/delete', async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const grados = await pool.db().collection('grados').updateOne(
      filter,
      updateDoc
    );
    if(grados.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(grados));
    }
  
  });

  //  enrutamiento editar grados
  router.put('/edit',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name,
        "idcal": new ObjectId(data.idcal),
        "idjor" : new ObjectId(data.idjor)
      },
    };
    const grados = await pool.db().collection('grados').updateOne(
      filter,
      updateDoc
    );
    if(grados.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(grados));
    }
  });
  
  module.exports = router;