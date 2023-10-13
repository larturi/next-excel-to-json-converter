import bcrypt from 'bcrypt';
import { NextResponse, NextRequest } from 'next/server';

import prismadb from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
   try {
      const { name, email, password } = await req.json();

      const existingUser = await prismadb.user.findUnique({
         where: {
            email,
         },
      });

      if (existingUser) {
         return NextResponse.json({ error: 'Email taken' }, { status: 422 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prismadb.user.create({
         data: {
            email,
            name,
            hashedPassword,
            emailVerified: new Date(),
         },
      });

      return NextResponse.json(user, { status: 200 });
   } catch (error) {
      console.error(error);
      return NextResponse.json('Error al intentar registrar el usuario', {
         status: 500,
      });
   }
}
