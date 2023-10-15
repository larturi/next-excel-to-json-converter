import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import XLSX from 'xlsx';
import fs from 'fs';
import { uploadCloudinary } from '../upload/upload-cloudinary';
import prismadb from '@/app/libs/prismadb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const transformTo = request.nextUrl.searchParams.get('transformTo');
      const fileId = request.nextUrl.searchParams.get('fileId');

      let urlCloudinaryFileConverted;
      let filePath;

      const session = await getServerSession(authOptions);

      switch (transformTo) {
         case 'json':
            const jsonOutput = transformToJson();
            const jsonOutputString = JSON.stringify(jsonOutput);
            filePath = '/tmp/transformed.json';
            fs.writeFileSync(filePath, jsonOutputString);

            if (session && session.user.id) {
               // Guardo el file en Cloudinary (solo para usuarios autenticados)
               urlCloudinaryFileConverted = await uploadCloudinary(filePath);

               // Realiza la actualización en MongoDB
               await prismadb.file.update({
                  where: { id: fileId! },
                  data: {
                     convertedFileUrl: urlCloudinaryFileConverted,
                  },
               });
            }

            return NextResponse.json(jsonOutput);
         case 'xlsx':
            const xlsOutput = transformToExcel();
            filePath = '/tmp/transformed.xlsx';
            fs.writeFileSync(filePath, Buffer.from(xlsOutput!));

            if (session && session.user.id) {
               // Guardo el file en Cloudinary (solo para usuarios autenticados)
               urlCloudinaryFileConverted = await uploadCloudinary(filePath);

               // Realiza la actualización en MongoDB
               await prismadb.file.update({
                  where: { id: fileId! },
                  data: {
                     convertedFileUrl: urlCloudinaryFileConverted,
                  },
               });
            }

            return NextResponse.json(xlsOutput);
      }
   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'Error al analizar los datos JSON' });
   }
}

function transformToJson() {
   const workbook = XLSX.readFile('/tmp/excel.xlsx');
   const sheet_name_list = workbook.SheetNames;
   var jsonOutput: any[] = [];

   sheet_name_list.forEach(function (y: string | number) {
      const worksheet = workbook.Sheets[y];
      const headers: { [key: string]: any } = {};
      let data = [];
      for (const z in worksheet) {
         if (z[0] === '!') continue;

         let col = z.substring(0, 1) as string;
         let row = parseInt(z.substring(1));
         let value = worksheet[z].v;

         if (row == 1) {
            headers[col] = value;
            continue;
         }

         if (!data[row]) data[row] = {} as { [key: string]: any };
         data[row][headers[col]] = value;
      }
      data.shift();
      data.shift();
      jsonOutput = data;
   });

   return jsonOutput;
}

function transformToExcel() {
   try {
      const jsonData = JSON.parse(fs.readFileSync('/tmp/temp.json', 'utf8'));

      const ws = XLSX.utils.json_to_sheet(jsonData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      return new Uint8Array(excelBuffer);
   } catch (error) {
      console.error('Error al leer el archivo JSON:', error);
      return null;
   }
}
