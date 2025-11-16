import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { authClearError, forgotPassword } from '../../actions/userAction';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('');
  const {loading,error,user,message} = useSelector(state=>state.authState)

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email',email);
    dispatch(forgotPassword(formData))
  };

  useEffect(()=>{
    if(message){
      toast(message,{
        position:'top-right'
      })
      setEmail('')
      return
    }

    if (error) {
      toast.error(error, {
        position: "top-right",
        onOpen:()=>{dispatch(authClearError)}
      });
      return
    }

  },[message,dispatch,error])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Enter your registered email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email_field"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email_field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="forgot_password_button"
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition font-semibold"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
