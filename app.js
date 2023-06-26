const express = require("express");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

app.use(cors());

app.use("/api/contacts", contactsRouter);

app.listen(3000);
