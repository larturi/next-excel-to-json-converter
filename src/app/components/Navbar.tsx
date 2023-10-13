import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import MenuItem from './MenuItem';

export const Navbar = async () => {

   const session = await getServerSession(authOptions);

   return (
      <nav className='ml-0 fixed z-10'>
         <ul className='list-disc flex flex-col gap-5 fixed right-0 top-0 bottom-0 justify-center sm:m-10 m-3 '>
            
            <MenuItem href="/convert-to-json" key="/convert-to-json" name="excel to json" />
            <MenuItem href="/convert-to-excel" key="/convert-to-json" name="json to excel" />

            { session === null ? 
                <MenuItem href="/auth" key="auth" name="Login Or Register" /> : 
                <>
                    <MenuItem href="/files" key="files" name="My Files" /> 
                    <MenuItem href="/logout" key="logout" name="Logout" /> 
                </>
            }
            
         </ul>
      </nav>
   );
};


