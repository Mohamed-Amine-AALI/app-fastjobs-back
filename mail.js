require('dotenv').config();
const mailjet = require('node-mailjet')
  .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET_KEY)
exports.sendMail = (req, res) => {
  let { email } = req.body
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
        res.send("Mail sended")
      })
      .catch((err) => {
        res.send("Mail error")
      })
  } else {
    res.send("Incorect mail")
  }
}