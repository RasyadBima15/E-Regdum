import React from 'react';

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
              {key.replace(/_/g, ' ')}
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
