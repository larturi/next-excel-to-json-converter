import { cloudinary } from '@/app/config/config-cloudinary';

export async function uploadCloudinaryByFile(file: File) {
   try {
      const arrayBuffer = await new Response(file).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const response: any = await new Promise((resolve, reject) => {
         cloudinary.uploader.upload_stream({
            folder: 'next-excel-to-json',
            resource_type: 'auto',
         }, (err, result) => {
            if (err) {
               reject(err);
            }
            resolve(result);
         }).end(buffer);
      }) 

      return response.secure_url;
   } catch (error) {
      console.log(error);
      throw new Error('Error al intentar subir el archivo a Cloudinary');
   }
}


export async function uploadCloudinaryByUrl(fileUrl: string) {
   try {
      console.log(fileUrl);
      const response = await cloudinary.uploader.upload(fileUrl, {
         folder: 'next-excel-to-json',
         resource_type: 'raw',
      });
      return response.secure_url;
   } catch (error) {
      console.log(error);
      throw new Error('Error al intentar subir el archivo a Cloudinary (uploadCloudinaryByUrl)');
   }
}
