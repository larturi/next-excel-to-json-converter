import { cloudinary } from '@/app/config/config-cloudinary';

export async function uploadCloudinary() {
   try {
      const uploadResult = await cloudinary.uploader.upload('/tmp/excel.xlsx', {
         folder: 'next-excel-to-json',
         resource_type: 'raw',
      });
      return uploadResult.secure_url;
   } catch (error) {
      throw new Error('Error al intentar subir el archivo a Cloudinary');
   }
}
