require('dotenv').config();
const mailjet = require('node-mailjet')
  .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET_KEY)

exports.sendMail = async (req, res, email = null) => {
  console.log(req.body)
  email == null ? req.body.email : email
  if (email != null) {
    const request =
      mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
          "Messages": [
            {
              "From": {
                "Email": "aminebaha.git@gmail.com",
                "Name": "aze"
              },
              "To": [
                {
                  "Email": email,
                  "Name": "aze"
                }
              ],
              "Subject": "Bienvenue chez FastJobs",
              "TextPart": "FastJobs - Mail de bienvenue",
              "HTMLPart": "<h3> Touver des Jobs ! </h3>",
              "CustomID": "FastJobs_mail" + Date.now()
            }
          ]
        })
    request
      .then((result) => {
        res.status(200).send("user created")
      })
      .catch((err) => {
        res.status(503).send("Mail error")
      })
  } else {
    res.send("Incorect mail")
  }
}