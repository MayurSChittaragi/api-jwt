const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Import Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

dotenv.config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
	console.log("Connected to DB");
});

//Middleware
app.use(express.json());
//this does the job of body parser...

//Route Middlewares
app.use("/api/user", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
