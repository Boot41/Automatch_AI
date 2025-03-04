import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Chatbot from "./Pages/Chatbot";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Profile from "./Components/Profile";
import { useAuth } from "./store/auth";

const App = () => {
  // Protected Route Component
  const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { isTokenAvailable, token } = useAuth();
    return isTokenAvailable ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/signin" />
    );
  };

  const { isTokenAvailable } = useAuth();

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* authentication routes defined  */}

          <Route
            path="/signup"
            element={isTokenAvailable ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/signin"
            element={isTokenAvailable ? <Navigate to="/" /> : <SignIn />}
          />
          <Route
          path="/profile"
          element={<ProtectedRoute element={Profile} />}
        />  

        </Routes>
      </Router>
    </>
  );
};

export default App;
