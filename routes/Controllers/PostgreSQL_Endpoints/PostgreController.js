const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var pool = require('./pg_poll')
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var HttpStatus = require('http-status-codes');


router.get( '/probando', ( req, res ) => {
    
    pool.connect(( err, client, release ) => {   
        

        if ( err ) { 
            pool.end()
            return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json({ error: err })            
        }

        client.query ( 'SELECT * from personas;', ( err, result ) => {
            
            release();
        
            if( err ){
               
                return res.status( HttpStatus.INTERNAL_SERVER_ERROR ).json({ error: err })    
            }

            return res.status(HttpStatus.OK).json( { code: result.rows } );

        })
    })
})






module.exports = router;