import Navbar from '@/pages/utils/navbar';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '@/firebase';
import Footer from '@/pages/utils/footer';
import DetailSurat from '@/pages/utils/detailSurat';
import { getDatabase, ref, get } from 'firebase/database';
import { toast } from 'react-toastify';

const Surat = () => {
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

  const { id_surat, nama_instansi } = router.query;

  useEffect(() => {
      if (id_surat && !isCheckingAuth) {
        const suratRef = ref(db, `${id_surat}`); // Path ke surat berdasarkan ID
        get(suratRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // Bentuk data seperti yang diminta
              const formattedSurat = {
                id: id_surat,
                no_tanggal_surat: data.no_tanggal_surat || '',
                nama_instansi: data.nama_instansi || '',
                tanggal_diterima: data.tanggal_diterima || '',
                hal: data.hal || '',
                nomor_tanggal_lp: data.nomor_tanggal_lp || '',
                pelapor: data.pelapor || '',
                satwil_ker_terlapor: data.satwil_ker_terlapor || '',
                disposisi_ka_ir: data.disposisi_ka_ir || '',
                jawaban: data.jawaban || '',
                status_penanganan: data.status_penanganan || '',
                zona: data.zona || '',
                petugas: data.petugas || '',
              };
              setSurat(formattedSurat);
            }
          })
          .catch((error) => {
            toast.error('Error fetching surat:', error);
          })
      }
  }, [router.query, isCheckingAuth, db, id_surat]);

  const instansiList = ['komnas-ham', 'kompolnas', 'ombudsman', 'itwasum', 'dumas-presisi', 'masyarakat', 'satker', 'lsm', 'advocat'];

  if (instansiList.includes(nama_instansi) && surat !== null && !isCheckingAuth && id_surat == surat.id) {
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

export default Surat;
