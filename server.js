const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// create express app
const app = express()

// logging
app.use(morgan("dev"))

let corsOptions = {
  origin: 'http://localhoast:8081',
}

// use cors
app.use(cors(corsOptions))

// parse requests content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse requests of content-type: application/json
app.use(express.json())

const db = require('./app/models')
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.')
})

// routes
require('./app/routes/tutorial.routes')(app)

// initial route
app.get('/', (req, res) => {
  res.send('welcome to the princeB MySQL & Sequelize app')
})

// set port
const PORT = process.env.PORT || 8080

// listen for requests
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})