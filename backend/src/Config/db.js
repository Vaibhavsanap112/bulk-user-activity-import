const mysql = require("mysql2");
const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'bulk_import_db'
});

connection.connect((err)=>{
  if(err){
    console.log("Db connection failed");
  }
  else{
    console.log("Mysql Connected");
  }
})

module.exports = connection;