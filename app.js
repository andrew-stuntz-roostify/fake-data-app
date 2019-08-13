var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var axios = require('axios');
var custom_encrypt = require('./encrypt');
var fs = require('fs');
var app = express();

var data = {
  greaterprimaryeci: {
    eci: 'greaterprimaryeci',
    first_name: 'Priya',
    middle_name: 'J',
    last_name: 'Rocks',
    email_address: 'pseethapathy+fmm111@roostify.com',
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

// gallus
// var ngrok_endpoint = 'https://roostify-gallus-qa.herokuapp.com'
// var bearer_token = "NjQ2MzA1MDEzNDE1MzI5ODpjNWM2OTlmNTMyNTEyMmU2"
// var account_id = "6463050134153298"

// whales 2
var ngrok_endpoint = "https://roostify-whales2-dev.herokuapp.com/"
var bearer_token = "NjMwOTg2Mjk1NjI5NjAzMjo3ZGExOGZiN2Q0OGZlNDky"
var account_id = "6309862956296032"

// var ngrok_endpoint = 'https://a1348963.ngrok.io'
// var bearer_token = "OTcwMDEzNjMzODY4MTM5MTpiYjQyMWIyNDZhMDJiZDlm"
// var bearer_token = "OTcwMDEzNjMzODY4MTM5MTpmNmQ3YzU1YThjYTExYWNh"
// var ngrok_endpoint = "https://roostify-dev-pr-9257.herokuapp.com"
// var bearer_token =  "OTcwMDEzNjMzODY4MTM5MTo0NjlhY2ExZTk2NWFlMDVm"
// var account_id = "9700136338681391"
var jwks = undefined

app.get('/document', function(req, res) {
  fs.readFile('/home/andrew-stuntz-roostify/fakeapp/fake_file.jpeg',  'base64', function(err, contents) {
    var x5c = jwks.keys[0].x5c[0]
    console.log(contents)
    var encrypted_data = custom_encrypt.run(
      x5c, jwks.keys[0], contents).then( result => {
      res.send(JSON.stringify(result))
    })
   });
})

app.get('/create_certificate', function(req, res) {
  // make cert
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>")
  console.log("Basic " + bearer_token)
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>")
  axios.post(ngrok_endpoint + '/api/v1/encryptions',
              {
                "account_id": account_id
              },
              {
                headers: {
                  "Authorization": "Basic " + bearer_token
                }
              }
            )
    .then(response => {
      console.log(response.data)
      res.send(200)
    })
    .catch(error => {
      console.log('error')
      console.log(error)
      console.log(error.response.data)
      res.send(400)
    })
})

app.get('/get_certificate', function(req, res) {
  // get cert
  axios.get(ngrok_endpoint + '/api/v1/encryptions/' + account_id, { headers: { "Authorization": "Basic " + bearer_token }})
    .then(response => {
      console.log(response.data)
      jwks = response.data
      res.send(200)
    })
    .catch(error => {
      console.log('error')
      res.send(400)
    });

})

app.get('/user', function(req, res) {
  console.log(jwks)
  var x5c = jwks.keys[0].x5c[0]
  var pathParams = JSON.parse(req.get('path-params'))
  console.log(pathParams)
  var eci = pathParams.eci
  console.log(eci)
  if (eci in data) {
    var encrypted_data = custom_encrypt.run(
      x5c, jwks.keys[0], Buffer.from(JSON.stringify(data[eci])).toString('base64')).then( result => {
      // log out headers for debugging
      console.log(req.headers)

      console.log(result)

      console.log(JSON.stringify(result))
      res.send(JSON.stringify(result));
    })
  } else {
    res.send(404);
  }
})

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
