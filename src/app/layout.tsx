import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'Next Excel to JSON',
   description: 'Upload an Excel file and return a JSON representation',
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang='en' className='bg-gray-800'>
         <body className={inter.className}>
            <div>
               <div className='md:p-7 p-4 flex flex-row'>
                  <div className=''>
                     <h1 className='md:text-3xl text-xl font-semibold mb-4 text-white'>
                        Next.js Excel To JSON Converter
                     </h1>
                     <p className='text-gray-400 md:text-lg text-xs'>
                        Seleccionar el archivo Excel para convertir a JSON
                     </p>
                  </div>
               </div>
               <div>{children}</div>
            </div>
         </body>
      </html>
   );
}
