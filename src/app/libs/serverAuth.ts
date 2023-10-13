import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from '@/app/libs/prismadb';
import { authOptions } from "../api/auth/[...nextauth]/route";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  // if (!session?.user?.email) {
  //   throw new Error('Not signed in');
  // }

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: 'lea.arturi@gmail.com',
    }
  });
  
  // if (!currentUser) {
  //   throw new Error('Not signed in');
  // }

  return { currentUser };
}

export default serverAuth;