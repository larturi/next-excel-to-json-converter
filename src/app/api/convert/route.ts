import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import XLSX from 'xlsx';

export async function POST(request: NextRequest) {

   // const filePath = path.join(process.cwd(), 'public/files', 'excel.xlsx');

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

   return NextResponse.json(jsonOutput);
}
