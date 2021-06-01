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

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// Users
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.put('/update/users/:id', verifyToken, db.updateUser)
app.delete('/delete/users/:id', db.deleteUser)

// JWT
app.post('/api/login', db.login)
app.post('/create/users', db.createUser)


//Invoices
app.get('/invoices', db.getInvoices)
app.get('/invoices/:id', db.getInvoiceById)
app.post('/create/invoices', db.createInvoice)


// Services
app.post('/send/mail', require('./mail').sendMail)

// Jobs
app.get('/jobs', verifyToken, db.getJobs)
app.get('/jobs/:id', verifyToken, db.getJobsByUserId)
app.get('/waitingJobs/:id', verifyToken, db.getWaitingJobsByUserId)
app.get('/acceptedJobs/:id', verifyToken, db.getAcceptedJobsByUserId)
app.post('/update/job/:id', verifyToken, db.updateJob)
app.post('/update/acceptJobRequest/:id', verifyToken, db.acceptJobRequest)
app.post('/create/job', db.createJob)
app.delete('/delete/job/:id', db.deleteJob)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})