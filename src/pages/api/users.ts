import { NextApiRequest, NextApiResponse } from 'next';

const showUsers = (req:NextApiRequest, res: NextApiResponse) => {
  const users = [
    {id: 1, nome: "Daniel"},
    {id: 2, nome: "Hessa"},
    {id: 3, nome: "Danilo"},
  ]

  return res.json(users);
}

export default showUsers