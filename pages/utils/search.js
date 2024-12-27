import { useState } from "react";
import Link from "next/link";
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import firebaseApp from '@/firebase';

const Search = ({nama_instansi = undefined, setSurat, setLoading, }) => {
  const [selectedCategory, setSelectedCategory] = useState("Nomor Surat");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const db = getDatabase(firebaseApp);

  // Daftar kategori dropdown
  const categories = [
    "Nomor Surat",
    "Nama Instansi",
    "Tanggal Diterima",
    "Hal",
    "Nomor Laporan Polisi",
    "Disposisi KA / IR",
    "Disposisi KSB Dumasanwas",
    "Tindak Lanjut",
    "Jawaban",
    "Status Penanganan",
    "Zona",
    "Petugas",
  ];

  // Logic to remove "Nama Instansi" if on /dashboard/<nama_instansi>
  const filteredCategories = nama_instansi
    ? categories.filter((category) => category !== "Nama Instansi")
    : categories;

  // Handle klik kategori dropdown
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery("")
    setDropdownOpen(false);
  };

  // Optional: Helper function to standardize field names
  const formatField = (field) => {
    switch (field) {
      case "Nama Instansi":
        return "nama_instansi";
      case "Nomor Surat":
        return "no_surat";
      case "Tanggal Diterima":
        return "tanggal_diterima";
      case "Hal":
        return "hal";
      case "Nomor Laporan Polisi":
        return "nomor_laporan_polisi";
      case "Disposisi KA / IR":
        return "disposisi_ka_ir";
      case "Disposisi KSB Dumasanwas":
        return "disposisi_ksb_dumasanwas";
      case "Tindak Lanjut":
        return "tindak_lanjut";
      case "Jawaban":
        return "jawaban";
      case "Status Penanganan":
        return "status_penanganan";
      case "Zona":
        return "zona";
      case "Petugas":
        return "petugas";
      default:
        return field;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  
    setLoading(true); // Mulai loading indikator
    
    // Convert query ke lowercase untuk pencarian case-insensitive
    const searchQueryLower = searchQuery.toLowerCase();
  
    // Field yang dipilih, diformat dengan fungsi formatField
    const formattedField = formatField(selectedCategory);
  
    // Referensi database
    const suratRef = ref(db);
  
    // Mengambil semua data dari Firebase
    const unsubscribe = onValue(
      suratRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
  
          // Transformasikan objek data menjadi array
          const formattedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
  
          // Filter data berdasarkan substring match
          const filteredData = formattedData.filter((item) => {
            // Ambil nilai field yang relevan, pastikan menjadi string, dan diubah ke lowercase
            const fieldValue = (item[formattedField] || "").toString().toLowerCase();
            return fieldValue.includes(searchQueryLower); // Substring matching
          });
  
          setSurat(filteredData); // Set hasil pencarian ke state
        } else {
          setSurat([]); // Jika tidak ada data ditemukan
        }
        setLoading(false); // Selesai loading
      },
      (error) => {
        console.error("Error during search:", error);
        setLoading(false); // Pastikan indikator loading berhenti meskipun ada error
      }
    );
  
    // Hentikan listener saat fungsi selesai (opsional jika digunakan sebagai live query)
    return () => unsubscribe();
  };
  
  
  return (
    <div className="flex flex-col sm:flex-row justify-center">
        <form onSubmit={handleSearch} className="sm:w-[75%] w-full">
          <div className="flex flex-row">
            {/* Dropdown Button */}
            <button
              id="dropdown-button"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex-shrink-0 z-10 inline-flex items-center py-1.5 px-3 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            >
              {selectedCategory}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown List */}
            {dropdownOpen && (
              <div
                id="dropdown"
                className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  {filteredCategories.map((category) => (
                    <li key={category}>
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className="inline-flex w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Search Input */}
            <div className="relative w-full">
              {/* Kondisi untuk input tipe date */}
              {selectedCategory === "Tanggal Diterima" ? (
                <input
                  type="date"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-sm border-s-gray-50 border-s-2 border border-gray-300"
                  required
                />
              ) : (
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-sm border-s-gray-50 border-s-2 border border-gray-300"
                  placeholder="Search..."
                  required
                />
              )}
            </div>
            <button
                type="submit"
                className="p-3 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
          </div>
        </form>

        {/* Button "Lihat Semua" */}
        <button
          onClick={() => window.location.reload()} 
          className="text-white whitespace-nowrap bg-blue-700 hover:bg-blue-800 text-center mt-5 sm:mt-0 sm:ml-5 font-medium rounded-lg text-sm px-5 py-2.5 border"
        >
          Lihat Semua
        </button>
        <Link 
            href={nama_instansi ? `/${nama_instansi}/tambahSurat` : '/rekap/tambahSurat'}
            className="focus:outline-none whitespace-nowrap mt-5 sm:mt-0 sm:ml-5 text-white w-26 h-13 border bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center"
          >
            Tambah Surat
            <svg className="ml-3" fill="#ffffff" height="20px" width="20px" version="1.1" id="Capa_1" viewBox="0 0 493.497 493.497" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M444.556,85.218H48.942C21.954,85.218,0,107.171,0,134.16v225.177c0,26.988,21.954,48.942,48.942,48.942h395.613 c26.988,0,48.941-21.954,48.941-48.942V134.16C493.497,107.171,471.544,85.218,444.556,85.218z M460.87,134.16v225.177 c0,2.574-0.725,4.924-1.793,7.09L343.74,251.081l117.097-117.097C460.837,134.049,460.87,134.096,460.87,134.16z M32.628,359.336 V134.16c0-0.064,0.033-0.11,0.033-0.175l117.097,117.097L34.413,366.426C33.353,364.26,32.628,361.911,32.628,359.336z M251.784,296.902c-2.692,2.691-7.378,2.691-10.07,0L62.667,117.846h368.172L251.784,296.902z M172.827,274.152l45.818,45.819 c7.512,7.511,17.493,11.645,28.104,11.645c10.61,0,20.592-4.134,28.104-11.645l45.82-45.819l101.49,101.499H71.327L172.827,274.152z "></path> </g></svg>
        </Link>
     </div>
  );
};

export default Search;
