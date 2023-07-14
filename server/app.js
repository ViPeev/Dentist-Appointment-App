const config = require("./config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = config.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json({ extended: true }));

app.listen(PORT, () => {
    console.log(`App started on port ${PORT};`);
});