// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar docentes */
router.post('/insert', async function (req, res) {
  const data = req.body;
  const datos = {
    name: data.name,
    numberid: data.numberid,
    profession: new ObjectId(data.profession),
    telephone: data.telephone,
    address: data.address,
    state:1,
    files:data.files
  }

  console.log('datos   ', datos  );

 const docentes = await  pool.db().collection('docentes').insertOne(datos);

   if(!docentes){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(docentes));
    }
});

  //  enrutamiento validar docente 
router.post('/select',async  function (req, res) {
  const docentes = await pool.db().collection('docentes').find({numberid:req.body.numberid}).toArray();
  res.send(JSON.stringify(docentes));
});

//  enrutamiento capturar docentes
router.get('/select',async  function (req, res) {

  const docentes =  await pool.db().collection('docentes').aggregate( [
  {
      $lookup:{
          from:'profesion',
          localField:'profession',
          foreignField:'_id',
          as:'fromProfession'
      }
  },
  {
    $unwind:"$fromProfession"
  },
  {
    $match:{
        $and:[{"state" : 1}]
    }
  },

  {
    $project:{
      _id : 0,
      "id": "$_id",
      name:1,
      numberid:1,
      telephone:1,
      address:1,
      files:1,
      "profession":"$fromProfession.name",
      "idpro":"$fromProfession._id"
    }
  }
 ] ).toArray();

  res.send(JSON.stringify(docentes));
});

//  enrutamiento estado docente
  router.put('/delete',async  function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const docentes = await pool.db().collection('docentes').updateOne(
      filter,
      updateDoc
    );
    if(docentes.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(docentes));
    } 
  
  });

  //  enrutamiento editar docente
router.put('/edit',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name,
        "profession": new ObjectId(data.profession),
        "telephone": data.telephone,
        "address": data.address,
        "files": data.files
      },
    };
    const docentes = await pool.db().collection('docentes').updateOne(
      filter,
      updateDoc
    );
    if(docentes.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(docentes));
    } 
  
  });
  
  module.exports = router;