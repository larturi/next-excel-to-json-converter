import 'react-toastify/dist/ReactToastify.css';

import UploadFile, { ValidExtension } from '@/app/components/UploadFile';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '@/app/components/Sidebar';

export default async function Home({ params }: { params: { slug: string } }) {
   const { slug } = params;
   const fileExtension: string = slug.substring(0, 4);
   const transformTo: string = slug.slice(-4);
   
   return (
      <div>
         <h1 className='text-3xl font-bold p-7 uppercase'>
            {`${fileExtension} to ${transformTo}`}
         </h1>
         <Sidebar />
         <UploadFile 
            fileExtension={fileExtension as ValidExtension} 
            transformTo={transformTo as ValidExtension} 
         />
         <ToastContainer position='top-center' autoClose={2000} />
      </div>
   );
}
