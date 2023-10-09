// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar anuncios */
router.post('/insert',async function (req, res) {

  const data = req.body;
  const anuncios = await  pool.db().collection('anuncios').insertOne(data);

    if(!anuncios){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(anuncios));
    }
  });


//  enrutamiento capturar anuncios
router.get('/select',async function (req, res) {
  const anuncios = await pool.db().collection('anuncios').find({state:1}).toArray();
  res.send(JSON.stringify(anuncios));
  });

//  enrutamiento cambiar estado anuncios
  router.put('/delete', async function(req, res) {
    const data = req.body;

    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0
      },
    };
    const anuncios = await pool.db().collection('anuncios').updateOne(
      filter,
      updateDoc
    );
    if(anuncios.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(anuncios));
    } 
  
  });

  //  enrutamiento editar anuncios
  router.put('/edit', async function(req, res) {
    const data = req.body;

    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "title": data.title,
        "description": data.description,
        "date": data.date
      },
    };

    const anuncios = await pool.db().collection('anuncios').updateOne(
      filter,
      updateDoc
    );

    if(anuncios.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(anuncios));
    } 

  });
  
  module.exports = router;