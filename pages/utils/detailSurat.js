import React from 'react';

const formatKey = (key) => {
  switch (key) {
    case 'nomor_tanggal_lp':
      return 'Nomor Tanggal LP';
    case 'disposisi_ka_ir':
      return 'Disposisi KA/IR';
    case 'satwil_ker_terlapor':
      return 'SATWIL/KER Terlapor';
    default:
      return key.replace(/_/g, ' '); // Ganti underscore dengan spasi
  }
};

const DetailSurat = ({ data }) => {
  if (!data) {
    return <p>Data surat tidak tersedia</p>;
  }
  return (
    <div className="border border-gray-300 rounded-md bg-[#f8f9fa]">
      {Object.entries(data)
        .filter(([key]) => key !== 'id') // Mengecualikan key 'id'
        .map(([key, value], index) => (
          <div  
            key={index}
            className="p-3 border-b last:border-b-0"
          >
            {/* Key sebagai label */}
            <div className="font-bold text-black capitalize mb-1">
              {formatKey(key)}
            </div>
            {/* Value di bawah label */}
            <div className="text-black break-words">
              {value}
            </div>
          </div>
        ))}
    </div>
  );
};

export default DetailSurat;
