const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
  
      response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    console.log(id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)

    })
}
const login = (request, response) => {
  const { username,password} = request.body

 // const validPassword = await bcrypt.compare(body.password, user.password);

  pool.query('SELECT * FROM users WHERE email = $1', [username], (error, results) => {
    if (error) {
      throw error
    }
    bcrypt.compareSync(password, results.rows[0].password);
   const validPassword = bcrypt.compareSync(password, results.rows[0].password);
   if(!validPassword){
    response.status(400).json({text: 'Incorect password'})
    
   }else{
    let token = jwt.sign({user:results.rows[0].id },'key')
    jwt.verify(token,'key',function(err,data){
      if(err) {
        throw err
      }else{
        response.status(200).json(results.rows.concat({'token': token}))
      }
    })
   }

  
  })
}
const createUser = (request, response) => {
    const { lastname,firstname,email,password,phone,adress } = request.body
    //console.log(request.body);
   let hash = bcrypt.hashSync(password, 10,(err, hash)=>{
     if(err){
      response.status(400).send(`Can't hash password, retry`)
    }
    });
    
    pool.query('INSERT INTO users (lastname,firstname,email,password,phone,adress) VALUES ($1, $2, $3, $4, $5, $6)', [lastname,firstname, email,hash,phone,adress], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { firstname, email } = request.body
  
    pool.query(
      'UPDATE users SET Firstname = $1, Email = $2 WHERE id = $3',
      [firstname, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
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

const createInvoice = (request, response) => {
  console.log(request.body);
  response.json('toto')
  // const { NumFacture,Date,Description,IdJob,Tasker,Jobber } = request.body
  // pool.query('INSERT INTO invoices (NumFacture,Date,Description,IdJob,Tasker,Jobber) VALUES ($1, $2, $3, $4, $5, $6)', [NumFacture,Date,Description,IdJob,Tasker,Jobber], (error, results) => {
  //   if (error) {
  //     throw error
  //   }
  //   response.status(201).send(`User added with ID: ${results.insertId}`)
  // })
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
  