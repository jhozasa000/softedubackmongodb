const { describe } = require('test');
const pool = require('../database/dbmongo')
const ObjectId = require('mongodb').ObjectId;

describe('borra tablas', () => {
  test('Debe vaciar las colletion', async () => {
    pool.db().collection('login').deleteOne( { "user" :"test" } );
    pool.db().collection('calendario').deleteMany()
    pool.db().collection('jornada').deleteMany()
    pool.db().collection('profesion').deleteMany()
    pool.db().collection('docentes').deleteMany()
    pool.db().collection('grados').deleteMany()
    pool.db().collection('materias').deleteMany()
    pool.db().collection('materiasrelacion').deleteMany()
    pool.db().collection('estudiantes').deleteMany()
    pool.db().collection('estudiantesrelacion').deleteMany()
    pool.db().collection('anuncios').deleteMany()
    pool.db().collection('notas').deleteMany()
  });
})

describe('login',  () => {
    test('Debe capturar usuario para iniciar sesion en la collection login', async () => {
      const users =   pool.db().collection('login');
      const mockUser = {user: 'admin', pass:'123', state: 1 };
      const insertedUser = await users.findOne({user: 'admin'});
      expect(insertedUser).toEqual(expect.objectContaining(mockUser));
    });
});

describe('usuario',  () => {
  test('Debe insertar usuario en la collection login', async () => {
    const users =   pool.db().collection('login');
    const mockUser = {user: 'test', pass:'123', state: 1,level:1 };
    await users.insertOne(mockUser)
    const insertedUser = await users.findOne({user: 'test', state: 1});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe capturar usuario en la collection login', async () => {
    const users =   pool.db().collection('login');
    const mockUser = {user: 'test', pass:'123' };
    const insertedUser = await users.findOne({user: 'test'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar usuario en la collection login', async () => {
    const users =   pool.db().collection('login');
    const filter = {"user": "test"};
    const updateDoc = {
      $set: {
        "pass": '456',
      },
    };

     await pool.db().collection('login').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { pass: '456' };
    const insertedUser = await users.findOne({user: 'test'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });  
});

describe('calendario',  () => {

  test('Debe insertar calendario en la collection calendario', async () => {
    const anuncios =   pool.db().collection('calendario');
    const mockUser = {
        name: 'Calendario test', 
        state: 1,
    };
    await anuncios.insertOne(mockUser)
    const insertedUser = await anuncios.findOne({name: 'Calendario test'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe capturar calendario en la collection calendario', async () => {
    const anuncios =   pool.db().collection('calendario');
    const mockUser = {name: 'Calendario test',state: 1, };
    const insertedUser = await anuncios.findOne({name: 'Calendario test'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar calendario en la collection calendario', async () => {
    const anuncios =   pool.db().collection('calendario');
    const filter = {name: 'Calendario test'};
    const updateDoc = {
      $set: {
        "name": 'Calendario test sena',
      },
    };

     await pool.db().collection('calendario').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { state: 1 };
    const insertedUser = await anuncios.findOne({name: 'Calendario test sena'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });
  
});

describe('jornada',  () => {

  test('Debe insertar jornada en la collection jornada', async () => {
    const anuncios =   pool.db().collection('jornada');
    const mockUser = {
        name: 'mixto', 
        state: 1,
    };
    await anuncios.insertOne(mockUser)
    const insertedUser = await anuncios.findOne({name: 'mixto'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe capturar jornada en la collection jornada', async () => {
    const anuncios =   pool.db().collection('jornada');
    const mockUser = {name: 'mixto',state: 1, };
    const insertedUser = await anuncios.findOne({name: 'mixto'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar jornada en la collection jornada', async () => {
    const anuncios =   pool.db().collection('jornada');
    const filter = {name: 'mixto'};
    const updateDoc = {
      $set: {
        "name": 'mixto sena',
      },
    };

     await pool.db().collection('jornada').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { name: 'mixto sena' };
    const insertedUser = await anuncios.findOne({name: 'mixto sena'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

});

describe('profesion',  () => {

  test('Debe insertar profesion en la collection profesion', async () => {
    const anuncios =   pool.db().collection('profesion');
    const mockUser = {
        name: 'Agronomo', 
        state: 1,
    };
    await anuncios.insertOne(mockUser)
    const insertedUser = await anuncios.findOne({name: 'Agronomo'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe capturar profesion en la collection profesion', async () => {
    const anuncios =   pool.db().collection('profesion');
    const mockUser = {name: 'Agronomo',state: 1, };
    const insertedUser = await anuncios.findOne({name: 'Agronomo'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar profesion en la collection profesion', async () => {
    const anuncios =   pool.db().collection('profesion');
    const filter = {name: 'Agronomo'};
    const updateDoc = {
      $set: {
        "name": 'Agronomo sena',
      },
    };

     await pool.db().collection('profesion').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { name: 'Agronomo sena' };
    const insertedUser = await anuncios.findOne({name: 'Agronomo sena'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });
  
});

describe('docente',  () => {

  test('Debe insertar docente en la collection docentes', async () => {
    const docentes =   pool.db().collection('docentes');
    const idPro =  await pool.db().collection('profesion').findOne({name:"Agronomo sena"})
    const mockUser = {
        name: 'carlos sena prueba', 
        numberid:'11504',
        profession:new ObjectId(idPro._id),  
        state: 1,
        telephone:'53343454',
        address: 'avenida 4 #45',
        files:''
    };
    await docentes.insertOne(mockUser)
    const insertedUser = await docentes.findOne({numberid:'11504'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

 test('Debe capturar anuncio en la collection docentes', async () => {
    const docentes =   pool.db().collection('docentes');
    const mockUser = {numberid:'11504', state:1 };
    const insertedUser = await docentes.findOne({numberid:'11504'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar anuncio en la collection docentes', async () => {
    const docentes =   pool.db().collection('docentes');
    const filter = {numberid: '11504'};
    const updateDoc = {
      $set: {
        "telephone": '48939393',
        "address" : 'callejon sin salida casa numero 3'
      },
    };

     await pool.db().collection('docentes').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { telephone:'48939393' };
    const insertedUser = await docentes.findOne({numberid:'11504'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

});

describe('grado',  () => {

  test('Debe insertar grados en la collection grados', async () => {
    const anuncios =   pool.db().collection('grados');
    const idCal =  await pool.db().collection('calendario').findOne({name:"Calendario test sena"})
    const idJor =  await pool.db().collection('jornada').findOne({name:"mixto sena"})
    const mockUser = {
        name: 'grado sena', 
        idcal: new ObjectId(idCal._id),
        idjor: new ObjectId(idJor._id),
        state: 1,
    };
    await anuncios.insertOne(mockUser)
    const insertedUser = await anuncios.findOne({name: 'grado sena'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe capturar grados en la collection grados', async () => {
    const anuncios =   pool.db().collection('grados');
    const mockUser = {name: 'grado sena',state: 1, };
    const insertedUser = await anuncios.findOne({name: 'grado sena'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar grados en la collection grados', async () => {
    const anuncios =   pool.db().collection('grados');
    const filter = {name: 'grado sena'};
    const updateDoc = {
      $set: {
        "name": "grado sena test",
      },
    };

     await pool.db().collection('grados').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { name: 'grado sena test' };
    const insertedUser = await anuncios.findOne({name: 'grado sena test'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  
});

describe('materia',  () => {

  test('Debe insertar materia en la collection materias', async () => {
    const anuncios =   pool.db().collection('materias');
    const mockUser = {
        name: 'desarrollo de software', 
        state: 1,
    };
    await anuncios.insertOne(mockUser)
    const insertedUser = await anuncios.findOne({name: 'desarrollo de software'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe capturar materia en la collection materias', async () => {
    const anuncios =   pool.db().collection('materias');
    const mockUser = {name: 'desarrollo de software',state: 1, };
    const insertedUser = await anuncios.findOne({name: 'desarrollo de software'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar materia en la collection materias', async () => {
    const anuncios =   pool.db().collection('materias');
    const filter = {name: 'desarrollo de software',state:1};
    const updateDoc = {
      $set: {
        "name": 'desarrollo de software sena',
      },
    };

     await pool.db().collection('materias').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { name: 'desarrollo de software sena' ,state: 1};
    const insertedUser = await anuncios.findOne({name: 'desarrollo de software sena'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });
  
});

describe('materia relacion',  () => {

  test('Debe insertar materia en la collection materias', async () => {
    const anuncios =   pool.db().collection('materiasrelacion');

    const idm =  await pool.db().collection('materias').findOne({name:"desarrollo de software sena"})
    const idg =  await pool.db().collection('grados').findOne({name:"grado sena test"})
    const idd =  await pool.db().collection('docentes').findOne({numberid:'11504'})

    const mockUser = {
        idm: new ObjectId(idm._id),
        idg: new ObjectId(idg._id),
        idd: new ObjectId(idd._id),
        state:1
    };
    const res = await anuncios.insertOne(mockUser)
    const insertedUser = await anuncios.findOne({_id: new ObjectId(res.insertedId)});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  
});

describe('estudiante', () => {
  test('Debe insertar estudiante en la collection estudiantes', async () => {
    const estudiantes =   pool.db().collection('estudiantes');
    const idtypeid =  await pool.db().collection('tipoidentificacion').findOne({name:"Cédula de ciudadanía"})
    const mockUser = {
      name: 'Jennifer Andrea',
      lastname: 'Ospina correa',
      typeid: new ObjectId(idtypeid._id),
      numberid: '1144178885',
      datebirth: '1994-07-15',
      telephone: '3236773213',
      email: 'andreaospi88@gmail.com',
      state:1
    };
    await estudiantes.insertOne(mockUser)
    const insertedUser = await estudiantes.findOne({numberid: '1144178885'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });
})

describe('estudiante relacion ', () => {
  test('Debe insertar relacion estudiante grado en la collection estudiantesrelacion', async () => {
    const estudiantes =   pool.db().collection('estudiantesrelacion');
    const idstu =  await pool.db().collection('estudiantes').findOne({numberid:'1144178885'})
    const idgra =  await pool.db().collection('grados').findOne({name:"grado sena test"})
    const mockUser = {
      idstu: new ObjectId(idstu._id),
      idgra: new ObjectId(idgra._id),
      state:1
    }
    await estudiantes.insertOne(mockUser)
    const insertedUser = await estudiantes.findOne({idstu: new ObjectId(idstu._id)});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });
})

describe('anuncios',  () => {

  test('Debe insertar anuncio en la collection anuncios', async () => {
    const anuncios =   pool.db().collection('anuncios');
    const mockUser = {
        title: 'test prueba', 
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mi dolor, elementum vitae blandit eget, facilisis eu lectus.', 
        state: 1,
        date:'2023-11-25' 
    };
    await anuncios.insertOne(mockUser)
    const insertedUser = await anuncios.findOne({title: 'test prueba'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe capturar anuncio en la collection anuncios', async () => {
    const anuncios =   pool.db().collection('anuncios');
    const mockUser = {title: 'test prueba', date:'2023-11-25' };
    const insertedUser = await anuncios.findOne({title: 'test prueba'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

  test('Debe actualizar anuncio en la collection anuncios', async () => {
    const anuncios =   pool.db().collection('anuncios');
    const filter = {title: 'test prueba'};
    const updateDoc = {
      $set: {
        date:'2023-12-25'
      },
    };

     await pool.db().collection('anuncios').updateOne(
      filter,
      updateDoc
    );

    const mockUser = { state: 1 , date:'2023-12-25'};
    const insertedUser = await anuncios.findOne({title: 'test prueba'});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });
  
});

describe('notas', () =>{
  test('Debe insertar notas del estudiante en la collection notas', async () => {
    const notas =   pool.db().collection('notas');
    const idstu =  await pool.db().collection('estudiantes').findOne({numberid:'1144178885'})
    const idsubject =  await pool.db().collection('materias').findOne({name:"desarrollo de software sena"})
    const mockUser = {
      idstu: new ObjectId(idstu._id),
      subject: new ObjectId(idsubject._id),
      period: 1,
      note: "4.5",
      state:1
    };
    await notas.insertOne(mockUser)
    const insertedUser = await notas.findOne({idstu: new ObjectId(idstu._id)});
    expect(insertedUser).toEqual(expect.objectContaining(mockUser));
  });

})



// finalizacion conexion #############################################
afterAll(async () => {
  await pool.close();
});