// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const newCanvas = require('./imageHelper.js')

const app = express();
const router = express.Router();

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// use router
app.use('/api/', router)

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: 'not found' })
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})


// new image
router.post('/new', (req, res, next) => {
  const { imageWidth, imageHeight, canWidth, numberOfCans, borderWidth } = req.body
  if (!canWidth && !numberOfCans || canWidth && numberOfCans) res.send('Please fill out either "Can Width" or "Number of Cans"')
  else {
    const measurements = {
      imageWidth: parseInt(imageWidth),
      imageHeight: parseInt(imageHeight),
      canWidth: parseInt(canWidth),
      numberOfCans: parseInt(numberOfCans),
      borderWidth: parseInt(borderWidth),
    }
    newCanvas(measurements, res)
  }
})




// listen for requests :)
const listener = app.listen(process.env.PORT || '8000', function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
