import React from 'react'
import { Children } from 'react';
import { useState } from 'react'

export default function Upload(){
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async ()=>{
    if(!file){
      alert("Select a file first");
      return;
    }
    const text = await file.text();
    const jsonData = JSON.parse(text);

    const startRes = await fetch("http://localhost:3000/api/import/start",{
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({totalRecords:jsonData.length}),
    })

    const startData = await startRes.json();
    const importId = startData.importId;
    localStorage.setItem("importId", importId);

    setStatus("Imortstarted...")


    const chunkSize= 500;
    let processed =0;

    for(let i=0;i<jsonData.length; i+=chunkSize){
      const chunk  = jsonData.slice(i, i+chunkSize);

      await fetch("http://localhost:3000/api/activity/bulk",{
        method:"POST",
        headers:{
          "Content-type":"application/json",

        },
        body:JSON.stringify({
          importId,
          data:chunk,
        })
      })
      processed+=chunk.length;


      const percent = Math.floor((processed/jsonData.length)*100);

      setProgress(percent);
      setStatus(`Processed ${processed}/${jsonData.length}`);
    }

    setStatus("Upload Complete")

  }


  return(

    <div style={{padding:"20px"}}>

      <h2>Upload JSON File</h2>


      <input type="file" accept='.json' onChange={(e)=>setFile(e.target.files[0])} />


      <br />

      <button onClick={handleUpload}>Upload</button>

      <p>{status}</p>


      <div style={{width:"300px", border:"1px solid black"}}>

        <div style={{
          width:`${progress}%`,
          height:"20px",
          background:"green",
        }}></div>
      </div>

      <p>{progress}</p>
    </div>
  )
}
