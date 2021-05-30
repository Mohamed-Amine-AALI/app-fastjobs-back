require('dotenv').config();

const express = require('express')
const db = require('./queries')
var cors = require('cors')
const app = express()
let port=process.env.PORT || 4242
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})
//users
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/create/users', db.createUser)
app.put('/update/users/:id', db.updateUser)
app.delete('/delete/users/:id', db.deleteUser)
//jwt
app.post('/api/login',db.login)
//services
app.post('/send/mail',require('./mail').sendMail)
app.post('/export/aws',require('./aws').exportAWS)
//jobs
app.get('/jobs',db.getJobs)
app.post('/job/:id',db.getJob)
app.post('/create/job',db.createJob)
app.put('/update/job/:id', db.updateJob)
app.delete('/delete/job/:id', db.deleteJob)
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})