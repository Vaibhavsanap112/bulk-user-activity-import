const express = require("express");
const authRoutes = require("./src/Routes/authRoutes");
const importRoutes = require("./src/Routes/importRoutes")
const activityRoutes = require("./src/Routes/activityRoutes")

const app  = express();

app.use(express.json());
const cors = require("cors");

app.use(cors());

app.get("/", function(req,res){
  res.send("APi is running");
})
app.use("/api/auth",authRoutes);
app.use("/api/import", importRoutes);
app.use("/api/activity", activityRoutes);

app.use("/api/import", importRoutes);


module.exports=app;
