import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Check if token exists
    const isTokenAvailable = !!token;

    // Store token in local storage
    const storingTokenInLS = (serverToken) => {
        setToken(serverToken);
        localStorage.setItem("token", serverToken);
        return Promise.resolve();
    };

    // Logout user
    const logOutUser = () => {
        setToken("");
        localStorage.removeItem("token");
    };

    // Axios instance with auth headers
    const axiosInstance = axios.create({
        baseURL: "http://localhost:3000/api/v1/",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Get user info
    const userAuthentication = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get("auth/me");
            setUser(response.data.user);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            userAuthentication();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ isTokenAvailable, storingTokenInLS, logOutUser, user, userAuthentication , token, axiosInstance}}>
            {children}
        </AuthContext.Provider>
    );
};

// Consumer
export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};