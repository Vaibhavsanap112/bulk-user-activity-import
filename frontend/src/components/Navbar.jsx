import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

 
  if (location.pathname === "/" || location.pathname === "/signup") {
    return null;
  }

  const linkClass = (path) =>
    `px-4 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-14">

          
          <h1 className="text-white text-lg font-semibold tracking-wide">
            Bulk Upload
          </h1>

          
          <div className="flex space-x-3">
            <Link to="/upload" className={linkClass("/upload")}>
              Upload
            </Link>

            <Link to="/errors" className={linkClass("/errors")}>
              Errors
            </Link>

            <Link to="/records" className={linkClass("/records")}>
              Records
            </Link>
          </div>

         
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}