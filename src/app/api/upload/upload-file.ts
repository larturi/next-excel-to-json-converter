import { writeFile } from 'fs/promises';

export async function uploadFile(file: File, fileName: string) {
   try {
      const bytes = await file.arrayBuffer();
      await writeFile(fileName, Buffer.from(bytes));
      return 'Archivo guardado correctamente en el servidor';
   } catch (error) {
      throw new Error(
         'Error al intentar guardar el archivo en el servidor'
      );
   }
}
