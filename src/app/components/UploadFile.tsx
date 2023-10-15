'use client';

import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { HiOutlineRefresh } from 'react-icons/hi';

export type ValidExtension = 'xlsx' | 'json';

interface UploadFileProps {
   fileExtension: ValidExtension;
   transformTo: ValidExtension;
}

const UploadFile: React.FC<UploadFileProps> = ({
   fileExtension,
   transformTo,
}) => {
   const [file, setFile] = useState<File>();
   const [jsonData, setJsonData] = useState({});
   const [loading, setLoading] = useState(false);
   const [excelDownloadUrl, setExcelDownloadUrl] = useState('');

   const copyToClipboard = () => {
      if (Object.keys(jsonData).length > 0) {
         navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
         toast.success('Text copied to clipboard', {
            position: 'bottom-right',
            autoClose: 1000,
         });
      }
   };

   const descargarExcel = () => {
      if (excelDownloadUrl) {
         window.open(excelDownloadUrl);
      }
   };

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);

      e.preventDefault();
      if (!file) {
         console.log('No file');
         return;
      }

      try {
         const dataToUpload = new FormData();
         dataToUpload.append('file', file);

         // Hace el upload a Cloudinary del archivo original y graba en Mongo
         const res1 = await fetch(
            `/api/upload?transformTo=${transformTo}&fileExtension=${fileExtension}`,
            {
               method: 'POST',
               body: dataToUpload,
            }
         );

         if (!res1.ok) {
            throw new Error(await res1.text());
         } else {
            const fileUploaded = await res1.json();

            // Hace la conversion del file, lo sube a Cloudinary y updetea en Mongo
            const res2 = await fetch(
               `/api/convert?transformTo=${transformTo}&fileId=${fileUploaded.fileId}&fileUrl=${fileUploaded.fileUrl}&fileName=${fileUploaded.fileName}`,
               { method: 'POST' }
            );

            if (fileExtension === 'xlsx') {
               const transformedData = await res2.json();
               setJsonData(transformedData);
            }

            if (fileExtension === 'json') {
               const transformedData = await res2.json();
               setExcelDownloadUrl(transformedData.urlCloudinaryFileConverted);
            }
         }
      } catch (e: any) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   let allowedExtensions = '';

   if (fileExtension === 'xlsx') {
      allowedExtensions = '.xlsx, .xls';
   } else if (fileExtension === 'json') {
      allowedExtensions = '.json, .txt';
   }

   return (
      <div className='bg-gray-900 text-white py-5'>
         <form onSubmit={onSubmit}>
            <div className='lg:flex lg:justify-end lg:justify-items-center lg:mr-3 lg:p-0 lg:mb-3 gap-3 text-center px-3'>
               <div className='bg-gray-700 z-20 py-2 px-3 rounded-sm hover:bg-gray-600'>
                  <label className='bg-gray-700 z-20 text-white py-2 px-3 cursor-pointer mb-4 w-full hover:bg-gray-600'>
                     {file
                        ? file.name
                        : `Seleccionar archivo .${fileExtension}`}

                     <input
                        type='file'
                        name='file'
                        onChange={(e) => {
                           setJsonData({});
                           setFile(e.target.files?.[0]);
                        }}
                        placeholder='Seleccionar archivo'
                        className='bg-gray-700 text-white p-2 hidden z-20'
                        accept={allowedExtensions}
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

               {Object.keys(jsonData).length > 0 &&
                  fileExtension === 'xlsx' && (
                     <button
                        onClick={copyToClipboard}
                        className='bg-green-700 z-20 text-white py-2 px-3 cursor-pointer w-full lg:w-auto mb-4 lg:m-0 rounded-sm hover:bg-green-800'
                     >
                        Copiar al Portapapeles
                     </button>
                  )}

               {excelDownloadUrl !== '' && fileExtension === 'json' && (
                  <button
                     onClick={descargarExcel}
                     className='bg-green-700 z-20 text-white py-2 px-3 cursor-pointer w-full lg:w-auto mb-4 lg:m-0 rounded-sm hover:bg-green-800'
                  >
                     Descargar Excel
                  </button>
               )}
            </div>
         </form>

         {Object.keys(jsonData).length > 0 ? (
            <div className='bg-gray-900 h-[calc(100vh-200px)] mt-4 overflow-y-auto'>
               <div className='overflow-x-hidden'>
                  <pre>
                     <code className='text-green-400 text-sm'>
                        {JSON.stringify(jsonData, null, 2)}
                     </code>
                  </pre>
               </div>
            </div>
         ) : (
            <div className='bg-gray-900 h-[calc(100vh-200px)] flex justify-center mt-4 overflow-y-auto'>
               <p className='text-gray-600 self-center -mt-10'>
                  {loading ? (
                     <HiOutlineRefresh className='text-7xl animate-spin' />
                  ) : fileExtension === 'xlsx' ? (
                     'Upload Excel File to convert to JSON'
                  ) : (
                     'Upload JSON File to convert to Excel'
                  )}
               </p>
            </div>
         )}
      </div>
   );
};

export default UploadFile;
