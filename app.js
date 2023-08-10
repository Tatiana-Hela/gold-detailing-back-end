const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const twilio = require("twilio");

const port = 3000;
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

const accountSid = "AC53fcb5cf064255c2f9802bb3e059b2b9";
const authToken = "3344227fbe0c3a13f7ec64cff43d63bf";
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

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
