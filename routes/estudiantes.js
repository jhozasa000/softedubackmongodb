//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar estudiantes */
router.post('/insert',async function (req, res) {
  const data = req.body;
  const datos = {
          name: data.name,
          lastname: data.lastname,
          typeid: new ObjectId(data.typeid),
          numberid: data.numberid,
          datebirth: data.datebirth,
          telephone: data.telephone,
          email: data.email,
          state:1
        }
  const estudiantes = await  pool.db().collection('estudiantes').insertOne(datos);

  if(!estudiantes){
    const info =  {
        error:'Validar datos ingresados'
      }
      res.send(JSON.stringify(info));
  }else{
      res.send(JSON.stringify(estudiantes));
  }
});

  //  enrutamiento validar estudiante con numero de identificacion
router.post('/select',async  function (req, res) {
  const estudiantes = await pool.db().collection('estudiantes').find({numberid:req.body.numberid}).toArray();
  res.send(JSON.stringify(estudiantes));
});

//  enrutamiento capturar estudiantes
router.get('/select',async function (req, res) {
  const estudiantes =  await pool.db().collection('estudiantes').aggregate([
    {
        $lookup:{
            from:'tipoidentificacion',
            localField:'typeid',
            foreignField:'_id',
            as:'fromTipoidentificacion'
        }
    },
    {
      $unwind: "$fromTipoidentificacion"
    },
    {
      $match:{
          $and:[{"state" : 1}]
      }
    },
    {
      $project: 
      {
        _id:0,
        'id': '$_id', 
        name:1,
        lastname:1,
        typeid: 1, 
        numberid: 1,
        datebirth: 1,
        telephone: 1,
        email: 1,
        'nametipo': '$fromTipoidentificacion.name',
      }
    }
    
   ]).toArray();
   res.send(JSON.stringify(estudiantes));

});

//  enrutamiento cambiar estado estudiante
  router.put('/delete',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const estudiantes = await pool.db().collection('estudiantes').updateOne(
      filter,
      updateDoc
    );
    if(estudiantes.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(estudiantes));
    }
  
  });

  //  enrutamiento editar estudiante
  router.put('/edit',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name,
        "lastname": data.lastname,
        "typeid": new ObjectId(data.typeid),
        "numberid": data.numberid,
        "datebirth": data.datebirth,
        "telephone": data.telephone,
        "email": data.email,
      },
    };
    const estudiantes = await pool.db().collection('estudiantes').updateOne(
      filter,
      updateDoc
    );
    if(estudiantes.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(estudiantes));
    }
  });
  
  module.exports = router;