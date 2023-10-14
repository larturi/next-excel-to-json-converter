import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/app/components/Sidebar';

export default async function MyFilesPage() {
   const session = await getServerSession(authOptions);

   if (session !== null) {
      return (
         <div>
            <h1 className='text-3xl font-bold p-7'>My Files</h1>
            <Sidebar />
            <ToastContainer position='top-center' autoClose={2000} />
         </div>
      );
   } else {
      redirect('/auth');
   }
}
