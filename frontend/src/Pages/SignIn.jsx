import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import api from '../config/api';
import Navbar from '../Components/Navbar';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Sign in the user
      const response = await api.post('/auth/signin', { email, password });
      const token = response.data.token;
      
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      try {
        await api.post('/api/v1/ai/start');
      } catch (chatErr) {
        console.error('Error starting chat session:', chatErr);
      }
      
      navigate('/chatbot');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center">
        <div className="max-w-lg w-full mx-auto px-6 py-10"> {/* Increased max-width */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">Welcome back</h1> {/* Bigger font */}
            <p className="text-lg text-gray-400">Sign in to your account to continue</p> {/* Increased text size */}
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8"> {/* Bigger card */}
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 px-5 py-4 rounded-lg mb-6 text-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="email" className="text-lg font-medium text-gray-300 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-6 w-6 text-gray-400" /> {/* Bigger icon */}
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-gray-700 text-gray-200 border border-gray-600 block w-full pl-12 pr-4 py-3 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="text-lg font-medium text-gray-300 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-700 text-gray-200 border border-gray-600 block w-full pl-12 pr-12 py-3 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 text-lg rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-6 w-6" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-lg text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
