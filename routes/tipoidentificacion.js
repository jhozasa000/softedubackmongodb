//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')

// enrutamienta para capturar el tipo de identificacion
router.get('/select',async  function (req, res) {
    const tipo = await pool.db().collection('tipoidentificacion').aggregate( [
            { $match : { state :1} },
            { 
                $project : { name : 1 , _id : 0,"id": "$_id" } 
            } ,
            
        ] ).toArray();
    res.send(JSON.stringify(tipo));
});

  
  module.exports = router;