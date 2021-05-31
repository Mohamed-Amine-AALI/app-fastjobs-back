require('dotenv').config();

const express = require('express')
const db = require('./queries')
var cors = require('cors')
var bodyParser = require('body-parser')
const app = express()
let port=process.env.PORT || 4242

app.use(bodyParser.json())

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/create/users', db.createUser)
app.post('/api/login',db.login)
app.put('/users/:id',db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.post('/send/mail',require('./mail').sendMail)
app.post('/export/aws',require('./aws').exportAWS)
app.get('/invoices', db.getInvoices)
app.get('/invoices/:id', db.getInvoiceById)
app.post('/create/invoices', db.createInvoice)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})