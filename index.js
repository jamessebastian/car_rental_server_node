const express = require("express");
const dotenv = require("dotenv").config();
const UserRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/authRoute");
const inquiryRouter = require("./Routes/InquiryRoutes");
const passwordResetRoutes = require("./Routes/passwordResetRoute");
const carRoute = require("./Routes/carRoutesDB");
const faqRoute = require("./Routes/faqRoutes");
const aboutRoute = require("./Routes/aboutusRoute");
const feedbackRoute = require("./Routes/feedbackRoutes");
const Aboutus = require("./models/Aboutus");
const bookingRoute = require("./Routes/bookings");
const connectDB = require("./config/connectDb");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require('path');

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));
//file upload
app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  app.use(express.static('public'));
  const file = req.files.myFile;

  const extension = path.extname(file.name);
  const allowedext = ['.png', '.jpg'];

  if (!allowedext.includes(extension)) {
    return res.status(400).send('Invalid file type.');
  }
  const path2 = 'public/uploads/' + file.name;

  file.mv(path2, function (err) {
    if (err) return res.status(500).send(err);

    res.send('File uploaded!');
  });

});

//connectdb
connectDB();
app.use(express.json());
app.use("/api/cars", carRoute);
app.use("/api/feedbacks", feedbackRoute);
app.use("/all/api/feedbacks", feedbackRoute);
app.use("/api/user", UserRoute);
app.use("/api/auth", authRoute);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/faq", faqRoute);
app.use("/api/aboutus", aboutRoute);
app.use("/api/bookings", bookingRoute);


const PORT = process.env.PORT | 5000;
app.listen(PORT, () => {
  console.log("server started at: ", PORT);
});

