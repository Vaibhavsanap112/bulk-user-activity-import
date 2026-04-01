const express = require("express");
const authRoutes = require("./src/Routes/authRoutes");

const app  = express();

app.use(express.json());
const cors = require("cors");

app.use(cors());

app.get("/", function(req,res){
  res.send("APi is running");
})
app.use("/api/auth",authRoutes);


module.exports=app;
