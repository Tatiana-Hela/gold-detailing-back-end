const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use(cors());

const { PORT, SMSClubToken } = process.env;
const SMSClubApiUrl = "https://im.smsclub.mobi";

const yourNumber = ["+380683835128"]; //, "+380631183012"

app.post("/submit-form", async (req, res) => {
  const { message } = req.body;

  console.log("Request data:", req.body);
  // Отправка SMS через API SMSClub
  try {
    const response = await axios.post(
      `${SMSClubApiUrl}/sms/send`,
      {
        src_addr: "Shop Zakaz",
        phone: yourNumber, // Ваш номер
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${SMSClubToken}`,
        },
      }
    );
    console.log("SMS response:", response.data);

    if (response.data && response.data.success_request) {
      res.status(200).json({ message: "Заявка успішно відправлена" }); // Відправляємо статус 200 OK
    } else {
      console.log("SMSClub API Error:", response.data);
      res.status(500).json({ error: "Помилка при відправці SMS" }); // Якщо помилка в SMSClub API
    }
  } catch (error) {
    console.error("Error:", error);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    res.status(500).json({ error: "Помилка при відправці SMS" }); // Якщо інша помилка
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
