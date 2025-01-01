import Export from '@/pages/utils/export';
import Navbar from '@/pages/utils/navbar';
import Search from '@/pages/utils/search';
import Table from '@/pages/utils/table';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '@/firebase';
import Footer from '../utils/footer';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const Instansi = () => {
  const router = useRouter();
  const [surat, setSurat] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const [loading, setLoading] = useState(true); 
  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

  const capitalizeInstansi = (nama) => {
    return nama.replace(/-/g, ' ').toUpperCase(); // Mengganti "-" dengan spasi dan mengubah menjadi kapital
  };

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false); // Selesai memeriksa
      }
    });

    return () => authUnsubscribe();
  }, [auth, router]);

  const { nama_instansi } = router.query;
  useEffect(() => {
    if (nama_instansi) {
      const suratRef = ref(db);
      const queryRef = query(suratRef, orderByChild('nama_instansi'), equalTo(capitalizeInstansi(nama_instansi)));
     
      const dataUnsubscribe = onValue(
        queryRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            // Format data menjadi array
            const formattedSurat = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setSurat(formattedSurat); // Set data ke state
          } else {
            setSurat([]); // Reset state jika tidak ada data
          }
          setLoading(false); // Loading selesai setelah data diambil
        },
        (error) => {
          toast.error('Error fetching data:', error);
          setLoading(false); // Tetapkan loading selesai meskipun error
        }
      );
  
      return () => dataUnsubscribe(); // Cleanup observer
    }
  }, [db, nama_instansi]);

  const header = [
    'Nomor dan Tanggal Surat', 'Nama Instansi', 'Tanggal Diterima', 'Hal',
    'No dan Tanggal LP', 'Pelapor', 'SATKER/WIL Terlapor', 
    'Disposisi KA/IR', 'Jawaban', 'Status Penanganan', 'Petugas', 'Zona'
  ];

  // Fungsi untuk mengambil data dan membuat file Excel
  const generateExcel = async () => {
      try {
        if (!surat || surat.length === 0) {
          toast.error("Tidak ada data surat untuk diekspor!");
          return; // Keluar dari fungsi jika data surat kosong
        }
        // Map the surat data to array of arrays (assuming surat is an array of objects)
        const suratRows = surat.map((item) => [
          item['no_tanggal_surat'],
          item['nama_instansi'],
          item['tanggal_diterima'],
          item['hal'],
          item['nomor_tanggal_lp'],
          item['pelapor'],
          item['satwil_ker_terlapor'],
          item['disposisi_ka_ir'],
          item['jawaban'],
          item['status_penanganan'],
          item['petugas'],
          item['zona'],
        ]);
        const ws = XLSX.utils.aoa_to_sheet([header, ...suratRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
        // Menyimpan file Excel
        XLSX.writeFile(wb, "rekap.xlsx");
      } catch (error) {
        toast.error("Error generating Excel:", error);
      }
  };

  // Data instansi untuk keperluan validasi
  const instansiList = ['komnas-ham', 'kompolnas', 'ombudsman', 'itwasum', 'dumas-presisi', 'masyarakat', 'satker', 'lsm', 'advocat'];

  if (instansiList.includes(nama_instansi) && !isCheckingAuth) {
    return (
    <>
        <main className='flex-grow'>
          <Navbar/>
          <div className="bg-white p-5 mt-32 sm:mt-24">
              <h1 className="text-2xl font-bold mb-5 text-[#009ce9]">{capitalizeInstansi(nama_instansi)}</h1>
              <Search nama_instansi= {nama_instansi} setLoading={setLoading} setSurat={setSurat}/>
          </div>
          <Table nama_instansi= {nama_instansi} surat={surat} isLoading={loading}/>
          <Export generateExcel={generateExcel}/>
        </main>
        <Footer/>
    </>
    );
  }
};

export default Instansi;
