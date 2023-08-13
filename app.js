const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const twilio = require("twilio");
const Joi = require("joi"); // Подключаем библиотеку joi

const app = express();
app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:1234",
  "https://golddetailing.com.ua",
];

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

// Определяем схему для валидации данных
const schema = Joi.object({
  name: Joi.string().min(2).required(),
  phone: Joi.string()
    .pattern(/^\+?\d{10,13}$/)
    .required(),
  message: Joi.string().allow("").optional(),
});

app.post("/submit-form", (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const name = req.body.name;
  const phone = req.body.phone;
  const message = req.body.message;

  // Отправка SMS через Twilio
  client.messages
    .create({
      body: ` ${name}, ${phone} - Повідомлення від клієнта: ${message}. `,
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
