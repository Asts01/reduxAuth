
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { canLoginUser, updateUser,emptyOutState } from '../slice/userSlice';

// Yup schema for validation
const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(''); // State for login error

  useEffect(()=>{
    dispatch(emptyOutState());
  },[])

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access the authentication status from Redux
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const allUsers=useSelector((state)=>state.user.allUsers);
  console.log(allUsers);


  // Handle form submission and Yup validation
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // Clear previous errors
      setErrors({});
      setLoginError(''); // Reset login error message

      // Validate the form inputs using Yup
      await signUpSchema.validate({ name, email, password }, { abortEarly: false });

      // Dispatch action to check if the user can log in
      dispatch(canLoginUser({ email, password }));

      // Wait for Redux state to update before proceeding
      if (isAuthenticated) {
        // Update Redux store with user information
        dispatch(updateUser({ name, email }));

        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');

        // Redirect to home page on successful login
        navigate('/home');
      } else {
        setLoginError('Invalid credentials. Please check your email and password.');
      }
    } catch (validationError) {
      // Handle Yup validation errors
      if (validationError.name === 'ValidationError') {
        const validationErrors = {};
        validationError.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors); // Set validation errors in state
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-200 p-6 absolute w-full">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg transform transition-all duration-300 hover:scale-105">
        <h2 className="font-extrabold text-3xl md:text-4xl lg:text-5xl text-center text-indigo-500 p-3 mb-5">Log-In</h2>

        {/* Show invalid credentials error if any */}
        {loginError && (
          <div className="bg-red-200 text-red-800 p-3 mb-4 rounded-lg text-center">
            {loginError}
          </div>
        )}
        <h1 className='mb-3'>Name</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <input 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
            {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name}</p>} {/* Display name validation error */}
          </div>
          <h1>Email</h1>
          <div className="mb-4">
            <input 
              placeholder="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} {/* Display email validation error */}
          </div>
          <h1>Paasword</h1>
          <div className="mb-4">
            <input 
              placeholder="Password" 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
            {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>} {/* Display password validation error */}
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-600 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
      <div className='w-full fixed bottom-0 bg-slate-500 text-yellow-400 text-center p-2 text-xl'>This is redux-app so make sure you did'nt refreshed after SignUp to Login successfully !!</div>
    </div>
  );
}

export default Login;
