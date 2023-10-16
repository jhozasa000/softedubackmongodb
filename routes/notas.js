//plantilla nodejs

// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

/* insertar notas */
router.post('/insert',async function (req, res) {
  const data = req.body;
  const datos = {
          idstu: new ObjectId(data.idstu),
          subject: new ObjectId(data.subject),
          period: data.period,
          note: data.note,
          state:1
        }
  const estudiantes = await  pool.db().collection('notas').insertOne(datos);

  if(!estudiantes){
    const info =  {
        error:'Validar datos ingresados'
      }
      res.send(JSON.stringify(info));
  }else{
      res.send(JSON.stringify(estudiantes));
  }
});

//  enrutamiento capturar datos estudiantes
router.post('/select',async function (req, res) {



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
    },{
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
          $or:[
            { 'fromEstudiantes.numberid': { $regex : req.body.datafind.toString()}  },
            { 'fromEstudiantes.name': { $regex : req.body.datafind.toString()}  },
            { 'fromEstudiantes.lastname': { $regex : req.body.datafind.toString()}  }
          ],
          $and:[
            { 'state': 1  }
          
          ]
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
  
  ]).toArray()

   res.send(JSON.stringify(estudiantes));




  /*  pool.getConnection(function (err, connection) {
        connection.query(`SELECT sturel.id,idstu,idgra, stu.name,stu.lastname,stu.numberid , gra.name namegra, cal.name namecal, jor.name namejor FROM estudiantesrelacion sturel INNER JOIN estudiantes stu ON sturel.idstu = stu.id INNER JOIN grados gra ON sturel.idgra = gra.id INNER JOIN calendario cal ON gra.idcal = cal.id INNER JOIN jornada jor ON gra.idjor = jor.id 
          WHERE 
          (stu.name LIKE '%${req.body.datafind}%' 
          OR stu.lastname LIKE '%${req.body.datafind}%' 
          OR CAST(stu.numberid as CHAR) LIKE '%${(req.body.datafind)}%')  
        
          AND sturel.state = 1  
       
        ORDER BY stu.name` , function (err, rows) {
            connection.release();
            res.send(JSON.stringify(rows));
        });
    });*/
});

//  enrutamiento capturar notas del estudiante
router.post('/findnotes',async  function (req, res) {
  console.log('req.body.idstu   ,.,.,.,     ', req.body.idstu);
  const findnotes = await pool.db().collection('notas').aggregate([
    {
      $lookup:{
        from:'materias',
        localField:'subject',
        foreignField:'_id',
        as:'fromMaterias'
      }
    },
    {
      $unwind: "$fromMaterias"
    },
    {
      $match:{
          "idstu" : new ObjectId(req.body.idstu)
      }
    },
    { $sort : { period : 1,'fromMaterias.name':1 } },
    {
      $project: 
      {
        _id:0,
        'id': '$_id', 
        note:1,
        subject:1,
        period:1,
        "name":'$fromMaterias.name'
      }
    }
  ]).toArray()

 let nuevoArray    = []
  let arrayTemporal = []
   findnotes.map(({id,note,period,subject,name},x) => {



    console.log('periodo::  ', period.toString());

      arrayTemporal = nuevoArray.filter(resp => resp.period == period && resp.subject == subject.toString()) 
          if(arrayTemporal.length > 0){
            nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["notas"].push({id:id,num:note})
        }else{	
            nuevoArray.push({"name":name,  "period" : period ,"subject" : subject , "notas" : [{id:id,num:note}]})
        }
  })
  res.send(JSON.stringify(nuevoArray));
});

//  enrutamiento capturar materias
router.post('/findsignature',async function (req, res) {

  const findnotes = await pool.db().collection('materias').aggregate([
    {
      $lookup:{
        from:'materiasrelacion',
        localField:'_id',
        foreignField:'idm',
        as:'fromMaterias'
      }
    },
    {
      $unwind: "$fromMaterias"
    },
    {
      $match:{
          $and:[
            {
              "fromMaterias.idg" :new ObjectId(req.body.idgra),
              "state":1,
              "fromMaterias.state":1
            }
          ]
      }
    },
    {
      $group: 
      {
        _id:{
          name:"$name",
          id:"$_id"
        }
      }
    },

  ]).toArray()
  let newdata = []
  for await( let info of findnotes){
      newdata.push(info._id)
  }
  res.send(JSON.stringify(newdata))
});


//enrutamiento notas para estadisticas
router.get('/loadnotescharts',async function (req, res) {
  const loadnotescharts = await pool.db().collection('notas').aggregate([
    {
      $lookup:{
        from:'materias',
        localField:'subject',
        foreignField:'_id',
        as:'fromMaterias'
      }
    },
    {
      $unwind: "$fromMaterias"
    },
    {
      $match:{
          $and:[{"idstu" : new ObjectId(req.body.idstu)}]
      }
    },
    {
      $project: 
      {
        _id:0,
        'id': '$_id', 
        idstu:1,
        note:1,
        subject:1,
        period:1,
        "name":'$fromMaterias.name'
      }
    },
    { $sort : { period : 1,'fromMaterias.name':1 } }
  ]).toArray()
  

  let nuevoArray    = []
  let arrayTemporal = []
  loadnotescharts.map(({id,note,period,subject,name,idstu},x) => {
      arrayTemporal = nuevoArray.filter(resp => resp.period == period && resp.subject == subject && resp.idstu == idstu) 
          if(arrayTemporal.length>0){
            nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["notas"].push({id:id,num:note})
        }else{	
            nuevoArray.push({"idstu":idstu  ,"name":name,  "period" : period ,"subject" : subject , "notas" : [{id:id,num:note}]})
        }
  })
  res.send(JSON.stringify(nuevoArray));
});


//  enrutamiento editar notas 
  router.put('/edit', function(req, res,next) {

    const info = req.body.uptnotes

    info.map(async({id,num},x) => {
      const filter = {"_id": new ObjectId(id)};
      const updateDoc = {
        $set: {
          "note": num != '' ? num : 0
        },
      };
      const notas = await pool.db().collection('notas').updateOne(
        filter,
        updateDoc
      );
      if(notas.matchedCount === 0){
        const info =  {
            error:'Validar datos ingresados'
          }
          res.send(JSON.stringify(info));
      }else{
        if(info.length-1 === x){
          res.send(JSON.stringify(notas));
        }
      }
    })
});
  
  module.exports = router;