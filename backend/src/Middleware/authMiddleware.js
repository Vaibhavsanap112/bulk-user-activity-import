module.exports =(req , res)=>{
  const userId = req.headers["userid"];


  if(!userId){
    return res.status(401).json({
      message:"Unauthorized: No userId",
    })
  }

  req.userId = Number(userId);
next();
}

