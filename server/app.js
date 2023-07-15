const config = require("./config");
const express = require("express");
const cors = require("cors");
const { authentication } = require("./middleware/auth");
const trimBody = require("./middleware/trimBody");

const app = express();
const PORT = config.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");

app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(authentication());
app.use(trimBody());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountRoutes);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT};`);
});
