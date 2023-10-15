import { cloudinary } from '@/app/config/config-cloudinary';

export async function uploadCloudinary(filePath: string) {
   try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
         folder: 'next-excel-to-json',
         resource_type: 'raw',
      });
      return uploadResult.secure_url;
   } catch (error) {
      throw new Error('Error al intentar subir el archivo a Cloudinary');
   }
}
