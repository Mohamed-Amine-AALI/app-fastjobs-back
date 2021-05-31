const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.PRISMA_USER,
  host: process.env.PRISMA_HOST,
  database: process.env.PROCESS_DB,
  password: process.env.PRISMA_PASS,
  port: process.env.PRISMA_PORT,
  ssl: { rejectUnauthorized: false }
})

const getUsers = async (request, response) => {
    const getusers = await prisma.users.findMany({
      })
      getusers!=null ? response.json(getusers) : response.json({
        text: 'No user found'
       })
   }

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id)
  const getuser = await prisma.users.findUnique({
          where: {
            id: id,
           }
         })
       getUser!=null ? response.json(getUser) : response.json({
         text: 'No user found'
       })
}
const login = (request, response) => {
  const { username, password } = request.body

  // const validPassword = await bcrypt.compare(body.password, user.password);

  pool.query('SELECT * FROM users WHERE email = $1', [username], (error, results) => {
    if (error) {
      throw error
    }
    bcrypt.compareSync(password, results.rows[0].password);
    const validPassword = bcrypt.compareSync(password, results.rows[0].password);
    if (!validPassword) {
      response.status(400).json({ text: 'Incorect password' })

    } else {
      let token = jwt.sign({ user: results.rows[0].id }, 'key')
      jwt.verify(token, 'key', function (err, data) {
        if (err) {
          throw err
        } else {
          response.status(200).json(results.rows.concat({ 'token': token }))
        }
      })
    }
  })
}
const createUser = (request, response) => {
  //console.log(request.body);
  const { lastname, firstname, email, password, phone, adress } = request.body
  let hash = bcrypt.hashSync(password, 10, (err, hash) => {
    if (err) {
      response.status(400).send(`Can't hash password, retry`)
    }
  });

  pool.query('INSERT INTO users (lastname,firstname,email,password,phone,adress) VALUES ($1, $2, $3, $4, $5, $6)',
    [lastname, firstname, email, hash, phone, adress],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ${firstname} ${lastname}`)
    }
  )
}

const updateUser = async (request, response) => {
  //console.log(request.body);
  const id = parseInt(request.params.id)
  const { firstname, email } = request.body
  const updateUser = await prisma.users.update({
    where: { id: Number(id) },
    data: {
      firstname : firstname,
      email : email },
  })
  response.status(200).send(`User modified with ID: ${updateUser.id}`)
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const getInvoices = (request, response) => {
  pool.query('SELECT * FROM invoices ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }

    response.status(200).json(results.rows)
  })
}

const getInvoiceById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM invoices WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)

  })
}

const createInvoice = async (request, response) => {
  //console.log(request.body);
  const {NumFacture,Date,Description,IdJob,Tasker,Jobber} = request.body
  const createInvoice = await prisma.invoices.create({
    data: {
      NumFacture,
      Date,
      Description,
      IdJob,
      Tasker,
      Jobber
    },
  })
  response.status(201).send(`Invoice added with ID: ${createInvoice.id}`)
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    getInvoices,
    getInvoiceById,
    createInvoice
  }
  
