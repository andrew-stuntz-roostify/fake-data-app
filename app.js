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
    ssn: '512-44-0151',
    dob: '04/01/1994',
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
    ssn: '368-68-8987',
    dob: '01/27/1983',
    transaction_id: 1,
    unique_transaction_id: 1,
    response_timestamp: 1537823477
  }
}

app.get('/user', function(req, res) {
  // log out headers for debugging
  console.log(req.headers)

  // pull path params from header
  var pathParams = JSON.parse(req.get('path-params'))

  // the eci is in the path params
  var eci = pathParams.eci

  // if we can match the eci return the data
  if (eci in data) {
    console.log(JSON.stringify(data[eci]))
    res.send(JSON.stringify(data[eci]));
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
