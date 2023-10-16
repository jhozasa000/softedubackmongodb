// variables de enrutamiento
var express = require('express');
var router = express.Router();
//variable de la base de datos
const pool = require('../database/dbmongo')
// variable global se carga
require('dotenv').config();
// libreria para generar pdf
const puppeteer = require('puppeteer');
const outputPath = process.env.URL_FILES
const ObjectId = require('mongodb').ObjectId;

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

//  enrutamiento pasar datos para generar pdf
router.post('/report',function(req,res){
    const html = req.body.htmlpdf
    exportWebsiteAsPdf(html)
    res.send(JSON.stringify(`reporte.pdf`));
})

//  funcion que genera el pdf y lo guarda
async function exportWebsiteAsPdf(html) {
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: 'new'
    });

    // Create a new page
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // Download the PDF
    const PDF = await page.pdf({
      path: `${outputPath}reporte.pdf`,
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    // Close the browser instance
    await browser.close();

    return PDF;
  }



module.exports = router;