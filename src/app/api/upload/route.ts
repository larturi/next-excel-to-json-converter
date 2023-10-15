import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/app/libs/prismadb';
import { uploadCloudinaryByFile } from './upload-cloudinary';
import { generateRandomName } from '@/app/utils/random-name';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
   const { searchParams } = new URL(request.url);
   const transformTo = searchParams.get('transformTo');
   const fileExtension = searchParams.get('fileExtension');

   const fileName = generateRandomName(fileExtension!);

   const data = await request.formData();
   const file: File | null = data.get('file') as unknown as File;

   if (!file) {
      return Response.json(
         {
            success: false,
            message: 'No se ha podido subir el archivo al servidor',
         },
         { status: 400 }
      );
   }

   try {
      const session = await getServerSession(authOptions);
      const urlCloudinaryFile = await uploadCloudinaryByFile(file, fileName);
      const userId = session && session.user.id ? session.user.id : null;

      const newFile = await prismadb.file.create({
         data: {
            fileUrl: urlCloudinaryFile,
            fileExtension: fileExtension!,
            convertedFileUrl: '',
            convertedExtension: transformTo!,
            userId: userId,
         },
      });

      return Response.json(
         {
            success: true,
            fileId: newFile.id,
            fileUrl: urlCloudinaryFile,
            fileName: fileName,
         },
         { status: 201 }
      );
   } catch (error) {
      if (error instanceof Error) {
         console.log(error);
         return Response.json(
            { success: false, message: error.message },
            { status: 400 }
         );
      }
   }
}
