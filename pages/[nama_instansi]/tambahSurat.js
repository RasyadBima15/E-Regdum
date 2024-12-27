import Navbar from '@/pages/utils/navbar';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '@/firebase';
import Footer from '../utils/footer';
import FormSurat from '../utils/formSurat';

const TambahSurat = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
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

  const { nama_instansi } = router.query;
  const instansiList = ['komnas-ham', 'kompolnas', 'ombudsman', 'itwasum', 'dumas-presisi', 'masyarakat', 'satker', 'lsm', 'advocat'];

  if (instansiList.includes(nama_instansi) && !isCheckingAuth) {
    return (
    <>
        <main className='flex-grow'>
          <Navbar/>
          <div className="bg-white p-5 mt-32 sm:mt-24">
            <FormSurat nama_instansi={nama_instansi}/>
          </div>
        </main>
        <Footer/>
    </>
    );
  }
};

export default TambahSurat;
