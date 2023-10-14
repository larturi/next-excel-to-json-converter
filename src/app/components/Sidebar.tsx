import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import MenuItem from './MenuItem';
import Logout from './Logout';
import { BsFiletypeJson } from 'react-icons/bs';
import { AiOutlineFileExcel, AiOutlineLogin } from 'react-icons/ai';
import { PiFilesFill } from 'react-icons/pi';


export const Sidebar = async () => {
   const session = await getServerSession(authOptions);

   return (
      <nav className='ml-0 fixed z-10'>
         <ul className='list-disc flex flex-col gap-5 fixed right-0 top-0 bottom-0 justify-center sm:m-10 m-3 '>
            <MenuItem
               href='/convert-to-json'
               name='excel to json'
               icon={<BsFiletypeJson className='sm:text-4 xl text-2xl text-primary group-hover:text-accent transition-all ease-in-out duration-700 sm:ml-5 flex-shrink-0'/>}
            />
            <MenuItem
               href='/convert-to-excel'
               name='json to excel'
               icon={<AiOutlineFileExcel className='sm:text-4 xl text-2xl text-primary group-hover:text-accent transition-all ease-in-out duration-700 sm:ml-5 flex-shrink-0'/>}
            />

            {session === null ? (
               <MenuItem 
                  href='/auth' 
                  name='Login' 
                  icon={<AiOutlineLogin className='sm:text-4 xl text-2xl text-primary group-hover:text-accent transition-all ease-in-out duration-700 sm:ml-5 flex-shrink-0'/>}
               />
            ) : (
               <>
                  <MenuItem 
                     href='/my-files' 
                     name='My Files' 
                     icon={<PiFilesFill className='sm:text-4 xl text-2xl text-primary group-hover:text-accent transition-all ease-in-out duration-700 sm:ml-5 flex-shrink-0'/>}
                  />
                  <Logout />
               </>
            )}
         </ul>
      </nav>
   );
};
