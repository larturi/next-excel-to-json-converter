import 'react-toastify/dist/ReactToastify.css';

import { UploadFile } from '@/app/components/UploadFile';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '@/app/components/Sidebar';

export default async function Home() {
   return (
      <div>
         <h1 className='text-3xl font-bold p-7'>JSON to Excel</h1>
         <Sidebar />
         <ToastContainer position='top-center' autoClose={2000} />
      </div>
   );
}
