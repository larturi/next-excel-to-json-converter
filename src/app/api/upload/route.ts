import { NextRequest, NextResponse } from 'next/server';
import { uploadExcel } from './upload-xlsx';
import { uploadCloudinary } from './upload-cloudinary';

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

      // Guardo el file en Cloudinary
      const urlCloudinaryFile = await uploadCloudinary();

      // Guardo en MongoDB el path de Cloudinary

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
