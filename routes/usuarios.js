//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

//  enrutamiento insertar login 
router.post('/insert', async function (req, res) {
  const data = req.body;
  const login = await  pool.db().collection('login').insertOne(data);

    if(!login){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(login));
    }
  });

  //  enrutamiento validar usuario
router.post('/select', async function (req, res) {
  const login = await pool.db().collection('login').find({user:req.body.user}).toArray();
  res.send(JSON.stringify(login));
});

//  enrutamiento validar usuario si existe en otro registro
router.post('/selectedit', async function (req, res) {
  const data = req.body
  const login = await pool.db().collection('login').find({user:data.user, _id: { $exists: true, $nin:  [new ObjectId(data.id)]  } }).toArray();
  res.send(JSON.stringify(login));

});

//  enrutamiento capturar usuarios
router.get('/select', async function (req, res) {
  const login = await pool.db().collection('login').aggregate([
    {
      $match :{state:1}
    },
    {
      $project:{
        _id:0,
        "id": "$_id",
        user:1,
        pass:1,
        state:1
      }
    }

  ]).toArray();
  res.send(JSON.stringify(login));
});

//  enrutamiento cambiar estado usuario
  router.put('/delete',async function(req, res) {
    const data = req.body;
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "state": 0,
      },
    };

    const login = await pool.db().collection('login').updateOne(
      filter,
      updateDoc
    );

    if(login.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(login));
    }
  });

  //  enrutamiento editar usuario
  router.put('/edit', async function(req, res) {
    const data = req.body;

    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "user": data.user,
        "pass": data.pass
      },
    };

    const login = await pool.db().collection('login').updateOne(
      filter,
      updateDoc
    );

    if(login.matchedCount === 0){
      const info =  {
          error:'Validar datos ingresados'
        }
        res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(login));
    }
  });
  
  module.exports = router;