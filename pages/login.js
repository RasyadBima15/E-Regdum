/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { signIn } from '../helper/auth/firebaseAuth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from '@/firebase';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const router = useRouter();

  const auth = getAuth(firebaseApp);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      } else {
        setIsCheckingAuth(false); // Selesai memeriksa
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah formulir dari perilaku default
    setLoading(true);
    try {
      await signIn(username, password);
      router.push('/dashboard');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        toast.error("Username atau password salah");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  if (!isCheckingAuth){
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-2">
        <div className="w-full max-w-md p-6 sm:p-10 bg-white rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center mb-6 sm:gap-10">
            <img
              src="/itwasda.png"
              alt="Logo Itwasda"
              className="w-28"
            />
            <div className="flex flex-col justify-center gap-1 text-center sm:text-left">
              <span
                className="text-xl text-black font-bold sm:text-2xl whitespace-nowrap"
              >
                E-Regdum
              </span>
              <span
                className="text-sm sm:text-lg text-black font-medium whitespace-nowrap"
              >
                Registrasi Dumasan
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-black"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Mengikat state
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Your Username"
              />
            </div>
            {/* Password Field with Toggle */}
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                id="password"
                name="password"
                type='password'
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm sm:text-base font-semibold text-white bg-[#125fcc] rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Login to your account
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default Login;
