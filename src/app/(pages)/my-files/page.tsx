import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/app/components/Sidebar';
import { Session } from 'next-auth';
import { getExtension } from '@/app/utils/get-extension';
import { AiOutlineFileExcel } from 'react-icons/ai';

async function getData(session: Session) {
   const files = await prismadb.file.findMany({
      where: {
         userId: session.user.id,
      },
      orderBy: {
         createdAt: 'desc'
      }
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
            <div>
               <div className='p-4 relative overflow-x-auto w-1/2'>
                  <table className='table-auto w-full text-sm text-left'>
                     <thead className='ext-xs text-whiteuppercase text-white border-b'>
                        <tr>
                           <th scope="col" className="px-6 py-3">File</th>
                           <th scope="col" className="px-6 py-3">Created</th>
                        </tr>
                     </thead>
                     <tbody>
                        {files.map((file) => (
                           <tr key={file.id} className='border-b text-white'>
                              <td className='px-6 py-4'>
                                 {
                                    getExtension(file.fileUrl) === 'xlsx' ?
                                       <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                                          <span className='flex gap-3'><AiOutlineFileExcel className="text-lg"/> {file?.fileUrl.split('/').pop()}</span>
                                       </a> :
                                       <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.fileUrl}</a>
                                 }
                              </td>
                              <td className='px-6 py-4'>{file.createdAt.toISOString()}</td>
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
