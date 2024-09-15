import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser,addUser, emptyOutState } from '../slice/userSlice';

// Yup schema for validation
const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});


function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(emptyOutState());
  },[])

  // Sign-up with Supabase
  async function signUpNewUser() {
    const newUser={
      'name':name,
      'email':email,
      'password':password,
    }
    dispatch(addUser(newUser));
    dispatch(updateUser({ name: name, email: email }));
    navigate('/home');
  }

  // Handle form submission and Yup validation
  function handleSubmit(event) {
    event.preventDefault();

    signUpSchema.validate({ name, email, password }, { abortEarly: false })
      .then(() => {
        signUpNewUser();
      })
      .catch((err) => {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-purple-500 p-5">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <h2>UserName</h2>
          <div className="mb-6">
            <input 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <h2>Email</h2>
          <div className="mb-6">
            <input 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <h2>Password</h2>
          <div className="mb-6">
            <input 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            className="bg-purple-400 hover:bg-pink-400 text-white font-bold py-4 rounded-lg w-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 flex justify-center items-center">
          <p className="text-gray-600">Already have an account?</p>
          <NavLink to="/login" className="text-p-600 underline ml-2 font-extrabold">Login</NavLink>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
