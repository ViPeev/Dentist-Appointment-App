const config = require("./config");
const express = require("express");
const cors = require("cors");
const { authentication } = require("./middleware/auth");
const trimBody = require("./middleware/trimBody");

const app = express();
const PORT = config.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const dentistRoutes = require("./routes/dentistRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const blacklistRoutes = require("./routes/blacklistRoutes");
const eventRoutes = require("./routes/eventRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

//middleware
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(authentication());
app.use(trimBody());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/admins", adminRoutes);
app.use("/api/v1/dentists", dentistRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/medical-records", medicalRoutes);
app.use("/api/v1/ratings", ratingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/blacklist", blacklistRoutes);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT};`);
});
