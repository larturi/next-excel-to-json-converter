import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {

  const filePath = path.join(process.cwd(), 'public/files');

  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)


  await writeFile(`${filePath}/excel.xlsx`, buffer)

  return NextResponse.json({ success: true })
}