const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: "xpgushjfjwzypv",
  host: "ec2-79-125-30-28.eu-west-1.compute.amazonaws.com",
  database: "d9q6od77chsgde",
  password: "339d673052bc436fe62a3d2f301a66c66a7971a31b0d37967a886aef3c8d70b4",
  port: "5432",
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
         getuser!=null ? response.json(getuser) : response.json({
         text: 'No user found'
       })
}
const login = (request, response) => {
  const { username, password } = request.body
  if(username== null || password== null){
    response.json({
      text: 'Verify username and password'
    })
  }
  // const validPassword = await bcrypt.compare(body.password, user.password);
  pool.query('SELECT * FROM users WHERE email = $1', [username], (error, results) => {
    if (error) {
      throw error
    }
    if(results.rows.length>0){
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
  }else{
    response.status(400).json({text: 'No user found'})
  }

  })
}
const createUser = async (request, response) => {
  const { lastname, firstname, email, password, phone } = request.body
  let hash = bcrypt.hashSync(password, 10, (err, hash) => {
    if (err) {
      response.status(400).send(`Can't hash password, retry`)
    }
  });
  const insertuser = await prisma.users.create({
    data: {
      lastname:lastname,
      firstname:firstname,
      email:email,
      password:hash,
      phone:phone,
    }
  }).then((res)=>{
    if(res!=null){
      response.json({
        text:`User added with id : ${res.id}`
      })
    }
  }).catch((e)=>{
    response.json({
      text:`User can't be added`
    })
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
const createJob = async(request, response) => {
  const { Name,Description,Categories,Date,Remuneration,State,Long,Lat,Tasker,Jobber } = request.body
    const insertjob = await prisma.jobs.create({
      data: {
        Name:Name,
        Description:Description,
        Categories:Categories,
        Date:Date,
        Remuneration:Remuneration,
        State:State,
        Long:Long,
        Lat:Lat,
        Tasker:Tasker,
        Jobber:Jobber
      }
    }).then((res)=>{
      if(res!=null){
        response.json({
          text:`Job added with id : ${res.id}`
        })
      }
    }).catch((e)=>{
      response.json({
        text:`Job can't be added`
      })
    })
  }
  const updateJob = async (request, response) => {
    const id = parseInt(request.params.id)
    const { Name,Description,Categories,Date,Remuneration,State,Long,Lat,Tasker,Jobber } = request.body
    
    const updatejob = await prisma.jobs.update({
      where: { id:id },
      data: {
        Name:Name != null ? Name : undefined,
        Description:Description != null ? Description : undefined,
        Categories:Categories != null ? Categories : undefined,
        Date:Date != null ? Date : undefined,
        Remuneration:Remuneration != null ? Remuneration : undefined,
        State:State != null ? Name : undefined,
        Long:Long != null ? Long : undefined,
        Lat:Lat != null ? Lat : undefined,
        Tasker:Tasker != null ? Tasker : undefined,
        Jobber:Jobber != null ? Jobber : undefined,
      },
    }).then((res)=>{
      console.log(res)
      if(res!=null){
        response.json({
          text:`Job updated with id : ${res.id}`
        })
      }
    }).catch((e)=>{
      console.log(e)
      response.json({
        text:`Job can't be updated`
      })
    })
    }
    const deleteJob = async (request, response) => {
      const id = parseInt(request.params.id)
      const deletejob = await prisma.jobs.delete({
        where: { id:id },
      }).then((res)=>{
        if(res!=null){
          response.json({
            text:`Job deleted with id : ${res.id}`
          })
        }
      }).catch((e)=>{
        response.json({
          text:`Job can't be deleted`
        })
      })
      }
      const getJob = async (request, response) => {
        const id = parseInt(request.params.id)
        const getjob = await prisma.jobs.findUnique({
                where: {
                  id: id,
                 }
               })
               getjob!=null ? response.json(getjob) : response.json({
               text: 'No user found'
             })
      }

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  createJob,
  updateJob,
  deleteJob,
  getJob
}