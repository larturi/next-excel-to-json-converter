'use client';

import { signOut } from 'next-auth/react';
import { RiLogoutCircleLine } from 'react-icons/ri';
interface LogoutProps {}


const Logout: React.FC<LogoutProps> = () => {
   return (
      <>
      <div className='flex items-center flex-row-reverse group cursor-pointer'>
        <RiLogoutCircleLine className='sm:text-4 xl text-2xl text-primary group-hover:text-accent transition-all ease-in-out duration-700 sm:ml-5 flex-shrink-0' />
        <p className={`opacity-0 group-hover:opacity-100 transition duration-700 text-2xl mr-3 font-bold uppercase`}>
          <button onClick={() => signOut()}>LOGOUT</button>
        </p>
      </div>
      </>
   );
};
export default Logout;
