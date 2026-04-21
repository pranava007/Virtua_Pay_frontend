import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-yellow-500">
          VirtuaPay
        </h1>

        <nav className="flex gap-4">
          <Link to="/" className="hover:text-yellow-500">Home</Link>
          <Link to="/login" className="hover:text-yellow-500">Login</Link>
          <Link to="/register" className="hover:text-yellow-500">Register</Link>
        </nav>

      </div>
    </header>
  );
};

export default Header;