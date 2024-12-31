import Navbar from '@/pages/utils/navbar';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '@/firebase';
import Footer from '@/pages/utils/footer';
import DetailSurat from '@/pages/utils/detailSurat';
import { getDatabase, ref, get } from 'firebase/database';
import { toast } from 'react-toastify';

const RekapSurat = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const [surat, setSurat] = useState(null);

  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

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

  const { id_surat } = router.query;

  useEffect(() => {
    if (id_surat && !isCheckingAuth) {
      const suratRef = ref(db, `${id_surat}`);
      get(suratRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const formattedSurat = {
              id: id_surat,
              no_surat: data.no_surat || '',
              nama_instansi: data.nama_instansi || '',
              tanggal_diterima: data.tanggal_diterima || '',
              hal: data.hal || '',
              nomor_laporan_polisi: data.nomor_laporan_polisi || '',
              disposisi_ka_ir: data.disposisi_ka_ir || '',
              disposisi_ksb_dumasanwas: data.disposisi_ksb_dumasanwas || '',
              tindak_lanjut: data.tindak_lanjut || '',
              jawaban: data.jawaban || '',
              status_penanganan: data.status_penanganan || '',
              zona: data.zona || '',
              petugas: data.petugas || '',
            };
            setSurat(formattedSurat);
          } else {
            toast.error('Surat tidak ditemukan.');
          }
        })
        .catch((error) => {
          console.error('Error fetching surat:', error);
          toast.error('Error fetching surat.');
        });
    }
  }, [id_surat, isCheckingAuth, db]);

  if (isCheckingAuth) {
    return <div>Memeriksa autentikasi...</div>;
  }
  
  if (surat === null) {
    return <div>Memuat data surat...</div>;
  }
  
  if (id_surat !== surat.id) {
    return <div>Surat tidak valid.</div>;
  }
  
  if (!surat) {
    return (
      <div>
        <h1>Surat Tidak Ditemukan</h1>
        <p>Pastikan surat dengan ID {id_surat} benar dan tersedia di sistem.</p>
      </div>
    );
  }  

  if (!isCheckingAuth && surat !== null && id_surat == surat.id) {
    return (
    <>
      <main className='flex-grow'>
        <Navbar/>
        <div className="bg-white p-5 mt-32 sm:mt-24">
            <h1 className="text-2xl font-bold mb-5 text-[#009ce9]">Detail Surat</h1>
            <DetailSurat data={surat} />
        </div>
      </main>
      <Footer/>
    </>
    );
  }
};

export default RekapSurat;
