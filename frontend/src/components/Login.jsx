import React, { useState } from 'react';
import { loginUser } from '../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { updateLoginStatus } from '../store/userActions';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser(formData);

      if (res.data.success) {
        dispatch(updateLoginStatus({isLoggedIn: true, user: res.data.data.user.username}));
        setSuccess(res.data.message || 'Login successful!');
        setError('');
        localStorage.setItem("accessToken",res.data.data.accessToken);
        localStorage.setItem("refreshToken",res.data.data.refreshToken);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      console.log(err);
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="rounded-lg p-5 w-full max-w-md transform transition-all duration-300 hover:scale-105 h-auto mb-24 mt-5 shadow-lg shadow-white">
        <h2 className="text-3xl font-bold text-center text-gray-50 mb-4">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Please sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="text-white w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="text-white w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-transparent"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p> || success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center flex flex-col justify-center items-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to='/signup' className="text-blue-500 font-semibold cursor-pointer hover:underline">
              Sign up
            </Link>
          </p>
          {loading && <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>}
        </div>
      </div>
    </div>

  );
};

export default Login;
