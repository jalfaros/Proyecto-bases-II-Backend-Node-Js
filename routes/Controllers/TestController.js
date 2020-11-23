const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const sql = require('mssql');
const Pool = require('pg').Pool;


const HttpStatus = require('http-status-codes');




router.post ( '/testing', ( req, res ) => {

    const server   = req.body.server;
    const database = req.body.database;
    const user     = req.body.user;
    const pass     = req.body.password;
    const motor    = req.body.motor;
    const port     = req.body.port;


    if ( motor === 'MSQL' ){

        const routePool = new sql.ConnectionPool({
            
            user: user,
            password: pass,
            server: server,
            database: database, 
         });

        routePool.connect().then( pool => {

            routePool.close();
            res.status( HttpStatus.OK ).json({ res: true })

        }).catch( err => {
        
            routePool.close();
            res.status(HttpStatus.OK).json( { res: false } )
        })

        
    }else {
        
        const connection = new Pool( {
            user: user,
            host: server,
            database: database,
            password: pass,
            port: 5432
        });

        connection.connect(( err ) => {   
        

            if ( err ) { 
                connection.end()
                return res.status( HttpStatus.OK ).json({ res: false })          
            }

            return res.status( HttpStatus.OK ).json({ res: true })
              
        })
    }
})



module.exports = router;