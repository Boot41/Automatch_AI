import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";

const ProfileDropdown = () => {
  const { user, logOutUser } = useAuth();

  return (
    <div className="relative group">
      <img
        src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg" // Your static profile image path
        alt="User Profile"
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-400 object-cover"
      />
      <div className="absolute right-0 w-48 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <Link
          to="/profile"
          className="block px-4 py-2 hover:bg-indigo-600"
        >
          {user.name}
        </Link>
        <button
          onClick={logOutUser}
          className="block w-full text-left px-4 py-2 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
