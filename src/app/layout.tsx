import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'Next Converter | Excel to JSON',
   description: 'Upload an Excel file and return a JSON representation',
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang='en' className='bg-gray-800 h-full'>
         <body suppressHydrationWarning={true} className={`${inter.className} h-full`}>
            {children}
         </body>
      </html>
   );
}
