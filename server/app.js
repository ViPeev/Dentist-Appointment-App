const config = require("./config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { authentication } = require("./middleware/auth");
const trimBody = require("./middleware/trimBody");

const app = express();
const PORT = config.PORT || 5000;

const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(authentication());
app.use(trimBody());

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT};`);
});
