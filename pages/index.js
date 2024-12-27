// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '../firebase';

const auth = getAuth(firebaseApp);

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Jika token atau sesi masih ada, arahkan ke dashboard
        router.push('/dashboard');
      } else {
        // Jika tidak ada token, arahkan ke halaman login
        router.push('/login');
      }
    });

    // Bersihkan listener saat komponen tidak aktif
    return () => unsubscribe();
  }, [router]);

  return null; // Tidak ada UI yang ditampilkan
};

export default Index;
