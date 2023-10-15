import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prismadb from '@/app/libs/prismadb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadCloudinary } from './upload-cloudinary';
import { uploadFile } from './upload-file';

export async function POST(request: NextRequest) {
   const transformTo = request.nextUrl.searchParams.get('transformTo');

   const data = await request.formData();
   const file: File | null = data.get('file') as unknown as File;

   if (!file) {
      return NextResponse.json({
         success: false,
         message: 'No se ha podido subir el archivo xlsx al servidor',
      });
   }

   try {
      // Guardo en temp el file para luego convertirlo
      let filePath = ''
      if (transformTo === 'json') {
         filePath = '/tmp/excel.xlsx'
      } else {
         filePath = '/tmp/temp.json'
      }

      await uploadFile(file, filePath);

      const session = await getServerSession(authOptions);

      if (session && session.user.id) {
         // Guardo el file en Cloudinary (solo para usuarios autenticados)
         const urlCloudinaryFile = await uploadCloudinary(filePath);

         // Guardo en MongoDB el path de Cloudinary (solo para usuarios autenticados)
         await prismadb.file.create({
            data: {
               fileUrl: urlCloudinaryFile,
               userId: session.user.id,
            },
         });
         console.log('Guardado en BD');
      }

      return NextResponse.json({ success: true });
   } catch (error) {
      if (error instanceof Error) {
         return NextResponse.json({
            success: false,
            message: error.message,
         });
      }
   }
}
