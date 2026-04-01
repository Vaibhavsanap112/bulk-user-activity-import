require("dotenv").config();
require("./src/Config/db");

const app = require("./app");

app.listen(3000, ()=>{
  console.log("server is running on the port 3000");

})