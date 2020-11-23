const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
const Pool = require('pg').Pool;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var HttpStatus = require('http-status-codes');



router.get('/genInsert', ( req, res ) => {

    const server   = req.query.server;
    const database = req.query.database;
    const user     = req.query.user;
    const pass     = req.query.password;
    const motor    = req.query.motor;
    const esquema  = req.query.esquema;          
    const tabla    = req.query.tabla;
    var ejecutar = 0;

    if( req.query.ejecutar === 'true' ){
        ejecutar = 1;
    }


    if( motor === 'MSQL' ){

        const routePool = new sql.ConnectionPool({
            user: user,
            password: pass,
            server: server,
            database: database
         });

    routePool.connect().then(pool => {

        return pool.request()
            .input('esquema', sql.VarChar(100), esquema)
            .input('tabla', sql.VarChar(100), tabla)
            .input('ejecutar', sql.Bit, ejecutar)
            .execute('autogeneration.generar_inserts');
            
    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json( val.recordset[0] );

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( { code: err.message } );

    });
    }else{
  
        const connection = new Pool( {
            user: user,
            host: server,
            database: database,
            password: pass,
            port: 5432
        });

        connection.connect(( err, client, release ) =>{

            if ( err ){
                connection.end();
                return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json( { error: err } )
            }

             var query = `select autogeneration.genInsProc('${esquema}', ${ejecutar}) as code`;
            client.query( query, ( err, result ) => {
                release();

                if ( err ) {
                    return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json({ error: err })
                }

                console.log(result.rows)

                return res.status(HttpStatus.OK).json(   result.rows[0]  );

            })

        })
    }

});

router.get('/genUpdate', ( req, res ) => {

    const server    = req.query.server;
    const database  = req.query.database;
    const user      = req.query.user;
    const pass      = req.query.password;
    const motor     = req.query.motor;
    const esquema   = req.query.esquema;
    const tabla     = req.query.tabla;
    var ejecutar = 0;

    if( req.query.ejecutar === 'true' ){
        ejecutar = 1;
    }


    if ( motor === 'MSQL' ){

        const routePool = new sql.ConnectionPool({
            user:     user,
            password: pass,
            server:   server,
            database: database
        });

        routePool.connect().then(pool => {

            return pool.request()
                .input('esquema', sql.VarChar(100), esquema)
                .input('tabla', sql.VarChar(100), tabla)
                .input('ejecutar', sql.Bit, ejecutar)
                .execute('autogeneration.generar_updates');
        }).then(val => {
            routePool.close();
            res.status(HttpStatus.OK).json( val.recordset[0] );

        }).catch(err => {

            routePool.close();
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: err.message });
       
        });

    }else{

        const connection = new Pool({
            user: user,
            host: server,
            database: database,
            password: pass,
            port: 5432
        });

        connection.connect(( err, client, release ) => {

            if ( err ){
                connection.end();
                return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json( {error: err})
            }

            var query = `select autogeneration.genEditProc('${esquema}', ${ejecutar}) as code`;
            client.query( query, ( err, result ) => {
                release();

                if ( err ){
                    return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json({ error: err})
                }

                return res.status(HttpStatus.OK).json(result.rows[0]);
            })
        })
    }
});

router.get('/genDelete', (req, res) => {

    

    const server   = req.query.server;
    const database = req.query.database;
    const user     = req.query.user;
    const pass     = req.query.password;
    const motor    = req.query.motor;
    const esquema  = req.query.esquema;          
    const tabla    = req.query.tabla;
    var ejecutar = 0;

    if( req.query.ejecutar === 'true' ){
        ejecutar = 1;
    }

    if( motor === 'MSQL' ){

        const routePool = new sql.ConnectionPool({
            user: user,
            password: pass,
            server: server,
            database: database
         });

        routePool.connect().then(pool => {

            return pool.request()
            .input('esquema', sql.VarChar(100), esquema)
            .input('tabla', sql.VarChar(100), tabla )
            .input ('ejecutar', sql.Bit, ejecutar)
            .execute('autogeneration.generar_deletes');
            
        }).then(val => {
            routePool.close();
            res.status(HttpStatus.OK).json( val.recordset[0] );

        }).catch(err => {

            routePool.close();
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({code: err.message});

        });

    }else{
        const connection = new Pool( {
            user: user,
            host: server,
            database: database,
            password: pass,
            port: 5432
        });

        connection.connect(( err, client, release ) =>{

            if ( err ){
                connection.end();
                return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json( { error: err } )
            }

             var query = `select autogeneration.genElimProc('${esquema}', ${ejecutar}) as code`;
            client.query( query, ( err, result ) => {
                release();

                if ( err ) {
                    return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json({ error: err })
                }

                console.log(result.rows)

                return res.status(HttpStatus.OK).json(   result.rows[0]  );

            })

        })
    }
})







router.get('/genGets', ( req, res ) => {

    
    const server   = req.query.server;
    const database = req.query.database;
    const user     = req.query.user;
    const pass     = req.query.password;
    const motor    = req.query.motor;
    const esquema  = req.query.esquema;          
    const tabla    = req.query.tabla;
    var ejecutar = 0;

    if( req.query.ejecutar === 'true' ){
        ejecutar = 1;
    }


    if( motor === 'MSQL'){


    const routePool = new sql.ConnectionPool({
        user: user,
        password: pass,
        server: server,
        database: database
        });

    routePool.connect().then(pool => {

        return pool.request()
            .input('esquema', sql.VarChar(100), esquema)
            .input('tabla', sql.VarChar(100), tabla)
            .execute('autogeneration.generar_gets');
            
    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json( val.recordset[0] );

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( { code: err.message } );

    });

}else{

    const connection = new Pool( {
        user: user,
        host: server,
        database: database,
        password: pass,
        port: 5432
    });

    connection.connect(( err, client, release ) =>{

        if ( err ){
            connection.end();
            return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json( { error: err } )
        }

         var query = `select autogeneration.genObtProc('${esquema}', ${ejecutar}) as code`;
        client.query( query, ( err, result ) => {
            release();

            if ( err ) {
                return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json({ error: err })
            }

            console.log(result.rows)

            return res.status(HttpStatus.OK).json(   result.rows[0]  );

        })

    })
}


});





module.exports = router;