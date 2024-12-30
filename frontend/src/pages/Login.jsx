import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import { login } from '../service/apiServices';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            try {
                const response = await login(formData);
                if (response.success) {
                    localStorage.setItem("lottery:user", JSON.stringify(response.user));
                    localStorage.setItem("lottery:token", response.token);
                    toast.success('Login Success');
                    if (response.user.role === 'admin') {
                        navigate('/dashboard-home');
                    }
                    else {
                        navigate('/');
                    }
                }
                else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.log('error in login:', error);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Welcome Back</h1>
                <p className="text-center text-gray-600 dark:text-gray-400 ">Login to continue</p>
                <form className="flex flex-col gap-5 px-3" onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-white/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type={'password'}
                            id="password"
                            placeholder="Enter your password"
                            className="relative w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-white/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 pr-12"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-3 mb-5 py-3 bg-black hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
