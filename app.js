const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const twilio = require("twilio");

const app = express();
app.use(bodyParser.json());

const allowedOrigins = ["http://localhost:1234", "http://golddetailing.com.ua"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const { PORT, AUTH_TOKEN, ACCOUNT_SID } = process.env;

const accountSid = ACCOUNT_SID;
const authToken = AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.post("/submit-form", (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const message = req.body.message;

  // Валидация данных (по желанию)
  // ...

  // Отправка SMS через Twilio
  client.messages
    .create({
      body: `Заявка от ${name}. Номер телефона: ${phone}. Сообщение: ${message}`,
      to: "+380683835128", // Замените на номер получателя
      from: "+12058946890", // Замените на ваш Twilio номер
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.error(error));

  res.status(200).json({ message: "Заявка успешно отправлена" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
