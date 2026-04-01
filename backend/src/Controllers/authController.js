const express = require("express");
const router = express.Router();

const db = require("../Config/db");
const bcrypt = require("bcrypt");

exports.test = (req,res)=>{
  res.send("Test route is running");
}

exports.signup = async(req,res)=>{
  try{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({message:"All fields are required"});
    }

    const checkQuery = "select * from users where email=?";
    db.query(checkQuery,[email],async(err,result)=>{
      if(err) return res.status(500).json({message:"DB error"});

      if(result.length>0){
      return res.status(400).json({message:"User alredy exists"});
    }
    })
    

    const hasedPassword  = await bcrypt.hash(password,10);

    const insertQuery = "insert into users(name,email, password) values (?,?,?)";
    db.query(insertQuery,[name,email,hasedPassword], (err, result)=>{
      if(err) return res.status(500).json({message:"insert Failed"})

      res.json({message:"User Registerd successfully"});
    })
  }catch(error){
    res.status(500).json({message:"server error"})
  }
  
}
exports.login = (req,res)=>{
  const {email, password}= req.body;

  if(!email || !password){
    return res.status(400).json({message:"Email and password required"});


  }
  const query = "select * from users where email=?";

  db.query(query,[email], async(err, result)=>{
    if(err) return res.status(500).json({message:"DB error"});

    if(result.length==0){
      return res.status(400).json({message:"User not found"});
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({message:"Invalid Password"});
    }

    res.json({message:"Login Successful"});

    })
}