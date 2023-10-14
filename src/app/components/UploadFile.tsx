'use client';

import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function UploadFile() {
   const [file, setFile] = useState<File>();
   const [jsonData, setJsonData] = useState({});

   const copyToClipboard = () => {
      if (Object.keys(jsonData).length > 0) {
         navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
         toast.success('Text copied to clipboard', {
            position: 'bottom-right',
            autoClose: 1000,
         });
      }
   };

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) {
         console.log('No file');
         return;
      }

      try {
         const data = new FormData();
         data.set('file', file);

         const res = await fetch('/api/upload', {
            method: 'POST',
            body: data,
         });

         if (!res.ok) {
            throw new Error(await res.text());
         } else {
            const res = await fetch('/api/convert', {
               method: 'POST',
            });

            const data = await res.json();
            setJsonData(data);
         }
      } catch (e: any) {
         console.error(e);
      }
   };

   return (
      <div className='bg-gray-900 text-white py-5'>
         <form onSubmit={onSubmit}>
            <div className='lg:flex lg:justify-end lg:justify-items-center lg:mr-3 lg:p-0 lg:mb-3 gap-3 text-center px-3'>
               <div className='bg-gray-700 z-20 py-2 px-3 rounded-sm hover:bg-gray-600'>
                  <label className='bg-gray-700 z-20 text-white py-2 px-3 cursor-pointer mb-4 w-full hover:bg-gray-600'>
                     {file ? file.name : 'Seleccionar archivo'}
                     <input
                        type='file'
                        name='file'
                        onChange={(e) => {
                           setJsonData({});
                           setFile(e.target.files?.[0]);
                        }}
                        placeholder='Seleccionar archivo'
                        className='bg-gray-700 text-white p-2 hidden z-20'
                        accept='.xlsx, .xls'
                     />
                  </label>
               </div>

               {file && (
                  <input
                     type='submit'
                     value='Upload'
                     className='bg-blue-500 text-white py-2 px-3 z-20 cursor-pointer w-full lg:w-auto mb-4 mt-4 lg:m-0 rounded-sm hover:bg-blue-700'
                  />
               )}

               {Object.keys(jsonData).length > 0 && (
                  <button
                     onClick={copyToClipboard}
                     className='bg-green-700 z-20 text-white py-2 px-3 cursor-pointer w-full lg:w-auto mb-4 lg:m-0 rounded-sm hover:bg-green-800'
                  >
                     Copiar al Portapapeles
                  </button>
               )}
            </div>
         </form>

         {Object.keys(jsonData).length > 0 ? (
            <div className='bg-gray-900 p-4'>
               <div className='overflow-x-hidden'>
                  <pre>
                     <code className='text-green-400 text-sm'>
                        {JSON.stringify(jsonData, null, 2)}
                     </code>
                  </pre>
               </div>
            </div>
         ) : (
            <div className='bg-gray-900 h-[calc(100vh-200px)] flex justify-center mt-4'>
               <p className='text-gray-600 self-center'>
                  Upload Excel File to convert to JSON
               </p>
            </div>
         )}
      </div>
   );
}
