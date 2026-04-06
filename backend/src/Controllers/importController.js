const db = require("../Config/db");

exports.startImport = (req,res)=>{

  const {totalRecords} = req.body;


  if(!totalRecords){
    return res.status(400).json({message:"Total records required"});
  }

  const query = `insert into import_logs(total_records,status) values(?,'processing');`

  db.query(query,[totalRecords],(err,result)=>{
    if(err){
      console.log(err);
      return res.status(500).json({message:"DB error"});
    }

    res.json({
      message:"Import started",
      importId:result.insertId
    })
  })
}


exports.getStatus = (req, res) => {
  const importId = req.params.id;

  const query = "SELECT * FROM import_logs WHERE id = ?";

  db.query(query, [importId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Import not found" });
    }

    res.json(result[0]);
  });
};