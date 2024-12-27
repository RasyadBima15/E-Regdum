/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { logout } from '../auth/firebaseAuth';
import { toast } from 'react-toastify';

const Navbar = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="bg-[#009ce9] dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex flex-col sm:flex-row items-center space-x-3 rtl:space-x-reverse">
            <img src="/itwasda.png" alt="Logo Itwasda" className="h-16" />
            <span className="self-center sm:ml-5 text-lg sm:text-xl font-bold whitespace-nowrap text-white">
              E-Regdum (Register Dumas)
            </span>
          </div>
          <button
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg md:hidden"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } w-full mt-3 px-4 pb-4 border-2 rounded-lg sm:border-0 border-white md:flex md:w-auto md:items-center`}
          >
            <ul className="flex flex-col md:p-0 mt-4 font-medium bg-[#009ce9] md:space-x-8 md:space-y-0 rtl:space-x-reverse md:flex-row md:mt-0">
              <li className="w-full">
                <a href="/dashboard" className="block py-2 px-3 text-base sm:text-lg font-bold rounded text-white w-full text-left">
                  Dashboard
                </a>
              </li>
              <li className="w-full">
                <a href="/rekap" className="block py-2 px-3 text-base sm:text-lg font-bold rounded text-white w-full text-left">
                  Rekap
                </a>
              </li>
              <li className="w-full">
                <button
                  type="button"
                  onClick={openModal}
                  className="block text-white py-2 px-3 sm:text-lg text-base font-bold rounded w-full text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-normal text-black mb-5">Apakah kamu yakin ingin logout?</h3>
            <button
              onClick={handleLogout}
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

export default Navbar;
