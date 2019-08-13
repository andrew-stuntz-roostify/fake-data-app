var ossl = require('openssl-wrapper')
var crypto = require('crypto')
var exports = module.exports = {}
var jose = require('@panva/jose')
var BBPromise = require('bluebird')
const opensslAsync = BBPromise.promisify(ossl.exec);

const ENCRYPTION_KEY = "mUZ9oQjdalKcn8rHGoD2aA3boYESX3ClmZhN1WDfi5Q="
const IV = "CVRnrTW8lxwyb+MTI3c7vA=="

function encryptAES(text) {
  let iv = Buffer.from(IV, 'base64')
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  console.log('encrypted =>', encrypted.toString('base64'))

  // this is the required data to rebuild a cipher to decrypt our payload
  return {
    "encryptedString": encrypted.toString('base64'),
  }
}

async function generate_jwk(pemFile) {
  return jose.JWK.asKey(pemFile)
}

async function run (x5c, jwk, data) {
  let certificateBuffer = Buffer.from(x5c, 'base64');
  let jwe = undefined
  return opensslAsync('x509', certificateBuffer, { inform: 'der', outform: 'pem' })
    .then(pemCertBuffer => {
      publicCert = pemCertBuffer.toString('utf8'); // PEM encoded public key safe to use now
      return getJWE(x5c, jwk, publicCert, data)
  });
}

async function getJWE (x5c, jwk, pemCert, data) {
  // need x509 to pem formatted key
  // It will beehoove you to use the pem formatted key here
  var key = await generate_jwk(pemCert)

  // encrypt data "My encrypted data"
  var encrypted_encoded_data = encryptAES(data)

  // create the aes json object
  var aes = {
    key: ENCRYPTION_KEY,
    iv: IV
  }
  var stringified_base64key = Buffer.from(JSON.stringify(aes)).toString('base64')

  var jwe = await jose.JWE.encrypt(stringified_base64key, key)

  // build out the expected response
  response = {
    encrypted_payload: encrypted_encoded_data["encryptedString"],
    encrypted_key: Buffer.from(jwe).toString('base64')
  }

  console.log(response)
  return response
}

module.exports.run = run;
