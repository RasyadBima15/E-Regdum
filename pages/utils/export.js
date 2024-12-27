const Export = ({generateExcel}) => {
    return (
      <div className="sm:w-[97%] w-[90%] mx-auto">
        <div className="flex justify-start items-center my-6">
            <div className="flex flex-row gap-4">
                {/* Export to Excel Button */}
                <button onClick={generateExcel} className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700">
                    Export to Excel
                </button>
            </div>
        </div>
      </div>
    );
  };
  
export default Export;