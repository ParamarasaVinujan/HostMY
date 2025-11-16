import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { authClearError, resetPassword } from '../../actions/userAction';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {token} = useParams()
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {isAuthenticated,error} = useSelector(state=>state.authState)

  const handleSubmit = (e) => {
    e.preventDefault();
     const formData = new FormData();
      formData.append('password',password);
      formData.append('confirmPassword',confirmPassword);
      dispatch(resetPassword(formData,token))
  };

  useEffect(()=>{
    if(isAuthenticated){
      toast('Password reset successfully',{
        position:'top-right'
      })
      navigate('/')
      return
    }

    if (error) {
      toast.error(error, {
        position: "top-right",
        onOpen:()=>{dispatch(authClearError)}
      });
      return
    }
    
  },[isAuthenticated,navigate,error,dispatch])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">New Password</h1>

        <div className="mb-4">
          <label
            htmlFor="password_field"
            className="block text-gray-700 font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password_field"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirm_password_field"
            className="block text-gray-700 font-medium mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password_field"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
        >
          Set Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
