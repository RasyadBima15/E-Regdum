import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, remove } from "firebase/database";
import { toast } from 'react-toastify';

const Table = ( {nama_instansi = '', surat = [], isLoading = false} ) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const openModal = (id) => {
    setCurrentItemId(id);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading, surat]);
  
      
  // Hitung item yang akan ditampilkan berdasarkan halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (surat || []).slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async () => {
    try {
      const db = getDatabase(); // Inisialisasi Firebase Realtime Database
      const suratRef = ref(db, `${currentItemId}`); // Path data yang akan dihapus (sesuaikan sesuai struktur database Anda)
      await remove(suratRef); 
      toast.success("Surat Berhasil dihapus")
      closeModal();
    } catch (error) {
      toast.error("Gagal menghapus surat:", error);
    }
  };

  if (!Array.isArray(surat) || surat.length === 0) {
    return <div className="block sm:w-[97%] w-[90%] mb-5 mx-auto p-6 bg-gray-100 border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-y-auto">
      <div className="flex justify-center items-center gap-2">
          <h1 className="sm:text-2xl text-md text-black font-semibold">Tidak ada data yang ditemukan</h1>
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
      </div>
      <div className="flex flex-row justify-between items-center mt-5">
      <span className="text-sm text-gray-700 dark:text-gray-400">
        {surat.length > 0 ? (
          <>
            Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(indexOfLastItem, surat.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{surat.length}</span> Entries
          </>
        ) : (
          <span className="font-semibold text-gray-900 dark:text-white">No Entries Available</span>
        )}
      </span>
      <div className="inline-flex gap-2 mt-2 xs:mt-0">
        {currentPage > 1 && (
          <button onClick={() => paginate(currentPage - 1)} className="flex items-center justify-center px-4 h-10 text-base border font-medium text-white bg-gray-800 rounded hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
            </svg>
            Sebelumnya
          </button>
        )}
        {indexOfLastItem < surat.length && (
          <button onClick={() => paginate(currentPage + 1)} className="flex items-center justify-center px-4 h-10 text-base font-medium border text-white bg-gray-800 rounded hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Berikutnya
            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </button>
        )}
      </div>
    </div>
  </div>;
  }

  return (
      <>
        <div className="block sm:w-[97%] w-[90%] mb-5 mx-auto p-6 bg-gray-100 border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-y-auto">
            {loading? (
              <div className="flex justify-center items-center gap-2">
                <h1 className="text-2xl text-black font-semibold">Loading...</h1>
                <svg className="w-6 h-6 animate-spin" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
            ) : surat.length > 0 ? (
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-black dark:text-gray-400">
                  <thead className="text-sm border-b border-black text-black uppercase dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Nomor dan Tanggal Surat</th>
                      <th scope="col" className="px-6 py-3">Nama Instansi</th>
                      <th scope="col" className="px-6 py-3">Tanggal Diterima</th>
                      <th scope="col" className="px-6 py-3">Hal</th>
                      <th scope="col" className="px-6 py-3">No dan Tanggal LP</th>
                      <th scope="col" className="px-6 py-3">Pelapor</th>
                      <th scope="col" className="px-6 py-3">SATWIL/KER Terlapor</th>
                      <th scope="col" className="px-6 py-3">Disposisi KA / IR</th>
                      <th scope="col" className="px-6 py-3">Jawaban</th>
                      <th scope="col" className="px-6 py-3">Status Penanganan</th>
                      <th scope="col" className="px-6 py-3">Zona</th>
                      <th scope="col" className="px-6 py-3">Petugas</th>
                      <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.id} className="bg-transparent border-b border-black dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">{item.no_tanggal_surat}</td>
                        <td className="px-6 py-4">{item.nama_instansi}</td>
                        <td className="px-6 py-4">{item.tanggal_diterima}</td>
                        <td className="px-6 py-4">{item.hal}</td>
                        <td className="px-6 py-4">{item.nomor_tanggal_lp}</td>
                        <td className="px-6 py-4">{item.pelapor}</td>
                        <td className="px-6 py-4">{item.satwil_ker_terlapor}</td>
                        <td className="px-6 py-4">{item.disposisi_ka_ir}</td>
                        <td className="px-6 py-4">{item.jawaban}</td>
                        <td className="px-6 py-4">{item.status_penanganan}</td>
                        <td className="px-6 py-4">{item.zona}</td>
                        <td className="px-6 py-4">{item.petugas}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-row justify-center">
                            <Link href={`/${nama_instansi ? nama_instansi : 'rekap'}/${item.id}`} className="text-white border border-black bg-cyan-800 hover:bg-cyan-900 font-medium rounded-lg text-sm px-4 py-2 me-2 whitespace-nowrap">Lihat Detail</Link>
                            <Link href={`/${nama_instansi ? nama_instansi : 'rekap'}/${item.id}/editSurat`} className="focus:outline-none text-white border border-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-4 py-2 me-2">Edit</Link>
                            <button onClick={() => openModal(item.id)} type="submit" className="focus:outline-none text-white border border-black bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 py-2 me-2">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <h1 className="sm:text-2xl text-md text-black font-semibold">Tidak ada data yang ditemukan</h1>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
            )}
            <div className="flex flex-row justify-between items-center mt-5">
            <span className="text-sm text-gray-700 dark:text-gray-400">
              {surat.length > 0 ? (
                <>
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(indexOfLastItem, surat.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{surat.length}</span> Entries
                </>
              ) : (
                <span className="font-semibold text-gray-900 dark:text-white">No Entries Available</span>
              )}
            </span>
            <div className="inline-flex gap-2 mt-2 xs:mt-0">
              {currentPage > 1 && (
                <button onClick={() => paginate(currentPage - 1)} className="flex items-center justify-center px-4 h-10 text-base border font-medium text-white bg-gray-800 rounded hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                  </svg>
                  Sebelumnya
                </button>
              )}
              {indexOfLastItem < surat.length && (
                <button onClick={() => paginate(currentPage + 1)} className="flex items-center justify-center px-4 h-10 text-base font-medium border text-white bg-gray-800 rounded hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  Berikutnya
                  <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-normal text-black mb-5">Apakah kamu yakin ingin menghapus surat ini?</h3>
              <button
                onClick={handleDelete}
                className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mr-2"
              >
                Ya
              </button>
              <button
                onClick={closeModal}
                className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                Tidak
              </button>
            </div>
          </div>
        )}
      </>
  );
};
  
  export default Table;