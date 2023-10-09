// Importing express module 
const express = require("express") 
const router = express.Router() 
const pool = require('../database/dbmongo')
  
// Handling request using router 
router.post("/",async(req,res,next)=>{ 
    const data = req.body
    const usuarios = await pool.db().collection('login').findOne(data);
    if(!usuarios){
        const info =  {
            error:'Validar datos ingresados'
          }
          res.send(JSON.stringify(info));
    }else{
        res.send(JSON.stringify(usuarios));
    }
    
}) 
  
module.exports = router