import { writeFile } from 'fs/promises';

export async function uploadExcel(file: File) {
   try {
      const bytes = await file.arrayBuffer();
      await writeFile(`/tmp/excel.xlsx`, Buffer.from(bytes));
      return 'Archivo guardado correctamente en el servidor';
   } catch (error) {
      throw new Error(
         'Error al intentar guardar el archivo xlsx en el servidor'
      );
   }
}
