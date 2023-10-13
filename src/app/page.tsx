'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UploadFile } from "./components/UploadFile";

export default function Home() {
   return (
      <div>
         <UploadFile />
         <ToastContainer position="top-center" autoClose={2000} />

      </div>
   );
}
