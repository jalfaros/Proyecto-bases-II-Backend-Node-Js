const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
const conn = require('./dbconn');
const routePool = new sql.ConnectionPool(conn);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var HttpStatus = require('http-status-codes');


router.get('/getTablas', (req, res) => {

    routePool.connect().then(pool => {
        
        return pool.request()
        .execute('front.getTablas');
        

    }).then(val => {

        routePool.close();
        res.status(HttpStatus.OK).json(  { data: val.recordset }   );

    }).catch(err => {

        routePool.close();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json( { code: err.message } );

    });
});


module.exports = router;