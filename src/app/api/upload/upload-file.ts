import { writeFile } from 'fs/promises';
import path from 'path';

export async function uploadFile(file: File, fileName: string) {
   try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = path.join(process.cwd(), "public", fileName);

      await writeFile(filePath, buffer);
      return 'Archivo guardado correctamente en el servidor';
   } catch (error) {
       console.log(error);
      throw new Error(
         'Error al intentar guardar el archivo en el servidor'
      );
   }
}
