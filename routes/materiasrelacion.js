//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar materiasrelacion */
router.post('/insert',async  function (req, res) {
  const data = req.body;
  const datos = {
          idm: new ObjectId(data.idm),
          idg: new ObjectId(data.idg),
          idd: new ObjectId(data.idd),
          state:1
        }
  const materias = await  pool.db().collection('materiasrelacion').insertOne(datos);

  if(!materias){
    const info =  {
        error:'Validar datos ingresados'
      }
      res.send(JSON.stringify(info));
  }else{
      res.send(JSON.stringify(materias));
  }
});

//  enrutamiento validar relacion grado materia y docente
router.post('/select',async function (req, res) {
  const materias = await pool.db().collection('materiasrelacion').find({idm:new ObjectId(req.body.idm),idg:new ObjectId(req.body.idg),idd:new ObjectId(req.body.idd)}).toArray();
  res.send(JSON.stringify(materias));
});

//  enrutamiento capturar docentes
router.get('/select',async function (req, res) {

  const materiasrelacion =  await pool.db().collection('materiasrelacion').aggregate([
    {
        $lookup:{
            from:'materias',
            localField:'idm',
            foreignField:'_id',
            as:'fromMaterias'
        }
    },
    {
      $unwind: "$fromMaterias"
    },
    {
      $lookup:{
          from:'grados',
          localField:'idg',
          foreignField:'_id',
          as:'fromGrados'
      }
  },
  {
    $unwind: "$fromGrados"
  },
  {
    $lookup:{
        from:'docentes',
        localField:'idd',
        foreignField:'_id',
        as:'fromDocentes'
    }
  },
  {
    $unwind: "$fromDocentes"
  },
  {
    $lookup:{
        from:'profesion',
        localField:'fromDocentes.profession',
        foreignField:'_id',
        as:'fromProfesion'
    }
  },
  {
    $unwind: "$fromProfesion"
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
      $sort: {'fromGrados.name':1,'fromCalendario.name':1,'fromJornada.name':1}
    },
    {
      $project: {
      _id:0,
      'id': '$_id', 
      idm:1,
      idg:1,
      idd:1,
      'namemat': '$fromMaterias.name', 
      'namegra': '$fromGrados.name',
      'namedoc': '$fromDocentes.name',
      'numberid': '$fromDocentes.numberid',
      'namepro': '$fromProfesion.name',
      'namecal': '$fromCalendario.name',
      'namejor': '$fromJornada.name'
  }}
    
   ]).toArray();
   res.send(JSON.stringify(materiasrelacion));
  });

//  enrutamiento cambiar estado relacion de materia
  router.put('/delete',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
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


//  enrutamiento editar relacion
  router.put('/edit',async  function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "idm": new ObjectId(data.idm),
        "idg": new ObjectId(data.idg),
        "idd": new ObjectId(data.idd),
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