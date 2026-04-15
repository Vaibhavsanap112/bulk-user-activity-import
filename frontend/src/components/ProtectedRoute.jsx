import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}){
  const userId = localStorage.getItem("usreId");

  if(!userId){
    return <Navigate to="/"></Navigate>
  }
  return children
}