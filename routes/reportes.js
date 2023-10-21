// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
// variable global se carga

//  enrutamiento validar estudiante
router.post('/select',async function (req, res) {
    const reportes = await pool.db().collection('estudiantes').aggregate([  
      {
        $lookup:{
            from:'estudiantesrelacion',
            localField:'_id',
            foreignField:'idstu',
            as:'fromEstudiantes'
        }
      },
      {
        $unwind: "$fromEstudiantes"
      },
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
        $lookup:{
            from:'grados',
            localField:'fromEstudiantes.idgra',
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

          numberid: req.body.idnumber
        }
      },
      {
        $project: 
          {
            _id:0,
            'id': '$_id', 
            numberid:1,
            name:1,
            lastname:1,
            datebirth:1,
            email:1,
            telephone:1,
            'namegra': '$fromGrados.name',
            'namecal': '$fromCalendario.name',
            'namejor': '$fromJornada.name',
            'nametip': '$fromTipoidentificacion.name'
          }
      }
    ]).toArray()
    res.send(JSON.stringify(reportes))
   
});



module.exports = router;