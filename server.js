require('dotenv').config();

const express = require('express')
const db = require('./queries')
var cors = require('cors')
const app = express()
let port = process.env.PORT || 4242
const bodyParser = require('body-parser')

const verifyToken = (req, res, next) => {
  console.log('HEADERS')
  console.log(req.headers)
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else {
    console.log("403")
    res.status(403).send('Forbidden')
  }
}

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// Users
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.put('/update/users/:id', db.updateUser)
app.delete('/delete/users/:id', db.deleteUser)

// JWT
app.post('/api/login', db.login)
app.post('/create/users', db.createUser)

// Services
app.post('/send/mail', require('./mail').sendMail)
app.post('/export/aws', require('./aws').exportAWS)

// Jobs
app.get('/jobs', verifyToken, db.getJobs)
app.get('/waitingJobs/:id', verifyToken, db.getWaitingJobsByUserId)
app.get('/acceptedJobs/:id', verifyToken, db.getAcceptedJobsByUserId)
app.post('/update/job/:id', verifyToken, db.updateJob)
app.post('/create/job', db.createJob)
app.delete('/delete/job/:id', db.deleteJob)
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})