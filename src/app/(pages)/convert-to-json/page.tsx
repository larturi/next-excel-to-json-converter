import { UploadFile } from '@/app/components/UploadFile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export default async function Home(req: NextRequest) {
   const session = await getServerSession(authOptions);

   if (session !== null) {
      return (
         <div>
            <UploadFile />
            <ToastContainer position='top-center' autoClose={2000} />
         </div>
      );
   } else {
      redirect('/auth');
   }
}
