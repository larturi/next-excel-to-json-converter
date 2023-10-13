import { UploadFile } from '@/app/components/UploadFile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';

export default async function Home() {
   const session = await getServerSession(authOptions);

   if (session !== null) {
      return (
         <div>
            <Navbar />
            <UploadFile />
            <ToastContainer position='top-center' autoClose={2000} />
         </div>
      );
   } else {
      redirect('/auth');
   }
}
