
const AWS = require('aws-sdk');
const uuid = require('uuid');
const dotenv = require('dotenv');
dotenv.config()
exports.exportAWS = (req, res) => {
  let { file } = req.body

  AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: "eu-west-3"
  })

  var bucketName = 'fastjobsbucket-test' + uuid.v4();

  var keyName = 'mail.js';


  var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).createBucket({ Bucket: bucketName }).promise();
  bucketPromise.then(
    function (data) {
      var objectParams = { Bucket: bucketName, Key: keyName };
      var uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
      uploadPromise.then(
        function (data) {
          res.json({
            text: `Successfully uploaded data to ${bucketName}/${keyName}`
          })
        });
    }).catch(
      function (err) {
        res.json({
          text: 'error'
        })
      });
}