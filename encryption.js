var ngrok_endpoint = 'https://7fc689a0.ngrok.io'
var bearer_token = "OTcwMDEzNjMzODY4MTM5MTpkYjdmZjk5NTVkN2RjZTk1"

app.get('/create_certificate', function(req, res) {
  // make cert
  axios.post(ngrok_endpoint + '/api/v1/encryptions', { "account_id":  "9700136338681391" }, { headers: { "Authorization": "Basic " + bearer_token }})
    .then(response => {
      console.log(response.data)
      res.send(200)
    })
    .catch(error => {
      console.log('error')
      console.log(error)
      console.log(error.data)
      res.send(400)
    })
})

app.get('/get_certificate', function(req, res) {
  // get cert
  axios.get(ngrok_endpoint + '/api/v1/encryptions/9700136338681391', { headers: { "Authorization": "Basic " + bearer_token }})
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

const ENCRYPTION_KEY = "mUZ9oQjdalKcn8rHGoD2aA3boYESX3ClmZhN1WDfi5Q="
const IV_LENGTH = 16; // For AES, this is always 16
const IV = 'Ll08LRoSK+gLaXvoyWoqhg=='
const X509 = "-----BEGIN CERTIFICATE-----\nMIID+jCCAuKgAwIBAgIJVBA3avizOBkxMA0GCSqGSIb3DQEBCwUAMFoxCzAJBgNV\nBAYTAlVTMQswCQYDVQQIDAJDQTERMA8GA1UECgwIUm9vc3RpZnkxFDASBgNVBAsM\nC0VuZ2luZWVyaW5nMRUwEwYDVQQDDAxyb29zdGlmeS5jb20wHhcNMTkwMjIwMjAz\nNzAyWhcNMjAwMjIwMjAzNzAyWjBaMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0Ex\nETAPBgNVBAoMCFJvb3N0aWZ5MRQwEgYDVQQLDAtFbmdpbmVlcmluZzEVMBMGA1UE\nAwwMcm9vc3RpZnkuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\nwrjnlpxHkoEs7Ad2ty/tDyNZw+rQFbuS0zPkguBPMKmWjWv0RGVq1cl9Oy66w0Ty\nxG4/xraMpdpYbp8sxUmMG8Sfc0f0rHvwKtoeAka55g4ChAGafBIMM1tS+TP8XXHb\nHCg1xc8Zh6z5ZWTQpwB1Al1V0RzLpKGBnE1RVG67wkO/uepI3HuZ01VDIZYfWlaS\ntMMCykSmQEZEVg3fMssIThOHPcYXKe+tPZKgyZYRc5mdCetwmOVmxzD+goVw+nXO\n1uyVaWiknDiQM4b8jZWs5cQ0Z4rcyLVaWVcsDmkv5wvCg7TeoMbEEKGsO8UPkniM\nBvMuQWQfxYwumQXPOh1QsQIDAQABo4HCMIG/MA8GA1UdEwEB/wQFMAMBAf8wHQYD\nVR0OBBYEFPEnZL2zOZfrThjlU1V46SYS/8xuMIGMBgNVHSMEgYQwgYGAFPEnZL2z\nOZfrThjlU1V46SYS/8xuoV6kXDBaMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0Ex\nETAPBgNVBAoMCFJvb3N0aWZ5MRQwEgYDVQQLDAtFbmdpbmVlcmluZzEVMBMGA1UE\nAwwMcm9vc3RpZnkuY29tgglUEDdq+LM4GTEwDQYJKoZIhvcNAQELBQADggEBAKUh\nbV5gj19/zyWnMIirbuCOkux3sCnYbV3QKdmekxupVcX6rs40Mj5fpaQmx9j68y+n\n9Qe3+6y/vO4YevRhLiPXg0to+RnCBzIdIkA5r+Cde8i78vOUkVyVh0elwMK191r7\nr3loy1zcK3dPTTRUO79Tw/GZwlooqr86NVfeVYo559+FfilMXTCxaxhhpkPZ84oR\n6aZx5s9uL2j9MsGNNpQ30xWKoclkqqQwaXnJwXH1nB/+08SqknrtCw7ma6cbrFfx\na8wTDxikxuA2PgghrQTFxn6KcowJA5O0ot7iyOu9ZhvHZTNOrVIp1qrmlrJd5wFq\nzzJQmpMkzpsOB9dT/LM=\n-----END CERTIFICATE-----\n"

function encrypt(text) {
  let iv = Buffer.from(IV, 'base64')
  let cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
  let authString = 'myauthdata'
  let authData = Buffer.from(authString)
  cipher.setAAD(authData)
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  console.log('encrypted =>', encrypted.toString('base64'))

  return {
    "encryptedString": encrypted.toString('base64'),
    "authTag": cipher.getAuthTag(),
    "authData": authString,
  }
}
