const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/nooradb',
    {
        useNewUrlParser: true

       
    }
    )




const app = express();

const productRoutes= require('./api/routes/products');
const callsRoutes= require('./api/routes/calls');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/products',productRoutes);
app.use('/calls',callsRoutes);

app.use((req,res,next) => {
    const error = new Error('NOT FOUND');
    error.status=404;
    next(error);
});

app.use((error, req, res, next ) => {
    res.status(error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;