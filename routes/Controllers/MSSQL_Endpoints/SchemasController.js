const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
const conn = require('./dbconn');
const Pool = require('pg').Pool;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var HttpStatus = require('http-status-codes');





router.get('/getEsquemas', (req, res) => {

  

    const server   = req.query.server;
    const database = req.query.database;
    const user     = req.query.user;
    const pass     = req.query.password;
    const motor    = req.query.motor;

    if ( motor === 'MSQL' ){

        const routePool = new sql.ConnectionPool({
            user: user,
            password: pass,
            server: server,
            database: database
         });

         routePool.connect().then( pool => {
            return pool.request()
                .execute( 'front.getEsquemas' );
         }).then( val => {
             routePool.close();
             res.status( HttpStatus.OK ).json( { data: val.recordset } );
         }).catch( kalimba => {
             routePool.close();
             res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json( { code: kalimba.message } );
         })

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

            client.query( "select schema_name as esquema from INFORMATION_SCHEMA.schemata where schema_owner = 'postgres' ", ( err, result ) => {
                release();

                if ( err ) {
                    return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json({ error: err })
                }

                return res.status(HttpStatus.OK).json( { data: result.rows } );
            })


        })

    }
    
    
});




router.post('/genEsquema', (req, res) => {

    const server       = req.body.server;
    const database     = req.body.database;
    const user         = req.body.user;
    const password     = req.body.password;
    const motor        = req.body.motor;
    const port         = req.body.port;
    const nuevoEsquema = req.body.nuevoEsquema;

    if ( motor === 'MSQL' ){

        const routePool = new sql.ConnectionPool({
            user: user,
            password: password,
            server: server,
            database: database
         });

         routePool.connect().then( pool => {
            
            return pool.request()
                .input('esquema', sql.VarChar(  100  ), nuevoEsquema)
                .execute( 'front.crearEsquemas' );

         }).then( val => {
             
             routePool.close();
             res.status( HttpStatus.OK ).json( { data: val.recordset } );


         }).catch( kalimba => {

             routePool.close();
             res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json( { code: kalimba.message } );
         })


    }else {

        const connection = new Pool( {
            user: user,
            host: server,
            database: database,
            password: password,
            port: 5432
        });
    
        connection.connect(( err, client, release ) =>{
    
            if ( err ){
                connection.end();
                return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json( { error: err } )
            }

            var query = `CREATE SCHEMA ${nuevoEsquema}`;
            console.log(query);
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