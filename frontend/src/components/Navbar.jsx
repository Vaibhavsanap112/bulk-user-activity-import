import { Link } from "react-router-dom";


export default function Navbar(){
  return(


    <div style={{marginBottom:"20px"}}>


     <Link to="/upload">Upload</Link>  | {" "}
      <Link to="/errors">Errors</Link>
    </div>
  )
}