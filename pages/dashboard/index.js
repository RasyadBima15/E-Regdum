/* eslint-disable @next/next/no-img-element */
import Navbar from '../utils/navbar';
import Dashboard from '../utils/dashboard';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '@/firebase';
import { useRouter } from 'next/router';
import Footer from '../utils/footer';

const MainPage = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false); // Selesai memeriksa
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (!isCheckingAuth){
    return (
      <>
       <Navbar/>
       <Dashboard/>
       <Footer/>
      </>
    );
  }
};

export default MainPage;
