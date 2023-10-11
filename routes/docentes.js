//variable de la libreria para subir archivos
const multer = require('multer');
// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
//carga de varibales globales
require('dotenv').config();
const outputPath = process.env.URL_FILES_TEACHERS
const ObjectId = require('mongodb').ObjectId;

// funcion para redireccionar el archivo y el nombre
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
   // cb(null, "./public/files");
    cb(null, outputPath);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `teacherfile-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});


/* insertar docentes */
router.post('/insert',upload.single('files'), async function (req, res) {
  const data = req.body;

  const datos = {
    name: data.name,
    numberid: data.numberid,
    profession: new ObjectId(data.profession),
    telephone: data.telephone,
    address: data.address,
    files: req?.file?.filename??'',
    state:1
  }
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
  router.put('/edit',upload.single('files'),async function(req, res) {
    const data = req.body;
    const imgNew = req?.file?.filename??data.filesbd
    const filter = {"_id": new ObjectId(data.id)};
    const updateDoc = {
      $set: {
        "name": data.name,
        "profession": new ObjectId(data.profession),
        "telephone": data.telephone,
        "address": data.address,
        "files": imgNew

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