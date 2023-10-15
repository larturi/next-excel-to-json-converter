import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/app/components/Sidebar';
import { Session } from 'next-auth';
import { getExtension } from '@/app/utils/get-extension';
import { AiOutlineFileExcel } from 'react-icons/ai';
import { BsFiletypeJson } from 'react-icons/bs';
import { format } from 'date-fns';
import prismadb from '@/app/libs/prismadb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ExtensionToIcon = {
   [key: string]: JSX.Element;
 };

const extensionToIcon: ExtensionToIcon = {
  xlsx: <AiOutlineFileExcel className='text-lg' />,
  json: <BsFiletypeJson className='text-lg' />,
};

async function getData(session: Session) {
   const files = await prismadb.file.findMany({
      where: {
         userId: session.user.id,
      },
      orderBy: {
         createdAt: 'desc',
      },
   });

   if (!files) {
      throw new Error('Failed to fetch data');
   }

   return files;
}

export default async function MyFilesPage() {
   const session = await getServerSession(authOptions);

   if (session !== null) {
      const files = await getData(session);
       
      return (
         <div>
            <h1 className='text-3xl font-bold p-7'>My Files</h1>
            <Sidebar />

            <div
               className='bg-gray-900'
               style={{ height: 'calc(100vh - 7rem)', overflowY: 'auto' }}
            >
               <div className='p-4 relative overflow-x-auto w-2/3'>
                  <table className='table-auto w-full text-sm text-left'>
                     <thead className='ext-xs text-whiteuppercase text-white border-b'>
                        <tr>
                           <th scope='col' className='px-6 py-3'>
                              Original File
                           </th>
                           <th scope='col' className='px-6 py-3'>
                              Converted File
                           </th>
                           <th scope='col' className='px-6 py-3'>
                              Created
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {files.map((file) => (
                           <tr key={file.id} className='border-b text-white'>
                              <td className='px-6 py-4'>
                                 <a href={file.fileUrl} target='_blank' rel='noopener noreferrer'>
                                    <span className='flex gap-3'>
                                       {extensionToIcon[file.fileExtension]}
                                       {file.fileUrl?.split('/').pop()}
                                    </span>
                                 </a>
                              </td>

                              <td className='px-6 py-4'>
                                 <a href={file.convertedFileUrl} target='_blank' rel='noopener noreferrer'>
                                    <span className='flex gap-3'>
                                       {extensionToIcon[file.convertedExtension]}
                                       {file.convertedFileUrl?.split('/').pop()}
                                    </span>
                                 </a>
                              </td>

                              <td className='px-6 py-4'>
                                 {format(new Date(file.createdAt), "dd-MM-yyyy HH:mm:ss")}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      );
   } else {
      redirect('/auth');
   }
}
