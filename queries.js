require('dotenv').config();
const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk');
const fs = require('fs');
const bcrypt = require('bcrypt')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
})

const getUsers = async (request, response) => {
  const getusers = await prisma.users.findMany({
  })
  getusers != null ? response.json(getusers) : response.json({
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
  getuser != null ? response.json(getuser) : response.json({
    text: 'No user found'
  })
}

const login = (request, response) => {
  console.log(process.env)
  const { email, password } = request.body;
  pool.query('SELECT id, password FROM users WHERE email = $1', [email], (error, result) => {
    if (error) {
      console.log('RENTRER ICI')
      console.log(error)
      response.status(400).json({ auth: false, message: "Email or password incorrect" })
    }
    else if (result.rows.length > 0) {
      console.log('RENTRER LA')
      userPassword = result.rows[0].password
      const validPassword = bcrypt.compareSync(password, userPassword);
      if (!validPassword) {
        response.status(400).json({ message: 'Incorect password' })
      }
      else {
        userId = result.rows[0].id
        jwt.sign({ user: userId }, 'secretkey', (err, token) => {
          response.status(200).json({ auth: true, token: token, userId: userId })
        })
      }
    }
    else {
      console.log('NO USER FOUND')
      response.status(404).json({ auth: false, message: "No user found" })
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
  await prisma.users.create({
    data: {
      lastname: lastname,
      firstname: firstname,
      email: email,
      password: hash,
      phone: phone,
    }
  }).then((res) => {
    if (res != null) {
      const userBucket = lastname.toLowerCase() + firstname.toLowerCase()
      AWS.config.update({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        region: "eu-west-3"
      })
      let bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
        .createBucket({ Bucket: userBucket })
        .promise();
      bucketPromise.then(function (data) {
        response.json({
          text: `User added with id : ${res.id}`
        })
        // var objectParams = { Bucket: userBucket, Key: 'default-profile' };
        // var uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
        // uploadPromise.then(
        //   function (data) {
        //     res.json({
        //       text: `Successfully uploaded data to ${bucketName}/${keyName}`
        //     })
        //   });
      }).catch(
        function (err) {
          console.log(err)
          res.json({
            text: 'error'
          })
        });
      // s3.createBucket(params, function (err, data) {
      //   if (err) console.log(err, err.stack);
      //   else {
      //     console.log('Bucket Created Successfully', data.Location);
      //     const fileContent = fs.readFileSync('./assets/default-profile.png');

      //     // Setting up S3 upload parameters
      //     console.log(userBucket)
      //     const params = {
      //       Bucket: userBucket,
      //       Key: 'default-profile.png', // File name you want to save as in S3
      //       Body: fileContent
      //     };

      //     // Uploading files to the bucket
      //     s3.upload(params, function (err, data) {
      //       if (err) {
      //         throw err;
      //       }
      //       console.log(`File uploaded successfully. ${data.Location}`);
      //       response.json({
      //         text: `User added with id : ${res.id}`
      //       })
      //     });
      //   }
      // });
    }
  }).catch((e) => {
    response.json({
      text: `User can't be added`
    })
  })
}

const updateUser = async (request, response) => {
  //console.log(request.params.id);
  const id = parseInt(request.params.id)
  const { firstname, email, lastname, phone } = request.body
  await prisma.users.update({
    where: {
      id: id
    },
    data: {
      lastname: lastname,
      firstname: firstname,
      email: email,
      phone: phone,
    },
  }).then((res) => {
    //console.log(res)
    response.status(200).send(`User modified with ID: ${id}`)
  }).catch((err) => {
    response.status(400).send(`Error occured`)
  })
  // pool.query(
  //   'UPDATE users SET Firstname = $1, Email = $2,Lastname=$3,Phone=$4 WHERE id = $5',
  //   [firstname, email, lastname,phone,id],
  //   (error, results) => {
  //     if (error) {
  //       throw error
  //     }
  //     console.log(`Results: ${results}\n Id: ${id}`);
  //   }
  // )
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

//Invoices

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
  const { NumFacture, Date, Description, IdJob, Tasker, Jobber } = request.body
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


// JOBS

const createJob = async (request, response) => {
  const { Name, Description, Categories, Date, Remuneration, State, Long, Lat, Tasker, Jobber } = request.body
  await prisma.jobs.create({
    data: {
      Name: Name,
      Description: Description,
      Categories: Categories,
      Date: Date,
      Remuneration: Remuneration,
      State: State,
      Long: Long,
      Lat: Lat,
      Tasker: Tasker,
      Jobber: Jobber
    }
  }).then((res) => {
    if (res != null) {
      response.json({
        text: `Job added with id : ${res.id}`
      })
    }
  }).catch((e) => {
    response.json({
      text: `Job can't be added`
    })
  })
}

// From status 'available' to 'waiting' when someone asks for a job
const updateJob = async (request, response) => {
  const jobId = request.params.id;
  const jobberId = request.body.jobber
  jwt.verify(request.token, 'secretkey', async (err, authData) => {
    if (err) {
      response.status(403).send(err)
    }
    else {
      pool.query("UPDATE jobs SET jobber = $1, state = 'waiting' WHERE id = $2", [jobberId, jobId],
        (error, results) => {
          if (error) {
            res.status(403).send(error)
            throw error;
          }
          response.status(200).json(results);
        });
      console.log(request)
    }
  })
}

// From status 'waiting' to 'inprogress' when tasker accepts request
const acceptJobRequest = async (request, response) => {
  const jobId = request.params.id;
  const taskerId = request.body.taskerId
  jwt.verify(request.token, 'secretkey', async (err, authData) => {
    if (err) {
      response.status(403).send(err)
    }
    else {
      pool.query("UPDATE jobs SET state = 'inprogress' WHERE id = $1 AND tasker = $2", [jobId, taskerId],
        (error, results) => {
          if (error) {
            res.status(403).send(error)
            throw error;
          }
          response.status(200).json(results);
        });
      console.log(request)
    }
  })
}

const deleteJob = async (request, response) => {
  const id = parseInt(request.params.id)
  const deletejob = await prisma.jobs.delete({
    where: { id: id },
  }).then((res) => {
    if (res != null) {
      response.json({
        text: `Job deleted with id : ${res.id}`
      })
    }
  }).catch((e) => {
    response.json({
      text: `Job can't be deleted`
    })
  })
}

// Returns jobs to display on the map
const getJobs = (request, response) => {
  jwt.verify(request.token, 'secretkey', async (err, authData) => {
    if (err) {
      response.status(403).send(err)
    }
    else {
      pool.query('SELECT * FROM jobs', (error, results) => {
        if (error) {
          console.log("ERROR GETTING JOBS")
          res.status(403).send(error)
          throw error;
        }
        response.status(200).json(results.rows);
      });
    }
  })
}

// Returns jobs that the user asked to do
const getWaitingJobsByUserId = async (request, response) => {
  jwt.verify(request.token, 'secretkey', async (err, authData) => {
    if (err) {
      response.status(403).send(err)
    }
    else {
      const jobberId = request.params.id;
      pool.query("SELECT id FROM jobs WHERE jobber = $1 AND state = 'waiting'", [jobberId],
        (error, results) => {
          if (error) {
            res.status(403).send(error)
            throw error;
          }
          response.status(200).json(results.rows);
        }
      );
    }
  })
}

// Returns jobs created by user (tasker)
const getJobsByUserId = async (request, response) => {
  jwt.verify(request.token, 'secretkey', async (err, authData) => {
    if (err) {
      response.status(403).send(err)
    }
    else {
      const taskerId = request.params.id;
      pool.query("SELECT * FROM jobs WHERE tasker = $1", [taskerId],
        (error, results) => {
          if (error) {
            res.status(403).send(error)
            throw error;
          }
          response.status(200).json(results.rows);
        }
      );
    }
  })
}

// Returns jobs made by the user that have been accepted by someone else
const getAcceptedJobsByUserId = async (request, response) => {
  jwt.verify(request.token, 'secretkey', async (err, authData) => {
    if (err) {
      response.status(403).send(err)
    }
    else {
      const taskerId = request.params.id;
      pool.query("SELECT id FROM jobs WHERE tasker = $1 AND state = 'waiting'", [taskerId],
        (error, results) => {
          if (error) {
            res.status(403).send(error)
            throw error;
          }
          response.status(200).json(results.rows);
        }
      );
    }
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
  acceptJobRequest,
  deleteJob,
  getWaitingJobsByUserId,
  getAcceptedJobsByUserId,
  getJobsByUserId,
  getJobs,
  getInvoices,
  getInvoiceById,
  createInvoice
}

