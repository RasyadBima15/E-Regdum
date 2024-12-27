import React from 'react';
import { Formik, Field, Form } from 'formik';
import { database } from '@/firebase';
import { ref, set } from "firebase/database";
import { toast } from 'react-toastify';
import { update } from 'firebase/database';

const FormSurat = ({ nama_instansi = undefined, id_surat = 0, surat = {}, mode = 'input' }) => {
  const capitalizeInstansi = (nama) => {
    return nama.replace(/-/g, ' ').toUpperCase();
  };
  
  return (
    <div className="block w-[97%] mb-5 mx-auto sm:mt-5 p-6 bg-gray-100 border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <Formik
        initialValues={{
          nama_instansi: nama_instansi ? capitalizeInstansi(nama_instansi) : 'KOMPOLNAS',
          no_surat: mode === 'edit' ? surat.no_surat : '',
          tanggal_diterima: mode === 'edit' ? surat.tanggal_diterima : '',
          hal: mode === 'edit' ? surat.hal : '',
          nomor_laporan_polisi: mode === 'edit' ? surat.nomor_laporan_polisi : '',
          disposisi_ka_ir: mode === 'edit' ? surat.disposisi_ka_ir : '',
          disposisi_ksb_dumasanwas: mode === 'edit' ? surat.disposisi_ksb_dumasanwas : '',
          tindak_lanjut: mode === 'edit' ? surat.tindak_lanjut : '',
          jawaban: mode === 'edit' ? surat.jawaban : 'Sudah Dijawab',
          status_penanganan: mode === 'edit' ? surat.status_penanganan : '',
          zona: mode === 'edit' ? surat.zona : 'Zona 1',
          petugas: mode === 'edit' ? surat.petugas : '',
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const suratRef = mode === 'edit'
            ? ref(database, `${surat.id}`) // Mode Edit -> Update di ID existing
            : ref(database, `${Date.now()}`); // Mode Add -> Tambah data baru
      
          const action = mode === 'edit'
            ? update(suratRef, values) // Update data jika edit mode
            : set(suratRef, values); // Set data baru jika tambah mode
      
          // Eksekusi
          action
            .then(() => {
              if (mode !== 'edit') {
                resetForm(); // Reset form hanya jika bukan mode edit
              }
              toast.success(mode === 'edit' ? "Surat berhasil diperbarui" : "Surat berhasil disimpan");
            })
            .catch((error) => {
              toast.error(`Gagal: ${error.message}`);
            })
            .finally(() => {
              setSubmitting(false); // Menandai selesai submit
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
          <div className="flex justify-between">
            <h5 className="text-2xl font-medium text-gray-900 dark:text-white">{mode === 'edit' ? 'Edit Surat' : 'Tambah Surat'}</h5>
          </div>

          {/* Field nama_instansi */}
          <div>
            <label htmlFor="nama_instansi" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Instansi</label>
            <Field
              as="select"
              name="nama_instansi"
              id="nama_instansi"
              disabled={!!nama_instansi}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="KOMPOLNAS">KOMPOLNAS</option>
              <option value="OMBUDSMAN">OMBUDSMAN</option>
              <option value="ITWASUM">ITWASUM</option>
              <option value="KOMNAS HAM">KOMNAS HAM</option>
              <option value="DUMAS PRESISI">DUMAS PRESISI</option>
              <option value="MASYARAKAT">MASYARAKAT</option>
              <option value="SATKER">SATKER</option>
              <option value="LSM">LSM</option>
              <option value="ADVOCAT">ADVOCAT</option>
            </Field>
          </div>
          {/* Field no_surat */}
          <div>
            <label htmlFor="no_surat" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No Surat</label>
            <Field
              type="text"
              name="no_surat"
              id="no_surat"
              placeholder="Masukkan nomor surat"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Field tanggal_diterima */}
          <div>
            <label htmlFor="tanggal_diterima" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal Diterima</label>
            <Field
              type="date"
              name="tanggal_diterima"
              id="tanggal_diterima"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Field hal */}
          <div>
            <label htmlFor="hal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hal</label>
            <Field
              as="textarea"
              name="hal"
              id="hal"
              rows="4"
              placeholder="Masukkan hal surat"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Field nomor_laporan_polisi */}
          <div>
            <label htmlFor="nomor_laporan_polisi" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Laporan Polisi</label>
            <Field
              type="text"
              name="nomor_laporan_polisi"
              id="nomor_laporan_polisi"
              placeholder="Masukkan nomor laporan polisi"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Field disposisi_ka_ir */}
          <div>
            <label htmlFor="disposisi_ka_ir" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Disposisi KA IR</label>
            <Field
              type="text"
              name="disposisi_ka_ir"
              id="disposisi_ka_ir"
              placeholder="Masukkan disposisi kepala IR"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Field disposisi_ksb_dumasanwas */}
          <div>
            <label htmlFor="disposisi_ksb_dumasanwas" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Disposisi KSB Dumasanwas
            </label>
            <Field
              type="text"
              name="disposisi_ksb_dumasanwas"
              id="disposisi_ksb_dumasanwas"
              placeholder="Masukkan disposisi KSB Dumasanwas"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Field tindak_lanjut */}
          <div>
            <label htmlFor="tindak_lanjut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tindak Lanjut
            </label>
            <Field
              type="text"
              name="tindak_lanjut"
              id="tindak_lanjut"
              placeholder="Masukkan tindak lanjut"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Field jawaban */}
          <div>
            <label htmlFor="jawaban" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Jawaban
            </label>
            <Field
              as="select"
              name="jawaban"
              id="jawaban"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="Sudah Dijawab">Sudah Dijawab</option>
              <option value="Belum Dijawab">Belum Dijawab</option>
              <option value="Proses">Proses</option>
            </Field>
          </div>

          {/* Field status_penanganan */}
          <div>
            <label htmlFor="status_penanganan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Status Penanganan
            </label>
            <Field
              type='text'
              name="status_penanganan"
              id="status_penanganan"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            >
            </Field>
          </div>

          {/* Field status_penanganan */}
          <div>
            <label htmlFor="zona" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Zona
            </label>
            <Field
              as="select"
              name="zona"
              id="zona"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="Zona 1">Zona 1</option>
              <option value="Zona 2">Zona 2</option>
              <option value="Zona 3">Zona 3</option>
              <option value="Zona 4">Zona 4</option>
            </Field>
          </div>

          {/* Field petugas */}
          <div>
            <label htmlFor="petugas" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Petugas</label>
            <Field
              type="text"
              name="petugas"
              id="petugas"
              placeholder="Nama Petugas"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div className="flex items-center justify-between pt-2 w-full">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="text-white w-full bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {mode === 'edit' ? 'Edit Surat' : 'Tambah Surat'}
          </button>
          </div>
        </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormSurat;
