import { cloudinary } from '@/app/config/config-cloudinary'

export async function uploadCloudinaryByFile(file: any, public_id: string): Promise<string> {
  const arrayBuffer = await new Response(file).arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const mime = file.type
  const encoding = 'base64'
  const base64Data = buffer.toString(encoding)
  const fileUri = `data:${mime};${encoding},${base64Data}`

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUri,
      {
        folder: 'next-excel-to-json',
        resource_type: 'raw',
        upload_preset: 'excel_json_converter',
        public_id: public_id,
        invalidate: true
      },
      (error, result) => {
        if (error) {
          console.error(error)
          reject(new Error('Error al intentar subir el archivo a Cloudinary'))
        } else {
          //  console.log(result)
          resolve(result!.secure_url)
        }
      }
    )
  })
}

export async function uploadCloudinaryByUrl(fileUrl: string) {
  try {
    console.log(fileUrl)
    const response = await cloudinary.uploader.upload(fileUrl, {
      folder: 'next-excel-to-json',
      resource_type: 'raw'
    })
    return response.secure_url
  } catch (error) {
    console.log(error)
    throw new Error('Error al intentar subir el archivo a Cloudinary (uploadCloudinaryByUrl)')
  }
}
