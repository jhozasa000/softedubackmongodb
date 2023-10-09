// Importing express module 
const express = require("express") 
const router = express.Router() 
const pool = require('../database/dbmongo')
  
// Handling request using router 
router.post("/",async(req,res,next)=>{ 
   // client.db().collection('login').insertOne({ user: 'admin', pass: '123', level: 1 , state: 1 });

   // const usuarios = await pool.db().collection('login').find().toArray();
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