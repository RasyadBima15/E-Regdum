/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebaseApp from '@/firebase';

const Dashboard = () => {
  const router = useRouter();
  const [items, setItems] = useState([
    { id: 1, totalItem: null, path: '/kompolnas', title: "KOMPOLNAS", color: "bg-red-600", colorButton: "bg-red-800", colorHover: "hover:bg-red-900" },
    { id: 2, totalItem: null, path: '/ombudsman', title: "OMBUDSMAN", color: "bg-green-600", colorButton: "bg-green-800", colorHover: "hover:bg-green-900" },
    { id: 3, totalItem: null, path: '/itwasum', title: "ITWASUM", color: "bg-blue-600", colorButton: "bg-blue-800", colorHover: "hover:bg-blue-900" },
    { id: 4, totalItem: null, path: '/komnas-ham', title: "KOMNAS HAM", color: "bg-yellow-600", colorButton: "bg-yellow-800", colorHover: "hover:bg-yellow-900" },
    { id: 5, totalItem: null, path: '/dumas-presisi', title: "DUMAS PRESISI", color: "bg-purple-600", colorButton: "bg-purple-800", colorHover: "hover:bg-purple-900" },
    { id: 6, totalItem: null, path: '/masyarakat', title: "MASYARAKAT", color: "bg-pink-600", colorButton: "bg-pink-800", colorHover: "hover:bg-pink-900" },
    { id: 7, totalItem: null, path: '/satker', title: "SATKER", color: "bg-teal-600", colorButton: "bg-teal-800", colorHover: "hover:bg-teal-900" },
    { id: 8, totalItem: null, path: '/lsm', title: "LSM", color: "bg-orange-600", colorButton: "bg-orange-800", colorHover: "hover:bg-orange-900" },
    { id: 9, totalItem: null, path: '/advocat', title: "ADVOCAT", color: "bg-indigo-600", colorButton: "bg-indigo-800", colorHover: "hover:bg-indigo-900" },
  ]);

  const db = getDatabase(firebaseApp);

  useEffect(() => {
    const updatedItems = [...items]; // Menyalin state sementara
    let fetchCount = 0;

    updatedItems.forEach((item, index) => {
      const instansiRef = ref(db);

      // Untuk mendengarkan data sekali saja
      onValue(instansiRef, snapshot => {
        let totalCount = 0;
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          // Mengiterasi data dan mencari data berdasarkan nama_instansi
          for (const key in data) {
            if (data[key].nama_instansi === item.title) {
              totalCount += 1;
            }
          }
        }
        
        // Update jumlah item berdasarkan instansi
        updatedItems[index].totalItem = totalCount;

        fetchCount += 1;

        if (fetchCount === updatedItems.length) {
          // Setelah semua iterasi selesai, update state
          setItems(updatedItems);
        }
      });
    });

    return () => {};
  }, []); // Tidak ada dependencies, sehingga hanya dijalankan sekali saat mount

  const handleButtonClick = (path) => {
    router.push(path);
  };

  return (
    <div className="bg-white p-5 mt-32 sm:mt-24">
      <h1 className="text-2xl font-bold mb-5 text-[#009ce9]">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`p-6 rounded-lg text-white ${item.color}`}>
            <h2 className="text-xl font-semibold">{item.totalItem} Surat</h2>
            <p className="text-lg">{item.title}</p>
            <button onClick={() => handleButtonClick(item.path)} className={`mt-3 ${item.colorButton} ${item.colorHover} text-white px-4 py-2 rounded shadow`}>
              Lihat Selengkapnya →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;