//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar estudiantesrelacion */
router.post('/insert',async function (req, res) {
  const data = req.body;
  const datos = {
          idstu: new ObjectId(data.idstu),
          idgra: new ObjectId(data.idgra),
          state:1
        }
  const estudiantes = await  pool.db().collection('estudiantesrelacion').insertOne(datos);

  if(!estudiantes){
    const info =  {
        error:'Validar datos ingresados'
      }
      res.send(JSON.stringify(info));
  }else{
      res.send(JSON.stringify(estudiantes));
  }
});

  //  enrutamiento validar estudiante relacion
router.post('/select',async function (req, res) {
  const estudiantes = await pool.db().collection('estudiantesrelacion').find({idstu:new ObjectId(req.body.idstu),idgra:new ObjectId(req.body.idgra)}).toArray();
  res.send(JSON.stringify(estudiantes));
});

//  enrutamiento capturar estudiante relacion
router.get('/select',async function (req, res) {
  const estudiantes =  await pool.db().collection('estudiantesrelacion').aggregate([
    {
        $lookup:{
            from:'estudiantes',
            localField:'idstu',
            foreignField:'_id',
            as:'fromEstudiantes'
        }
    },
    {
      $unwind: "$fromEstudiantes"
    },
    {
      $lookup:{
          from:'grados',
          localField:'idgra',
          foreignField:'_id',
          as:'fromGrados'
      }
    },
    {
      $unwind: "$fromGrados"
    },
    {
      $lookup:{
          from:'calendario',
          localField:'fromGrados.idcal',
          foreignField:'_id',
          as:'fromCalendario'
      }
    },
    {
      $unwind: "$fromCalendario"
    },
    {
      $lookup:{
          from:'jornada',
          localField:'fromGrados.idjor',
          foreignField:'_id',
          as:'fromJornada'
      }
    },
    {
      $unwind: "$fromJornada"
    },
    {
      $match:{
          $and:[{"state" : 1}]
      }
    },
    {
      $project: {
      _id:0,
      'id': '$_id', 
      idstu:1,
      idgra:1,
      'numberid':'$fromEstudiantes.numberid',
      'name':'$fromEstudiantes.name',
      'lastname':'$fromEstudiantes.lastname',
      'namegra': '$fromGrados.name',
      'namecal': '$fromCalendario.name',
      'namejor': '$fromJornada.name'
  }}
    
   ]).toArray();
   res.send(JSON.stringify(estudiantes));
});

//  enrutamiento cambiar estado estudiante relacion
  router.put('/delete',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const estudiantes = await pool.db().collection('estudiantesrelacion').updateOne(
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

  //  enrutamiento editar estudiante relacion
  router.put('/edit',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "idstu": new ObjectId(data.idstu),
        "idgra": new ObjectId(data.idgra),
      },
    };
    const materiasrelacion = await pool.db().collection('materiasrelacion').updateOne(
      filter,
      updateDoc
    );
    if(materiasrelacion.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(materiasrelacion));
    }
});
  
  module.exports = router;