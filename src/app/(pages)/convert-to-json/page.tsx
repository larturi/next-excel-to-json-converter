'use client';

import { UploadFile } from '@/app/components/UploadFile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
   return (
      <div>
         <UploadFile />
         <ToastContainer position="top-center" autoClose={2000} />
      </div>
   );
}
