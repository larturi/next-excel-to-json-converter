import Login from '@/app/components/Login';
import Head from 'next/head';

const LoginPage = () => {
   return (
      <div className='h-full'>
         <Head>
            <title>Login</title>
         </Head>

         <Login />
      </div>
   );
};

export default LoginPage;
