import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prismadb from '@/app/libs/prismadb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadCloudinary } from './upload-cloudinary';
import { uploadExcel } from './upload-xlsx';

export async function POST(request: NextRequest) {
   const data = await request.formData();
   const file: File | null = data.get('file') as unknown as File;

   if (!file) {
      return NextResponse.json({
         success: false,
         message: 'No se ha podido subir el archivo xlsx al servidor',
      });
   }

   try {
      // Guardo en temp el Excel para luego convertirlo a JSON
      await uploadExcel(file);

      const session = await getServerSession(authOptions);

      if (session && session.user.id) {
         // Guardo el file en Cloudinary (solo para usuarios autenticados)
         const urlCloudinaryFile = await uploadCloudinary();

         // Guardo en MongoDB el path de Cloudinary (solo para usuarios autenticados)
         await prismadb.file.create({
            data: {
               fileUrl: urlCloudinaryFile,
               userId: session.user.id,
            },
         });
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
