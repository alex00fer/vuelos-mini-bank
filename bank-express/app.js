var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')

var indexRouter = require('./routes/index');
var paymentsRouter = require('./routes/payments');
var transactionsRouter = require('./routes/transactions');
var registerRouter = require('./routes/register');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/', indexRouter);
app.use('/payments', paymentsRouter);
app.use('/transactions', transactionsRouter);
app.use('/register', registerRouter);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

module.exports = app;
