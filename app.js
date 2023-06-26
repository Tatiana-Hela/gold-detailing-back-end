const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Разрешить все запросы с любого источника
app.use(cors());

// Параметры для Ringostat API
const ringostatAPIKey = "YcQQFGXvVVzbUku49z0LsAR6L59r4TOK";
const ringostatEndpoint = "https://api.ringostat.net/a/v2";

app.post("/call-order", (req, res) => {
  const { name, phoneNumber } = req.body;

  // Создание звонка в Ringostat API
  axios({
    method: "post",
    url: `${ringostatEndpoint}/calltracking/callback`,
    headers: {
      "Content-Type": "application/json",
      "auth-key": ringostatAPIKey,
    },
    data: {
      name: name,
      phone: phoneNumber,
    },
  })
    .then((ringostatResponse) => {
      console.log("Звонок успешно создан:", ringostatResponse.data);
      res.status(200).json({
        message: "Ваша заявка на заказ звонка была успешно принята.",
      });
    })
    .catch((error) => {
      console.error("Ошибка при создании звонка:", error);
      res.status(500).json({
        error:
          "Возникла ошибка при создании звонка. Пожалуйста, попробуйте еще раз.",
      });
    });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
