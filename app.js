var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var axios = require('axios');
var app = express();

var data = {
  newprimaryeci1: {
    eci: 'newprimaryeci1',
    first_name: 'Philip',
    middle_name: 'J',
    last_name: 'Fry',
    email_address: 'pfry1@mail.momcorp',
    phone_number: '347-555-5321',
    address_line1_text: '651 W 57th St',
    address_line2_text: '',
    address_line3_text: '',
    city_text: 'New New York',
    state_code: 'NY',
    postal_area_code: '10019',
    transaction_id: 1,
    unique_transaction_id: 1,
    response_timestamp: 1537823477
  },
  newprimaryeci123: {
    eci: 'newprimaryeci',
    first_name: 'Leela',
    middle_name: '',
    last_name: 'Turanga',
    email_address: 'leela15@mail.momcorp',
    phone_number: '347-555-4893',
    address_line1_text: '651 W 57th St',
    address_line2_text: '',
    address_line3_text: '',
    city_text: 'New New York',
    state_code: 'NY',
    postal_area_code: '10019',
    transaction_id: 1,
    unique_transaction_id: 1,
    response_timestamp: 1537823477
  }
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/user', function(req, res) {
  if (eci in data) {
    res.send(data[eci]);
  } else {
    res.send(404);
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(res.locals.error)

  // render the error page
  res.status(err.status || 500);
  res.send({ 'error': err.message });
  console.log(err.message)
});

module.exports = app;
