/* eslint-disable @next/next/no-img-element */
import Navbar from '../utils/navbar';
import Search from '../utils/search';
import Table from '../utils/table';
import Export from '../utils/export';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '@/firebase';
import { useRouter } from 'next/router';
import Footer from '../utils/footer';
import { getDatabase, ref, onValue } from 'firebase/database';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const Rekap = () => {
  const [surat, setSurat] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

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

  // Fetch data dari Firebase Realtime Database
  useEffect(() => {
    const suratRef = ref(db); // Pastikan referensi sesuai dengan lokasi data di database

    const dataUnsubscribe = onValue(
      suratRef,
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
  }, [db]);

  // Header kolom
  const header = [
    'Nomor dan Tanggal Surat', 'Nama Instansi', 'Tanggal Diterima', 'Hal',
    'No dan Tanggal LP', 'Nama Pengadu', 'Disposisi Ka IR', 
    'Tindak Lanjut', 'Jawaban', 'Status Penanganan', 'Petugas', 'Zona'
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
        item['nama_pengadu'],
        item['disposisi_ka_ir'],
        item['tindak_lanjut'],
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

  if (!isCheckingAuth){
    return (
      <>
          <main className="flex-grow">
            <Navbar/>
            <div className="bg-white p-5 mt-32 sm:mt-24">
              <h1 className="text-2xl font-bold mb-5 text-[#009ce9]">Rekap</h1>
              <Search setLoading={setLoading} setSurat={setSurat}/>
            </div>
            <Table surat={surat} isLoading={loading}/>
            <Export generateExcel={generateExcel}/>
          </main>
          <Footer/>
      </>
    );
  }
};

export default Rekap;
