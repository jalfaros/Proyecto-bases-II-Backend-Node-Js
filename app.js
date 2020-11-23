const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});



const generatorController =   require( './routes/Controllers/MSSQL_Endpoints/GeneratorController' );
const tablesController    =   require( './routes/Controllers/MSSQL_Endpoints/TablesController' )
const schemasController   =   require( './routes/Controllers/MSSQL_Endpoints/SchemasController')


//Testeando el endpoint


app.use('/generate', generatorController)
app.use('/tables', tablesController)
app.use('/schema', schemasController)



//const controller = require ( './routes/Controllers/PostgreSQL_Endpoints/PostgreController' )
//app.use('/prueba', controller )   

const controller = require( './routes/Controllers/TestController' )
        
app.use( '/test', controller ); 


app.use((req, res) => {
    res.sendStatus(404);
});


app.use((err, req, res) => {
    res.status(err.status || 500)
        .json({ error: { message: err.message } });
});


module.exports = app;
