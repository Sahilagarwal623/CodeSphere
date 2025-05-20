import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', fullname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await registerUser(formData); // Send registration request to backend      
      if (response.success) {
        setError('');
        setSuccess(response.message);
        setTimeout(() => {
          navigate('/login') // Redirect to login page after successful registration
        }, 2000);
      }
      setTimeout(() => {
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed!');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen bg-gray-900 flex-col">
      <div className="bg-gray-900 p-8 mt-9 mb-16 w-full max-w-md rounded-lg transform transition-all duration-300 hover:scale-105 shadow-lg shadow-white">
        <h2 className="text-3xl font-bold text-center text-gray-50 mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="fullname"
            className="text-white bg-transparent w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="text-white bg-transparent w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="text-white bg-transparent w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="text-white bg-transparent w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p> || success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <div className="flex justify-center mt-4 flex-col items-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-700 font-semibold underline">
              Login
            </Link>
          </p>
          {loading && <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>}
        </div>
      </div>
    </div>

  );
};

export default Registration;
